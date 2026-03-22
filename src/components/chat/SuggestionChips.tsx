"use client";

import { MessageSquare } from "lucide-react";
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
    <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/40 bg-card/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-95"
        >
          <MessageSquare className="h-3 w-3" />
          {chip}
        </button>
      ))}
    </div>
  );
}
