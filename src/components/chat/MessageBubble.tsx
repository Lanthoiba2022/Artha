"use client";

import { lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { parseResponse } from "@/lib/ai/response-parser";
import type { Message, RichComponent } from "@/types/chat";

// Lazy-loaded rich components
const GoalCard = lazy(() =>
  import("@/components/chat/rich/GoalCard").then((m) => ({
    default: m.GoalCard,
  }))
);
const InvestmentComparison = lazy(() =>
  import("@/components/chat/rich/InvestmentComparison").then((m) => ({
    default: m.InvestmentComparison,
  }))
);
const SIPCalculator = lazy(() =>
  import("@/components/chat/rich/SIPCalculator").then((m) => ({
    default: m.SIPCalculator,
  }))
);

function RichComponentRenderer({ component }: { component: RichComponent }) {
  switch (component.type) {
    case "GOAL_CARD":
      return (
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <GoalCard data={component.data} />
        </Suspense>
      );
    case "COMPARISON_TABLE":
      return (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <InvestmentComparison data={component.data} />
        </Suspense>
      );
    case "SIP_CALCULATOR":
      return (
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <SIPCalculator data={component.data} />
        </Suspense>
      );
    case "EXTRACT":
      return null;
    default:
      return null;
  }
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="ml-auto max-w-[80%] animate-fade-in-up">
        <div className="bubble-user bg-primary px-4 py-3 text-primary-foreground shadow-sm">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        </div>
        <p className="mt-1 text-right text-[11px] text-muted-foreground/70">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    );
  }

  // Bot message
  const segments = parseResponse(message.content);

  return (
    <div className="mr-auto flex max-w-[85%] items-start gap-2.5 animate-fade-in-up">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary shadow-sm avatar-glow">
        <span className="text-xs font-bold text-white">A</span>
      </div>
      <div className="min-w-0 space-y-1.5">
        <div className="bubble-bot bg-card px-4 py-3 text-card-foreground shadow-sm">
          {segments.map((segment, i) => {
            if (segment.type === "text") {
              return (
                <div key={i} className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown>{segment.content}</ReactMarkdown>
                </div>
              );
            }
            return (
              <RichComponentRenderer key={i} component={segment.component} />
            );
          })}
        </div>
        <p className="pl-1 text-[11px] text-muted-foreground/70">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
