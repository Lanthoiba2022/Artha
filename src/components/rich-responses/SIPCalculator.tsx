"use client";

import { useState, useCallback, useMemo } from "react";
import type { SIPCalculatorData } from "@/types/chat";
import { sipFutureValue } from "@/lib/calculations/sip";
import { formatINR } from "@/lib/utils/format";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

interface SIPCalculatorProps {
  data: SIPCalculatorData;
}

export function SIPCalculator({ data }: SIPCalculatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(data.monthlyAmount);
  const [returnRate, setReturnRate] = useState(data.returnRate);
  const [tenureMonths, setTenureMonths] = useState(data.tenureMonths);

  const result = useMemo(
    () => sipFutureValue(monthlyAmount, returnRate / 100, tenureMonths),
    [monthlyAmount, returnRate, tenureMonths]
  );

  const handleMonthly = useCallback((val: number | readonly number[]) => {
    setMonthlyAmount(Array.isArray(val) ? val[0] : val);
  }, []);

  const handleReturn = useCallback((val: number | readonly number[]) => {
    setReturnRate(Array.isArray(val) ? val[0] : val);
  }, []);

  const handleTenure = useCallback((val: number | readonly number[]) => {
    setTenureMonths(Array.isArray(val) ? val[0] : val);
  }, []);

  // Visual bar widths
  const totalValue = result.futureValue || 1;
  const investedPct = (result.totalInvested / totalValue) * 100;
  const returnsPct = 100 - investedPct;

  const tenureYears = Math.floor(tenureMonths / 12);
  const tenureRemainder = tenureMonths % 12;
  const tenureLabel = [
    tenureYears > 0 ? `${tenureYears}y` : "",
    tenureRemainder > 0 ? `${tenureRemainder}m` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-primary" />
          <CardTitle>SIP Calculator</CardTitle>
        </div>
        <CardDescription>
          Adjust sliders to explore different scenarios
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Monthly Amount Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly Amount</span>
            <span className="financial-number font-semibold">
              {formatINR(monthlyAmount)}
            </span>
          </div>
          <Slider
            value={[monthlyAmount]}
            onValueChange={handleMonthly}
            min={500}
            max={100000}
            step={500}
          />
        </div>

        {/* Return Rate Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expected Return</span>
            <span className="financial-number font-semibold">
              {returnRate.toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[returnRate]}
            onValueChange={handleReturn}
            min={4}
            max={20}
            step={0.5}
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tenure</span>
            <span className="financial-number font-semibold">
              {tenureLabel} ({tenureMonths}m)
            </span>
          </div>
          <Slider
            value={[tenureMonths]}
            onValueChange={handleTenure}
            min={6}
            max={360}
            step={6}
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="financial-number text-sm font-semibold">
              {formatINR(result.totalInvested)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Returns</p>
            <p className="financial-number text-sm font-semibold text-green-600 dark:text-green-400">
              {formatINR(result.totalReturns)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Maturity</p>
            <p className="financial-number text-sm font-bold text-primary">
              {formatINR(result.futureValue)}
            </p>
          </div>
        </div>

        {/* Visual bar */}
        <div className="space-y-1">
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            <div
              className="bg-muted-foreground/30 transition-all duration-300"
              style={{ width: `${investedPct}%` }}
            />
            <div
              className="bg-green-500 transition-all duration-300"
              style={{ width: `${returnsPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-muted-foreground/30" />
              Invested ({investedPct.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-green-500" />
              Returns ({returnsPct.toFixed(0)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
