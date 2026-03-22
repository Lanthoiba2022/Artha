"use client";

import type { OpportunityCostData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Scale } from "lucide-react";

interface OpportunityCostCardProps {
  data: OpportunityCostData;
}

export function OpportunityCostCard({ data }: OpportunityCostCardProps) {
  const { purchaseItem, purchasePrice, assetValueAfter, investmentValueAfter, opportunityCost, years } = data;

  const maxVal = Math.max(assetValueAfter, investmentValueAfter, 1);
  const assetPct = (assetValueAfter / maxVal) * 100;
  const investPct = (investmentValueAfter / maxVal) * 100;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-primary" />
          <CardTitle>Buy vs Invest</CardTitle>
        </div>
        <CardDescription>
          What if you invested {formatINR(purchasePrice)} instead of buying {purchaseItem}?
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Split comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs font-medium text-muted-foreground">Buy {purchaseItem}</p>
            <p className="financial-number mt-1 text-lg font-bold">
              {formatINR(purchasePrice)}
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Worth after {years}y
            </p>
            <p className="financial-number text-sm font-semibold">
              {formatINR(assetValueAfter)}
            </p>
          </div>
          <div className="rounded-lg border border-primary bg-primary/5 p-3 text-center">
            <p className="text-xs font-medium text-muted-foreground">Invest Instead</p>
            <p className="financial-number mt-1 text-lg font-bold text-primary">
              {formatINR(purchasePrice)}
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Worth after {years}y
            </p>
            <p className="financial-number text-sm font-semibold text-green-600 dark:text-green-400">
              {formatINR(investmentValueAfter)}
            </p>
          </div>
        </div>

        {/* Visual bars */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{purchaseItem} value</span>
              <span className="financial-number">{formatINR(assetValueAfter)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-muted-foreground/40 transition-all duration-300"
                style={{ width: `${assetPct}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Investment value</span>
              <span className="financial-number">{formatINR(investmentValueAfter)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary/70 transition-all duration-300"
                style={{ width: `${investPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Opportunity cost callout */}
        <div className="rounded-lg bg-orange-500/10 p-3 text-center">
          <p className="text-xs text-muted-foreground">Opportunity Cost</p>
          <p className="financial-number text-xl font-bold text-orange-600 dark:text-orange-400">
            {formatINR(opportunityCost)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Potential wealth gap over {years} years
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This is not a recommendation - just a perspective on the true cost of spending
        </p>
      </CardFooter>
    </Card>
  );
}
