"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { UserInput } from "@/components/chat/UserInput";
import { useArthChat } from "@/hooks/useChat";
import { useUserProfileStore } from "@/lib/store/user-profile";
import { parseResponse } from "@/lib/ai/response-parser";
import type { Message, ConversationPhase } from "@/types/chat";

function getTextFromParts(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

export default function ChatPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [phase] = useState<ConversationPhase>("onboarding");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const updateField = useUserProfileStore((s) => s.updateField);

  const { messages, sendMessage, status } = useArthChat();
  const isStreaming = status === "streaming" || status === "submitted";

  // Track whether the user is near the bottom of the chat
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll only when user is near the bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  // Process EXTRACT markers from assistant messages to update profile
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && !isStreaming) {
      const text = getTextFromParts(lastMsg.parts as Array<{ type: string; text?: string }>);
      const parsed = parseResponse(text);
      for (const segment of parsed) {
        if (segment.type === "rich" && segment.component.type === "EXTRACT") {
          const { field, value } = segment.component.data;
          updateField(field as "monthlyIncome" | "monthlyExpenses" | "age", value as number);
        }
      }
    }
  }, [messages, updateField, isStreaming]);

  // Client-side extraction fallback: parse user messages for income/expenses/age
  // This runs when the user sends a message, so profile updates immediately
  // even if the AI doesn't emit EXTRACT markers
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role !== "user") return;
    const text = getTextFromParts(lastMsg.parts as Array<{ type: string; text?: string }>);
    const lower = text.toLowerCase();

    // Extract income: "earning 80k", "income 80,000", "salary 80000", "earn 80k"
    const incomeMatch = text.match(/(?:earn(?:ing)?|income|salary|take[\s-]*home|ctc|in[\s-]*hand)\s*(?:is\s*)?(?:of\s*)?(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:k|K|thousand)?/i);
    if (incomeMatch) {
      let val = parseInt(incomeMatch[1].replace(/,/g, ""), 10);
      if (lower.includes("k") || lower.includes("thousand")) val *= 1000;
      if (lower.includes("lpa") || lower.includes("per annum") || lower.includes("annual")) val = Math.round(val / 12);
      if (val > 1000 && val < 10000000) updateField("monthlyIncome", val);
    }

    // Extract expenses: "spend 45k", "expenses 45,000", "spending 45000"
    const expenseMatch = text.match(/(?:spend(?:ing)?|expense|expens(?:es)?)\s*(?:is\s*)?(?:of\s*)?(?:about\s*)?(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:k|K|thousand)?/i);
    if (expenseMatch) {
      let val = parseInt(expenseMatch[1].replace(/,/g, ""), 10);
      if (/\bk\b/i.test(text) || lower.includes("thousand")) val *= 1000;
      if (val > 1000 && val < 10000000) updateField("monthlyExpenses", val);
    }

    // Extract age: "I'm 28", "age 28", "28 years old", "28 year old"
    const ageMatch = text.match(/(?:(?:i'?m|i am|age(?:\s+is)?)\s+(\d{1,2})(?:\s*(?:years?|yrs?)?\s*(?:old)?)?)|(?:(\d{1,2})\s*(?:years?|yrs?)\s*old)/i);
    if (ageMatch) {
      const val = parseInt(ageMatch[1] || ageMatch[2], 10);
      if (val >= 16 && val <= 100) updateField("age", val);
    }
  }, [messages, updateField]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  // Convert AI SDK UIMessages to our Message type for rendering
  const chatMessages: Message[] = messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: getTextFromParts(m.parts as Array<{ type: string; text?: string }>),
    timestamp: Date.now(),
  }));

  const isEmpty = chatMessages.length === 0;

  // Only show typing indicator when streaming AND the bot hasn't started responding yet
  // (i.e., the last message is from the user, meaning the bot response hasn't begun)
  const lastMessage = chatMessages[chatMessages.length - 1];
  const showTyping = isStreaming && (!lastMessage || lastMessage.role === "user" || lastMessage.content === "");

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Header onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop only */}
        <aside className="hidden w-72 shrink-0 border-r border-border/40 bg-card/20 md:block">
          <AppSidebar />
        </aside>

        {/* Mobile drawer */}
        <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

        {/* Chat area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 pb-2">
              {isEmpty ? (
                <WelcomeScreen onSend={handleSend} />
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isStreaming={isStreaming && msg.id === lastMessage?.id && msg.role === "assistant"}
                    />
                  ))}
                  {showTyping && <TypingIndicator />}
                </>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Suggestion chips - only show when not streaming */}
          {!isEmpty && !isStreaming && (
            <SuggestionChips phase={phase} onSelect={handleSend} />
          )}

          {/* Input */}
          <div className="mx-auto w-full max-w-3xl">
            <UserInput onSubmit={handleSend} disabled={isStreaming} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
