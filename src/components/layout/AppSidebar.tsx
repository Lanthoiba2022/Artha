"use client";

import { Wallet, CreditCard, TrendingUp, User, Target, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUserProfileStore } from "@/lib/store/user-profile";
import { useGoalsStore } from "@/lib/store/goals";
import { formatINR, formatPercent } from "@/lib/utils/format";

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="financial-number font-medium">{value}</span>
    </div>
  );
}

export function AppSidebar() {
  const {
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    age,
    profileCompleteness,
  } = useUserProfileStore();
  const goals = useGoalsStore((s) => s.goals);
  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      {/* Profile Summary */}
      <div className="mb-5 rounded-xl border border-border/50 bg-card/50 p-3.5">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <User className="h-3 w-3" />
          Profile Summary
        </h3>
        <div className="space-y-2.5">
          <StatRow
            icon={Wallet}
            label="Income"
            value={monthlyIncome ? formatINR(monthlyIncome) : "Not set"}
          />
          <StatRow
            icon={CreditCard}
            label="Expenses"
            value={monthlyExpenses ? formatINR(monthlyExpenses) : "Not set"}
          />
          <StatRow
            icon={TrendingUp}
            label="Savings"
            value={formatPercent(savingsRate)}
          />
          <StatRow
            icon={User}
            label="Age"
            value={age ? String(age) : "Not set"}
          />
        </div>
      </div>

      {/* Active Goals */}
      <div className="mb-5 rounded-xl border border-border/50 bg-card/50 p-3.5">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Target className="h-3 w-3" />
          Active Goals
        </h3>
        <div className="space-y-3">
          {activeGoals.length === 0 && (
            <p className="text-xs text-muted-foreground/70">
              No active goals yet. Start chatting to set your first goal.
            </p>
          )}
          {activeGoals.map((goal) => {
            const progress = goal.inflatedTarget
              ? Math.min(
                  ((goal.monthlySavings * goal.timelineMonths) /
                    goal.inflatedTarget) *
                    100,
                  100
                )
              : 0;

            return (
              <div key={goal.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{goal.name}</span>
                  <span className="financial-number text-xs text-muted-foreground">
                    {formatINR(goal.targetAmount)}
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-3.5">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <BarChart3 className="h-3 w-3" />
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Complete</span>
            <span className="font-medium">
              {Math.round(profileCompleteness)}%
            </span>
          </div>
          <Progress value={profileCompleteness} className="h-1.5" />
        </div>
      </div>
    </div>
  );
}
