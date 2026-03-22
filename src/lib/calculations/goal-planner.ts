import type { GoalSavingsResult } from "@/types/finance";

/**
 * Calculate the required monthly savings to reach a financial goal,
 * accounting for inflation and expected investment returns.
 *
 * Steps:
 * 1. Inflate the target: inflatedTarget = target * (1 + inflation)^(months/12)
 * 2. Solve for PMT: P = FV * r / [(1+r)^n - 1] / (1+r)
 *    where r = annualReturn/12, n = months
 */
export function requiredMonthlySavings(
  targetAmount: number,
  timelineMonths: number,
  annualReturn: number,
  annualInflation: number
): GoalSavingsResult {
  const years = timelineMonths / 12;
  const inflatedTarget = targetAmount * Math.pow(1 + annualInflation, years);

  const r = annualReturn / 12;
  let monthlySavingsNeeded: number;

  if (r === 0) {
    monthlySavingsNeeded = inflatedTarget / timelineMonths;
  } else {
    monthlySavingsNeeded =
      (inflatedTarget * r) / ((Math.pow(1 + r, timelineMonths) - 1) * (1 + r));
  }

  return {
    targetToday: targetAmount,
    inflatedTarget,
    timelineMonths,
    annualReturn,
    annualInflation,
    monthlySavingsNeeded,
  };
}
