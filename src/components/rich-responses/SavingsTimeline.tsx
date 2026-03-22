"use client";

import type { SavingsTimelineData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface SavingsTimelineProps {
  data: SavingsTimelineData;
}

function computeValue(monthly: number, annualRate: number, months: number): number {
  if (annualRate === 0) return monthly * months;
  const r = annualRate / 100 / 12;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

const DEFAULT_POINTS = [12, 36, 60, 120, 180, 240];

export function SavingsTimeline({ data }: SavingsTimelineProps) {
  const { monthlyAmount, returnRate, tenureMonths, milestones } = data;

  // Build timeline points
  const points = milestones && milestones.length > 0
    ? milestones.map((m) => ({ month: m.month, label: m.label }))
    : DEFAULT_POINTS
        .filter((m) => m <= tenureMonths)
        .concat(DEFAULT_POINTS.includes(tenureMonths) ? [] : [tenureMonths])
        .map((m) => ({
          month: m,
          label: m < 12 ? `${m}m` : `${Math.floor(m / 12)}y${m % 12 ? ` ${m % 12}m` : ""}`,
        }));

  const values = points.map((p) => ({
    ...p,
    value: computeValue(monthlyAmount, returnRate, p.month),
    invested: monthlyAmount * p.month,
  }));

  const maxValue = Math.max(...values.map((v) => v.value), 1);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          <CardTitle>Savings Timeline</CardTitle>
        </div>
        <CardDescription>
          {formatINR(monthlyAmount)}/month at {returnRate}% p.a.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {values.map((point) => {
          const barPct = (point.value / maxValue) * 100;
          const investedPct = (point.invested / maxValue) * 100;
          return (
            <div key={point.month} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{point.label}</span>
                <span className="financial-number font-semibold text-primary">
                  {formatINR(point.value)}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 bg-muted-foreground/25 transition-all duration-300"
                  style={{ width: `${investedPct}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-primary/70 transition-all duration-300"
                  style={{ width: `${barPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span className="financial-number">Invested: {formatINR(point.invested)}</span>
                <span className="financial-number text-green-600 dark:text-green-400">
                  Returns: {formatINR(point.value - point.invested)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-muted-foreground/25" />
            Invested
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-primary/70" />
            Total Value
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
