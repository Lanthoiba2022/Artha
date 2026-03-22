"use client";

import { MessageSquare, PiggyBank, IndianRupee, LineChart } from "lucide-react";

const STARTER_CHIPS = [
  { label: "I want to save for a goal", icon: PiggyBank },
  { label: "Help me plan my budget", icon: IndianRupee },
  { label: "Compare investment options", icon: LineChart },
] as const;

interface WelcomeScreenProps {
  onSend: (message: string) => void;
}

export function WelcomeScreen({ onSend }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Logo mark */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25">
        <MessageSquare className="h-8 w-8 text-white" />
      </div>

      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Chat with{" "}
          <span className="text-primary">Artha</span>
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          Ask me anything about savings goals, SIP comparisons, tax planning,
          or EMI calculations. I&apos;ll crunch the numbers for you.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        {STARTER_CHIPS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onSend(label)}
            className="group flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-4 w-4" />
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
