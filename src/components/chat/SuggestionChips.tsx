"use client";

import type { ConversationPhase } from "@/types/chat";

const PHASE_SUGGESTIONS: Record<ConversationPhase, string[]> = {
  onboarding: [
    "Tell me about yourself",
    "I have a savings goal",
    "How should I budget?",
  ],
  goal_setting: [
    "Set a new goal",
    "Compare investments",
    "Check my tax",
  ],
  analysis: [
    "Show opportunity cost",
    "What about inflation?",
    "Extend timeline",
  ],
  planning: [
    "Summarize my plan",
    "What should I do first?",
    "Export plan",
  ],
};

interface SuggestionChipsProps {
  suggestions?: string[];
  phase?: ConversationPhase;
  onSelect: (text: string) => void;
}

export function SuggestionChips({
  suggestions,
  phase,
  onSelect,
}: SuggestionChipsProps) {
  const chips = suggestions ?? (phase ? PHASE_SUGGESTIONS[phase] : []);

  if (chips.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
