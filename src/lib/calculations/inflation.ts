/**
 * Inflation-adjusted value calculations.
 */

/**
 * Calculate the future cost of something after inflation.
 * Formula: futurePrice = currentCost * (1 + inflationRate)^years
 */
export function futureInflatedCost(
  currentCost: number,
  years: number,
  inflationRate: number = 0.06
): number {
  return currentCost * Math.pow(1 + inflationRate, years);
}

/**
 * Calculate the real (today's) purchasing-power value of a future amount.
 * Formula: realValue = futureAmount / (1 + inflationRate)^years
 */
export function realValue(
  futureAmount: number,
  years: number,
  inflationRate: number = 0.06
): number {
  return futureAmount / Math.pow(1 + inflationRate, years);
}
