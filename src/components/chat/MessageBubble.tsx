"use client";

import { lazy, Suspense } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
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
const SavingsTimeline = lazy(() =>
  import("@/components/chat/rich/SavingsTimeline").then((m) => ({
    default: m.SavingsTimeline,
  }))
);
const TaxBreakdown = lazy(() =>
  import("@/components/chat/rich/TaxBreakdown").then((m) => ({
    default: m.TaxBreakdown,
  }))
);
const EMICard = lazy(() =>
  import("@/components/chat/rich/EMICard").then((m) => ({
    default: m.EMICard,
  }))
);
const InflationVisualizer = lazy(() =>
  import("@/components/chat/rich/InflationVisualizer").then((m) => ({
    default: m.InflationVisualizer,
  }))
);
const OpportunityCostCard = lazy(() =>
  import("@/components/chat/rich/OpportunityCostCard").then((m) => ({
    default: m.OpportunityCostCard,
  }))
);
const FinancialHealthScore = lazy(() =>
  import("@/components/chat/rich/FinancialHealthScore").then((m) => ({
    default: m.FinancialHealthScore,
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
    case "SAVINGS_TIMELINE":
      return (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <SavingsTimeline data={component.data} />
        </Suspense>
      );
    case "TAX_BREAKDOWN":
      return (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <TaxBreakdown data={component.data} />
        </Suspense>
      );
    case "EMI_CARD":
      return (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <EMICard data={component.data} />
        </Suspense>
      );
    case "INFLATION_VISUALIZER":
      return (
        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <InflationVisualizer data={component.data} />
        </Suspense>
      );
    case "OPPORTUNITY_COST":
      return (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <OpportunityCostCard data={component.data} />
        </Suspense>
      );
    case "FINANCIAL_HEALTH_SCORE":
      return (
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <FinancialHealthScore data={component.data} />
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
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="ml-auto max-w-[80%] animate-fade-in-up">
        <div className="rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground shadow-sm">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{message.content}</p>
        </div>
        <p className="mt-1 text-right text-[10px] text-muted-foreground/50">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    );
  }

  // Bot message
  const segments = parseResponse(message.content);

  // Custom markdown renderers for professional look
  const mdComponents: Components = {
    h1: ({ children }) => (
      <h3 className="mt-3 mb-1.5 text-sm font-bold text-primary">{children}</h3>
    ),
    h2: ({ children }) => (
      <h3 className="mt-3 mb-1.5 text-sm font-bold text-primary">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-2.5 mb-1 text-[13px] font-bold text-primary">{children}</h4>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => {
      // Detect disclaimer text (starts with warning emoji or contains "educational" / "SEBI")
      const text = typeof children === "string" ? children : "";
      const isDisclaimer =
        text.includes("educational") ||
        text.includes("SEBI") ||
        text.includes("past returns") ||
        text.includes("guaranteed") ||
        text.includes("Note:");
      if (isDisclaimer) {
        return (
          <span className="mt-2 block rounded-lg border border-border/30 bg-background/40 px-3 py-2 font-mono text-[10px] leading-relaxed text-muted-foreground/70 italic">
            {children}
          </span>
        );
      }
      return <em className="italic text-muted-foreground">{children}</em>;
    },
    p: ({ children }) => (
      <p className="my-1.5 text-[13px] leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-1.5 ml-4 list-disc space-y-0.5 text-[13px] leading-relaxed marker:text-primary/50">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-1.5 ml-4 list-decimal space-y-0.5 text-[13px] leading-relaxed marker:text-primary/50">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-[13px] leading-relaxed">{children}</li>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[11px] text-primary">{children}</code>
    ),
    table: ({ children }) => (
      <div className="my-2 overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full border-collapse text-[12px]">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-primary/10 text-left">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border/30">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-primary/5">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 text-[11px] font-semibold text-primary whitespace-nowrap">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 text-[12px] text-card-foreground whitespace-nowrap">{children}</td>
    ),
  };

  return (
    <div className="mr-auto flex max-w-[88%] items-start gap-2.5 animate-fade-in-up">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary shadow-sm">
        <span className="text-[10px] font-bold text-white">A</span>
      </div>
      <div className="min-w-0 space-y-1">
        <div className="rounded-2xl rounded-bl-sm border border-border/30 bg-card/60 px-4 py-3 text-card-foreground shadow-sm backdrop-blur-sm">
          {segments.map((segment, i) => {
            if (segment.type === "text") {
              return (
                <div key={i} className="max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{segment.content}</ReactMarkdown>
                </div>
              );
            }
            return (
              <RichComponentRenderer key={i} component={segment.component} />
            );
          })}
          {isStreaming && (
            <span className="inline-block h-4 w-0.5 animate-pulse bg-primary ml-0.5 align-middle" />
          )}
        </div>
        {!isStreaming && (
          <p className="pl-1 text-[10px] text-muted-foreground/50">
            {formatTimestamp(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
