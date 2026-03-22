"use client";

import type { FinancialHealthScoreData } from "@/types/chat";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface FinancialHealthScoreProps {
  data: FinancialHealthScoreData;
}

const STATUS_BADGE: Record<string, { className: string }> = {
  good: { className: "bg-green-500/15 text-green-600 dark:text-green-400" },
  average: { className: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" },
  poor: { className: "bg-red-500/15 text-red-600 dark:text-red-400" },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return "stroke-green-500";
  if (score >= 60) return "stroke-yellow-500";
  if (score >= 40) return "stroke-orange-500";
  return "stroke-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

export function FinancialHealthScore({ data }: FinancialHealthScoreProps) {
  const { score, savingsRate, dtiRatio, emergencyMonths, insuranceCoverage, breakdown } = data;

  // SVG circle params
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <CardTitle>Financial Health Score</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score circle */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <svg width="100" height="100" className="-rotate-90">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-muted/50"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                className={getScoreRingColor(score)}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`financial-number text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>
          <Badge className={STATUS_BADGE[score >= 80 ? "good" : score >= 60 ? "average" : "poor"]?.className ?? STATUS_BADGE.poor.className}>
            {getScoreLabel(score)}
          </Badge>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Savings Rate</p>
            <p className="financial-number text-sm font-semibold">{savingsRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">DTI Ratio</p>
            <p className="financial-number text-sm font-semibold">{dtiRatio}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Emergency Fund</p>
            <p className="financial-number text-sm font-semibold">{emergencyMonths}mo</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Insurance</p>
            <p className="financial-number text-sm font-semibold">{insuranceCoverage}x</p>
          </div>
        </div>

        {/* Breakdown bars */}
        {breakdown.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Detailed Breakdown</p>
            {breakdown.map((item, i) => {
              const badgeStyle = STATUS_BADGE[item.status] ?? STATUS_BADGE.poor;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="financial-number font-semibold">{item.score}/100</span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${badgeStyle.className}`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === "good"
                          ? "bg-green-500"
                          : item.status === "average"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
