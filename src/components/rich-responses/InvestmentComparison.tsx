"use client";

import type { ComparisonTableData } from "@/types/chat";
import { formatINR } from "@/lib/utils/format";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RISK_BADGE: Record<
  "low" | "moderate" | "high",
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className: "bg-green-500/15 text-green-600 dark:text-green-400",
  },
  moderate: {
    label: "Moderate",
    className: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  },
  high: {
    label: "High",
    className: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
};

function formatLockIn(months: number): string {
  if (months === 0) return "None";
  if (months < 12) return `${months}m`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years}y` : `${years.toFixed(1)}y`;
}

interface InvestmentComparisonProps {
  data: ComparisonTableData;
}

export function InvestmentComparison({ data }: InvestmentComparisonProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instrument</TableHead>
            <TableHead className="text-right">Monthly</TableHead>
            <TableHead className="text-right">Return (%)</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Lock-in</TableHead>
            <TableHead className="text-right">Maturity</TableHead>
            <TableHead className="text-right">Post-Tax</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.instruments.map((instrument) => {
            const risk = RISK_BADGE[instrument.riskLevel];
            return (
              <TableRow
                key={instrument.name}
                className={cn(
                  instrument.recommended &&
                    "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <TableCell className="font-medium">
                  {instrument.name}
                  {instrument.recommended && (
                    <span className="ml-1.5 text-xs text-primary">
                      (Recommended)
                    </span>
                  )}
                </TableCell>
                <TableCell className="financial-number text-right">
                  {formatINR(instrument.monthly)}
                </TableCell>
                <TableCell className="financial-number text-right">
                  {instrument.returnPercent.toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Badge className={risk.className}>{risk.label}</Badge>
                </TableCell>
                <TableCell className="financial-number text-right">
                  {formatLockIn(instrument.lockInMonths)}
                </TableCell>
                <TableCell className="financial-number text-right">
                  {formatINR(instrument.maturityValue)}
                </TableCell>
                <TableCell className="financial-number text-right">
                  {formatINR(instrument.postTaxValue)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
