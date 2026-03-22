"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { useUserProfileStore } from "@/lib/store/user-profile";
import { useGoalsStore } from "@/lib/store/goals";
import { formatINR, formatPercent } from "@/lib/utils/format";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="gradient-primary bg-clip-text text-transparent">
            Artha
          </DrawerTitle>
        </DrawerHeader>

        <div className="space-y-6 overflow-y-auto px-4 pb-6">
          {/* Profile Summary */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Profile Summary
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Income</span>
                <span className="font-medium">
                  {monthlyIncome ? formatINR(monthlyIncome) : "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium">
                  {monthlyExpenses ? formatINR(monthlyExpenses) : "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-medium">
                  {formatPercent(savingsRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{age ?? "Not set"}</span>
              </div>
            </div>
          </section>

          {/* Active Goals */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Active Goals
            </h3>
            {activeGoals.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No active goals yet.
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
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatINR(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              );
            })}
          </section>

          {/* Quick Stats */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Quick Stats
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Profile Completeness
                </span>
                <span className="font-medium">
                  {Math.round(profileCompleteness)}%
                </span>
              </div>
              <Progress value={profileCompleteness} className="h-1.5" />
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
