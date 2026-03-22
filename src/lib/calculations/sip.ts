import type { SIPResult } from "@/types/finance";

/**
 * Calculate the future value of a Systematic Investment Plan (SIP).
 * Formula: FV = P * [{(1 + r)^n - 1} / r] * (1 + r)
 * where r = annualReturnRate / 12, n = months
 */
export function sipFutureValue(
  monthlyAmount: number,
  annualReturnRate: number,
  months: number
): SIPResult {
  const r = annualReturnRate / 12;
  const totalInvested = monthlyAmount * months;

  let fv: number;
  if (r === 0) {
    fv = totalInvested;
  } else {
    fv = monthlyAmount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  }

  return {
    monthlyAmount,
    tenureMonths: months,
    annualReturn: annualReturnRate,
    totalInvested,
    futureValue: fv,
    totalReturns: fv - totalInvested,
  };
}
