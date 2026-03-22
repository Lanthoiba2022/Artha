"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useUserProfileStore } from "@/lib/store/user-profile";
import { useGoalsStore } from "@/lib/store/goals";

export function useArthChat() {
  const profile = useUserProfileStore();
  const goals = useGoalsStore((s) => s.goals);

  const chat = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: {
        userProfile: {
          monthlyIncome: profile.monthlyIncome,
          monthlyExpenses: profile.monthlyExpenses,
          age: profile.age,
          riskTolerance: profile.riskTolerance,
          taxRegime: profile.taxRegime,
        },
        goals: goals.map((g) => ({
          id: g.id,
          name: g.name,
          targetAmount: g.targetAmount,
          timelineMonths: g.timelineMonths,
        })),
      },
    }),
  });

  return {
    messages: chat.messages,
    sendMessage: chat.sendMessage,
    status: chat.status,
    error: chat.error,
    setMessages: chat.setMessages,
    stop: chat.stop,
  };
}
