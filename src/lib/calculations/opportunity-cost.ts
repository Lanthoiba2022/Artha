import type {
  BuyVsInvestResult,
  DepreciationEntry,
  OpportunityResult,
} from "@/types/finance";

/**
 * Compare buying a depreciating asset vs investing the same amount.
 * Returns asset value after depreciation, investment growth, and recommendation.
 */
export function buyVsInvest(
  purchasePrice: number,
  depreciationRate: number,
  investmentReturn: number,
  years: number
): BuyVsInvestResult {
  const assetValueAfter =
    purchasePrice * Math.pow(1 - depreciationRate, years);
  const investmentValueAfter =
    purchasePrice * Math.pow(1 + investmentReturn, years);
  const opportunityCost = investmentValueAfter - assetValueAfter;

  let recommendation: string;
  if (opportunityCost > purchasePrice * 0.5) {
    recommendation =
      "Investing is significantly better financially. Consider renting or buying a cheaper alternative.";
  } else if (opportunityCost > purchasePrice * 0.2) {
    recommendation =
      "Investing offers moderate gains over buying. Weigh the utility of ownership against the opportunity cost.";
  } else {
    recommendation =
      "The difference is marginal. If you need the asset, buying is reasonable.";
  }

  return {
    assetValueAfter,
    investmentValueAfter,
    opportunityCost,
    recommendation,
  };
}

/**
 * Generate a year-by-year depreciation schedule for an asset.
 * Uses declining-balance (reducing) depreciation method.
 */
export function depreciationModel(
  initialValue: number,
  annualDepreciation: number,
  years: number
): DepreciationEntry[] {
  const schedule: DepreciationEntry[] = [];
  let value = initialValue;

  for (let year = 1; year <= years; year++) {
    const depreciationAmount = value * annualDepreciation;
    value = value - depreciationAmount;

    schedule.push({
      year,
      value,
      depreciationAmount,
    });
  }

  return schedule;
}

/**
 * Calculate opportunity cost of paying loan EMIs vs investing that amount.
 * Shows what the EMI money would grow to if invested instead.
 */
export function loanVsInvestOpportunity(
  loanEMI: number,
  investmentReturn: number,
  loanTenure: number
): OpportunityResult {
  const totalLoanCost = loanEMI * loanTenure;

  // SIP future value formula: FV = P * [{(1 + r)^n - 1} / r] * (1 + r)
  const r = investmentReturn / 12;
  let ifInvestedInstead: number;
  if (r === 0) {
    ifInvestedInstead = totalLoanCost;
  } else {
    ifInvestedInstead =
      loanEMI * ((Math.pow(1 + r, loanTenure) - 1) / r) * (1 + r);
  }

  return {
    totalLoanCost,
    ifInvestedInstead,
    opportunityCost: ifInvestedInstead - totalLoanCost,
  };
}
