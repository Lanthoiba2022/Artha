"use client";

import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useUserProfileStore } from "@/lib/store/user-profile";
import { useGoalsStore } from "@/lib/store/goals";

export function useArthChat() {
  const monthlyIncome = useUserProfileStore((s) => s.monthlyIncome);
  const monthlyExpenses = useUserProfileStore((s) => s.monthlyExpenses);
  const age = useUserProfileStore((s) => s.age);
  const riskTolerance = useUserProfileStore((s) => s.riskTolerance);
  const taxRegime = useUserProfileStore((s) => s.taxRegime);
  const goals = useGoalsStore((s) => s.goals);

  // TextStreamChatTransport for simple text streaming (no tool calls)
  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/chat",
        body: {
          userProfile: {
            monthlyIncome,
            monthlyExpenses,
            age,
            riskTolerance,
            taxRegime,
          },
          goals: goals.map((g) => ({
            id: g.id,
            name: g.name,
            targetAmount: g.targetAmount,
            timelineMonths: g.timelineMonths,
          })),
        },
      }),
    [monthlyIncome, monthlyExpenses, age, riskTolerance, taxRegime, goals]
  );

  const chat = useChat({ transport });

  return {
    messages: chat.messages,
    sendMessage: chat.sendMessage,
    status: chat.status,
    error: chat.error,
    setMessages: chat.setMessages,
    stop: chat.stop,
  };
}
