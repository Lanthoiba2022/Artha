"use client";

import type { EMICardData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

interface EMICardProps {
  data: EMICardData;
}

export function EMICard({ data }: EMICardProps) {
  const { principal, rate, tenure, emi, totalInterest, totalPayable, prepaymentSavings } = data;

  const principalPct = (principal / totalPayable) * 100;
  const interestPct = (totalInterest / totalPayable) * 100;

  const tenureYears = Math.floor(tenure / 12);
  const tenureMonths = tenure % 12;
  const tenureLabel = [
    tenureYears > 0 ? `${tenureYears}y` : "",
    tenureMonths > 0 ? `${tenureMonths}m` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <IndianRupee className="size-4 text-primary" />
          <CardTitle>EMI Breakdown</CardTitle>
        </div>
        <CardDescription>
          {formatINR(principal)} at {rate}% for {tenureLabel}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Large EMI number */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Monthly EMI</p>
          <p className="financial-number text-3xl font-bold text-primary">
            {formatINR(emi)}
          </p>
        </div>

        {/* Principal vs Interest bar */}
        <div className="space-y-1">
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary/70 transition-all duration-300"
              style={{ width: `${principalPct}%` }}
            />
            <div
              className="bg-orange-500/70 transition-all duration-300"
              style={{ width: `${interestPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-primary/70" />
              Principal ({principalPct.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-orange-500/70" />
              Interest ({interestPct.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Principal</p>
            <p className="financial-number text-sm font-semibold">{formatINR(principal)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Interest</p>
            <p className="financial-number text-sm font-semibold text-orange-600 dark:text-orange-400">
              {formatINR(totalInterest)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="financial-number text-sm font-bold">{formatINR(totalPayable)}</p>
          </div>
        </div>

        {/* Prepayment savings callout */}
        {prepaymentSavings != null && prepaymentSavings > 0 && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
            <p className="text-xs text-muted-foreground">Prepayment Savings</p>
            <p className="financial-number text-lg font-bold text-green-600 dark:text-green-400">
              {formatINR(prepaymentSavings)}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Save by making prepayments when possible
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Interest rate: {rate}% p.a. | Tenure: {tenureLabel}
        </p>
      </CardFooter>
    </Card>
  );
}
