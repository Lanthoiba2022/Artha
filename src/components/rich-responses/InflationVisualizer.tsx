"use client";

import type { InflationVisualizerData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

interface InflationVisualizerProps {
  data: InflationVisualizerData;
}

export function InflationVisualizer({ data }: InflationVisualizerProps) {
  const { currentAmount, years, inflationRate, futureAmount, realValue } = data;

  const purchasingPowerLoss = currentAmount - realValue;
  const lossPct = currentAmount > 0 ? (purchasingPowerLoss / currentAmount) * 100 : 0;
  const realValuePct = currentAmount > 0 ? (realValue / currentAmount) * 100 : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingDown className="size-4 text-orange-500" />
          <CardTitle>Inflation Impact</CardTitle>
        </div>
        <CardDescription>
          How inflation at {inflationRate}% erodes your money over {years} years
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Today vs Future comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-primary bg-primary/5 p-3 text-center">
            <p className="text-xs text-muted-foreground">Today&apos;s Value</p>
            <p className="financial-number mt-1 text-lg font-bold text-primary">
              {formatINR(currentAmount)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Needed in {years}y
            </p>
            <p className="financial-number mt-1 text-lg font-bold">
              {formatINR(futureAmount)}
            </p>
          </div>
        </div>

        {/* Purchasing power visualization */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Purchasing Power Erosion</p>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 bg-primary/60 transition-all duration-500"
              style={{ width: `${realValuePct}%` }}
            />
            <div
              className="absolute inset-y-0 bg-red-500/40 transition-all duration-500"
              style={{ left: `${realValuePct}%`, width: `${lossPct}%` }}
            />
            {/* Label inside bar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-foreground/80">
                {realValuePct.toFixed(0)}% retained
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-primary/60" />
              Real Value
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-red-500/40" />
              Lost to Inflation
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Real Value After {years}y</p>
            <p className="financial-number text-sm font-semibold">{formatINR(realValue)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Purchasing Power Lost</p>
            <p className="financial-number text-sm font-semibold text-red-600 dark:text-red-400">
              {formatINR(purchasingPowerLoss)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
