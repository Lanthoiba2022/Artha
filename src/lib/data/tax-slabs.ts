import type { TaxSlab } from "@/types/finance";

/**
 * India FY 2025-26 New Tax Regime Slabs
 * As per Union Budget 2025-26
 */
export const newRegimeSlabs: TaxSlab[] = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 0.05 },
  { min: 700001, max: 1000000, rate: 0.10 },
  { min: 1000001, max: 1200000, rate: 0.15 },
  { min: 1200001, max: 1500000, rate: 0.20 },
  { min: 1500001, max: Infinity, rate: 0.30 },
];

/** Standard deduction under new regime for FY 2025-26 */
export const standardDeduction = 75000;

/** Health and Education Cess rate */
export const cessRate = 0.04;

/** Income limit for Section 87A rebate under new regime */
export const rebateLimit = 700000;
