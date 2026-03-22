import { streamText, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { guardInput } from "@/lib/security/input-guard";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { getRelevantKBSections } from "@/lib/ai/kb-injector";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import type { UserProfile } from "@/types/user";
import type { Goal } from "@/types/finance";

function extractTextFromParts(
  parts: Array<{ type: string; text?: string }>
): string {
  return parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text!)
    .join("");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawMessages: UIMessage[] = body.messages ?? [];
    const extras = body.userProfile ?? {};
    const rawGoals = body.goals ?? [];

    // Rate limit
    const sessionId =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "anonymous";
    if (!checkRateLimit(sessionId)) {
      return new Response("Rate limit exceeded. Please wait a moment.", {
        status: 429,
      });
    }

    // Extract text from the latest user message
    const lastUserMsg = [...rawMessages].reverse().find((m) => m.role === "user");
    let lastUserText = "";
    if (lastUserMsg) {
      if ("content" in lastUserMsg && typeof lastUserMsg.content === "string") {
        lastUserText = lastUserMsg.content;
      } else if (lastUserMsg.parts) {
        lastUserText = extractTextFromParts(
          lastUserMsg.parts as Array<{ type: string; text?: string }>
        );
      }
    }

    // Input guard - jailbreak, prompt injection, topic control, PII masking
    if (lastUserText) {
      const guard = guardInput(lastUserText);
      if (!guard.allowed) {
        const msg =
          guard.redirect ||
          guard.reason ||
          "I can only help with personal finance topics. Please ask me about budgeting, saving, investing, or tax planning.";
        return new Response(msg, { status: 200 });
      }
      // Use sanitized text if PII was masked
      if (guard.sanitized) {
        lastUserText = guard.sanitized;
      }
    }

    // Build user profile
    const userProfile: UserProfile = {
      monthlyIncome: extras.monthlyIncome ?? null,
      monthlyExpenses: extras.monthlyExpenses ?? null,
      age: extras.age ?? null,
      city: null,
      riskTolerance: extras.riskTolerance ?? null,
      taxRegime: extras.taxRegime ?? null,
      existingInvestments: [],
    };

    const goals: Goal[] = (rawGoals || []).map(
      (g: { id: string; name: string; targetAmount: number; timelineMonths: number }) => ({
        id: g.id,
        name: g.name,
        targetAmount: g.targetAmount,
        inflatedTarget: g.targetAmount,
        timelineMonths: g.timelineMonths,
        monthlySavings: 0,
        category: "general",
        priority: 1,
        status: "active" as const,
        createdAt: Date.now(),
      })
    );

    // KB injection
    const kbSections = getRelevantKBSections(lastUserText);

    // System prompt
    const systemPrompt = buildSystemPrompt(userProfile, goals, kbSections);

    // Convert UI messages to model messages
    const modelMessages = rawMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => {
        let text = "";
        if ("content" in m && typeof m.content === "string") {
          text = m.content;
        } else if (m.parts) {
          text = extractTextFromParts(
            m.parts as Array<{ type: string; text?: string }>
          );
        }
        return { role: m.role as "user" | "assistant", content: text };
      })
      .filter((m) => m.content.length > 0);

    // Stream from Claude — no tool calls, all calculations are done
    // inline by the model using formulas in the system prompt.
    const result = streamText({
      model: anthropic(process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514"),
      maxOutputTokens: Number(process.env.MAX_TOKENS) || 4096,
      system: systemPrompt,
      messages: modelMessages,
      onError: (err) => {
        console.error("streamText error:", err);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      "I'm having trouble processing your request right now. Please try again in a moment.",
      { status: 200 }
    );
  }
}
