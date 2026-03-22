import type { TaxResult } from "@/types/finance";
import {
  newRegimeSlabs as NEW_REGIME_SLABS,
  standardDeduction as STANDARD_DEDUCTION,
  cessRate as CESS_RATE,
  rebateLimit as REBATE_LIMIT,
  oldRegimeSlabs as OLD_REGIME_SLABS,
  oldRegimeStandardDeduction as OLD_REGIME_STANDARD_DEDUCTION,
  oldRegimeRebateLimit as OLD_REGIME_REBATE_LIMIT,
} from "@/lib/data/tax-slabs";

/**
 * Calculate income tax under the New Tax Regime (FY 2025-26).
 *
 * 1. Subtract standard deduction from gross income.
 * 2. If taxable income <= rebate limit, tax is 0 (Section 87A rebate).
 * 3. Apply slab rates progressively.
 * 4. Add 4% health & education cess.
 */
export function calculateNewRegimeTax(grossIncome: number): TaxResult {
  const taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);

  // Section 87A rebate
  if (taxableIncome <= REBATE_LIMIT) {
    return {
      regime: "new",
      grossIncome,
      standardDeduction: STANDARD_DEDUCTION,
      totalDeductions: STANDARD_DEDUCTION,
      taxableIncome,
      taxBeforeCess: 0,
      cess: 0,
      totalTax: 0,
      effectiveRate: 0,
      marginalRate: 0,
    };
  }

  // Progressive slab calculation
  let taxBeforeCess = 0;
  let marginalRate = 0;

  for (const slab of NEW_REGIME_SLABS) {
    if (taxableIncome <= slab.min) break;

    const upper = Math.min(taxableIncome, slab.max);
    const taxableInSlab = upper - slab.min;

    taxBeforeCess += taxableInSlab * slab.rate;
    marginalRate = slab.rate;
  }

  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    regime: "new",
    grossIncome,
    standardDeduction: STANDARD_DEDUCTION,
    totalDeductions: STANDARD_DEDUCTION,
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate,
    marginalRate,
  };
}

/**
 * Calculate income tax under the Old Tax Regime (FY 2025-26).
 *
 * 1. Subtract standard deduction and additional deductions (80C, 80D, etc.).
 * 2. If taxable income <= rebate limit, tax is 0 (Section 87A rebate).
 * 3. Apply slab rates progressively.
 * 4. Add 4% health & education cess.
 */
export function calculateOldRegimeTax(
  grossIncome: number,
  deductions: number = 0
): TaxResult {
  const totalDeductions = OLD_REGIME_STANDARD_DEDUCTION + deductions;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Section 87A rebate
  if (taxableIncome <= OLD_REGIME_REBATE_LIMIT) {
    return {
      regime: "old",
      grossIncome,
      standardDeduction: OLD_REGIME_STANDARD_DEDUCTION,
      totalDeductions,
      taxableIncome,
      taxBeforeCess: 0,
      cess: 0,
      totalTax: 0,
      effectiveRate: 0,
      marginalRate: 0,
    };
  }

  // Progressive slab calculation
  let taxBeforeCess = 0;
  let marginalRate = 0;

  for (const slab of OLD_REGIME_SLABS) {
    if (taxableIncome <= slab.min) break;

    const upper = Math.min(taxableIncome, slab.max);
    const taxableInSlab = upper - slab.min;

    taxBeforeCess += taxableInSlab * slab.rate;
    marginalRate = slab.rate;
  }

  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    regime: "old",
    grossIncome,
    standardDeduction: OLD_REGIME_STANDARD_DEDUCTION,
    totalDeductions,
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate,
    marginalRate,
  };
}
