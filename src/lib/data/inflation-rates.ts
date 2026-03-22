/**
 * Category-wise default inflation rates for India
 * Based on historical averages and RBI projections
 */

export type InflationCategory =
  | "general"
  | "education"
  | "healthcare"
  | "housing"
  | "food"
  | "transportation"
  | "lifestyle";

export const inflationRates: Record<InflationCategory, number> = {
  general: 0.06,
  education: 0.10,
  healthcare: 0.08,
  housing: 0.07,
  food: 0.08,
  transportation: 0.05,
  lifestyle: 0.06,
};

/** Default general inflation rate */
export const DEFAULT_INFLATION = 0.06;
