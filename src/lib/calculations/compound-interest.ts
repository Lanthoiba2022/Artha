/**
 * Compound interest calculation utilities.
 */

/**
 * Calculate the future value of an investment with compound interest.
 * Formula: FV = P * (1 + r/n)^(n*t)
 */
export function futureValue(
  principal: number,
  annualRate: number,
  years: number,
  compoundingPerYear: number = 12
): number {
  return principal * Math.pow(1 + annualRate / compoundingPerYear, compoundingPerYear * years);
}

/**
 * Calculate the present value of a future amount.
 * Formula: PV = FV / (1 + r)^t
 */
export function presentValue(
  futureAmount: number,
  annualRate: number,
  years: number
): number {
  return futureAmount / Math.pow(1 + annualRate, years);
}
