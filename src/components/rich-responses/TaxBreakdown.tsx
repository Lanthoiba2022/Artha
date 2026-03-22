"use client";

import type { TaxBreakdownData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

interface TaxBreakdownProps {
  data: TaxBreakdownData;
}

export function TaxBreakdown({ data }: TaxBreakdownProps) {
  const { grossIncome, oldRegimeTax, newRegimeTax, deductions, recommendation } = data;
  const savings = Math.abs(oldRegimeTax - newRegimeTax);
  const betterRegime = oldRegimeTax <= newRegimeTax ? "Old Regime" : "New Regime";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-primary" />
            <CardTitle>Tax Comparison</CardTitle>
          </div>
          <Badge className="bg-primary/15 text-primary">{betterRegime}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Gross income */}
        <div>
          <p className="text-xs text-muted-foreground">Gross Income</p>
          <p className="financial-number text-sm font-semibold">{formatINR(grossIncome)}</p>
        </div>

        {/* Two-column comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-lg border p-3 ${oldRegimeTax <= newRegimeTax ? "border-primary bg-primary/5" : "border-border"}`}>
            <p className="text-xs font-medium text-muted-foreground">Old Regime</p>
            <p className="financial-number mt-1 text-lg font-bold">
              {formatINR(oldRegimeTax)}
            </p>
            {oldRegimeTax <= newRegimeTax && (
              <p className="mt-1 text-[10px] font-medium text-primary">Better</p>
            )}
          </div>
          <div className={`rounded-lg border p-3 ${newRegimeTax < oldRegimeTax ? "border-primary bg-primary/5" : "border-border"}`}>
            <p className="text-xs font-medium text-muted-foreground">New Regime</p>
            <p className="financial-number mt-1 text-lg font-bold">
              {formatINR(newRegimeTax)}
            </p>
            {newRegimeTax < oldRegimeTax && (
              <p className="mt-1 text-[10px] font-medium text-primary">Better</p>
            )}
          </div>
        </div>

        {/* Savings callout */}
        <div className="rounded-lg bg-green-500/10 p-3 text-center">
          <p className="text-xs text-muted-foreground">You save with {betterRegime}</p>
          <p className="financial-number text-lg font-bold text-green-600 dark:text-green-400">
            {formatINR(savings)}
          </p>
        </div>

        {/* Deductions */}
        {deductions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Deductions (Old Regime)</p>
            <div className="space-y-1.5">
              {deductions.map((d, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5">
                  <div>
                    <p className="text-xs font-medium">{d.section}</p>
                    {d.description && (
                      <p className="text-[10px] text-muted-foreground">{d.description}</p>
                    )}
                  </div>
                  <span className="financial-number text-xs font-semibold">{formatINR(d.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {recommendation && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">{recommendation}</p>
        </CardFooter>
      )}
    </Card>
  );
}
