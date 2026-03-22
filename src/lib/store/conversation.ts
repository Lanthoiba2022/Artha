import { create } from "zustand";
import type { Message, ConversationPhase } from "@/types/chat";

const PHASE_ORDER: ConversationPhase[] = [
  "onboarding",
  "goal_setting",
  "analysis",
  "planning",
];

interface ConversationState {
  messages: Message[];
  phase: ConversationPhase;
  isStreaming: boolean;
  addMessage: (msg: Message) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (v: boolean) => void;
  advancePhase: () => void;
  clearMessages: () => void;
}

export const useConversationStore = create<ConversationState>()((set) => ({
  messages: [],
  phase: "onboarding",
  isStreaming: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (content) =>
    set((state) => {
      if (state.messages.length === 0) return state;
      const updated = [...state.messages];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content,
      };
      return { messages: updated };
    }),

  setStreaming: (v) => set({ isStreaming: v }),

  advancePhase: () =>
    set((state) => {
      const currentIndex = PHASE_ORDER.indexOf(state.phase);
      if (currentIndex < PHASE_ORDER.length - 1) {
        return { phase: PHASE_ORDER[currentIndex + 1] };
      }
      return state;
    }),

  clearMessages: () => set({ messages: [], phase: "onboarding" }),
}));
