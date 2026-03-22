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
  const updateField = useUserProfileStore((s) => s.updateField);

  const { messages, sendMessage, status } = useArthChat();
  const isStreaming = status === "streaming" || status === "submitted";

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Process EXTRACT markers from assistant messages to update profile
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant") {
      const text = getTextFromParts(lastMsg.parts as Array<{ type: string; text?: string }>);
      const parsed = parseResponse(text);
      for (const segment of parsed) {
        if (segment.type === "rich" && segment.component.type === "EXTRACT") {
          const { field, value } = segment.component.data;
          updateField(field as "monthlyIncome" | "monthlyExpenses" | "age", value as number);
        }
      }
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

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Header onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-72 shrink-0 border-r border-border/50 bg-card/30 md:block">
          <AppSidebar />
        </aside>

        {/* Mobile drawer */}
        <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

        {/* Chat area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 pb-2">
              {isEmpty ? (
                <WelcomeScreen onSend={handleSend} />
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  {isStreaming && <TypingIndicator />}
                </>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Suggestion chips */}
          {!isEmpty && (
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
