"use client";

import type { GoalCardData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import { useUserProfileStore } from "@/lib/store/user-profile";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

const BADGE_CONFIG = {
  easy: { label: "Easy", className: "bg-green-500/15 text-green-600 dark:text-green-400" },
  moderate: { label: "Moderate", className: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" },
  tight: { label: "Tight", className: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  exceeds: { label: "Exceeds Budget", className: "bg-red-500/15 text-red-600 dark:text-red-400" },
} as const;

function getAchievability(
  monthlySavings: number,
  disposableIncome: number
): GoalCardData["achievability"] {
  if (disposableIncome <= 0) return "exceeds";
  const ratio = monthlySavings / disposableIncome;
  if (ratio < 0.5) return "easy";
  if (ratio < 0.8) return "moderate";
  if (ratio <= 1) return "tight";
  return "exceeds";
}

interface GoalCardProps {
  data: GoalCardData;
}

export function GoalCard({ data }: GoalCardProps) {
  const disposableIncome = useUserProfileStore((s) => s.disposableIncome);

  const achievability =
    data.achievability ?? getAchievability(data.monthlySavings, disposableIncome);
  const badge = BADGE_CONFIG[achievability ?? "moderate"];

  const percentOfDisposable =
    disposableIncome > 0
      ? Math.min((data.monthlySavings / disposableIncome) * 100, 100)
      : 100;

  const timelineYears = Math.floor(data.timeline / 12);
  const timelineRemainingMonths = data.timeline % 12;
  const timelineLabel = [
    timelineYears > 0 ? `${timelineYears}y` : "",
    timelineRemainingMonths > 0 ? `${timelineRemainingMonths}m` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <CardTitle>{data.name}</CardTitle>
          </div>
          <Badge className={badge.className}>{badge.label}</Badge>
        </div>
        <CardDescription>Timeline: {timelineLabel}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Target amounts */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Target (Today)</p>
            <p className="financial-number text-sm font-semibold">
              {formatINR(data.target)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Inflation-Adjusted
            </p>
            <p className="financial-number text-sm font-semibold">
              {formatINR(data.inflatedTarget)}
            </p>
          </div>
        </div>

        {/* Monthly savings needed */}
        <div>
          <p className="text-xs text-muted-foreground">Monthly Savings Needed</p>
          <p className="financial-number text-lg font-bold text-primary">
            {formatINR(data.monthlySavings)}
          </p>
        </div>

        {/* Progress bar: % of disposable income */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>% of Disposable Income</span>
            <span className="financial-number">
              {percentOfDisposable.toFixed(1)}%
            </span>
          </div>
          <Progress value={percentOfDisposable} />
        </div>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Based on your current disposable income of{" "}
          <span className="financial-number font-medium">
            {formatINR(disposableIncome)}
          </span>
          /month
        </p>
      </CardFooter>
    </Card>
  );
}
