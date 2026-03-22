"use client";

import { useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversationStore } from "@/lib/store/conversation";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { UserInput } from "@/components/chat/UserInput";
import type { Message } from "@/types/chat";

export function ChatContainer() {
  const messages = useConversationStore((s) => s.messages);
  const phase = useConversationStore((s) => s.phase);
  const isStreaming = useConversationStore((s) => s.isStreaming);
  const addMessage = useConversationStore((s) => s.addMessage);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or streaming starts
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = useCallback(
    (text: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      addMessage(userMessage);
    },
    [addMessage]
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Message area */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="flex flex-col gap-4 p-4">
          {isEmpty ? (
            <WelcomeScreen onSend={handleSend} />
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isStreaming && <TypingIndicator />}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Suggestion chips */}
      {!isEmpty && (
        <SuggestionChips phase={phase} onSelect={handleSend} />
      )}

      {/* User input */}
      <UserInput onSubmit={handleSend} disabled={isStreaming} />
    </div>
  );
}
