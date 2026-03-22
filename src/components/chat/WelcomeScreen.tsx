"use client";

import { Target, PiggyBank, BarChart3, Sparkles } from "lucide-react";

const STARTER_CHIPS = [
  { label: "I want to save for a goal", icon: Target },
  { label: "Help me plan my budget", icon: PiggyBank },
  { label: "Compare investment options", icon: BarChart3 },
] as const;

interface WelcomeScreenProps {
  onSend: (message: string) => void;
}

export function WelcomeScreen({ onSend }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Logo mark */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/20">
        <Sparkles className="h-8 w-8 text-white" />
      </div>

      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="gradient-primary bg-clip-text text-transparent">
            Artha
          </span>
        </h1>
        <p className="mx-auto max-w-sm text-muted-foreground">
          Your AI-powered personal budget companion. Ask me anything about
          savings, investments, or tax planning.
        </p>
      </div>

      <div className="stagger-children flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        {STARTER_CHIPS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onSend(label)}
            className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]"
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
