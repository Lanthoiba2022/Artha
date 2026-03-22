import type { InstrumentProfile } from "@/types/finance";

/**
 * Hardcoded instrument profiles with indicative return rates
 * for Indian financial instruments (FY 2025-26)
 */
export const instrumentProfiles: InstrumentProfile[] = [
  {
    id: "ppf",
    name: "PPF (Public Provident Fund)",
    returnRate: 7.1,
    riskLevel: "low",
    lockInMonths: 180,
    taxStatus: "EEE",
    description: "Government-backed long-term savings with tax-free returns.",
    minInvestment: 500,
    maxInvestment: 150000,
  },
  {
    id: "epf",
    name: "EPF (Employee Provident Fund)",
    returnRate: 8.15,
    riskLevel: "low",
    lockInMonths: 0,
    taxStatus: "EEE",
    description:
      "Employer-linked retirement fund. Withdrawable on job change or retirement.",
  },
  {
    id: "nps-equity",
    name: "NPS Equity (Tier I)",
    returnRate: 12.5,
    riskLevel: "moderate",
    lockInMonths: 0,
    taxStatus: "EET",
    description:
      "National Pension System equity allocation. Locked until age 60. Partial withdrawal allowed after 3 years.",
  },
  {
    id: "sgb",
    name: "Sovereign Gold Bond",
    returnRate: 10.5,
    riskLevel: "low",
    lockInMonths: 96,
    taxStatus: "taxable",
    description:
      "2.5% annual interest + ~8% gold appreciation. LTCG exempt if held to maturity (8 years).",
  },
  {
    id: "elss",
    name: "ELSS (Equity Linked Savings Scheme)",
    returnRate: 14,
    riskLevel: "high",
    lockInMonths: 36,
    taxStatus: "taxable",
    description:
      "Tax-saving mutual fund with 3-year lock-in. LTCG taxed at 12.5% above 1.25L.",
    maxInvestment: 150000,
  },
  {
    id: "large-cap-mf",
    name: "Large Cap Mutual Fund",
    returnRate: 12,
    riskLevel: "moderate",
    lockInMonths: 0,
    taxStatus: "taxable",
    description:
      "Equity fund investing in top 100 companies by market cap. Suitable for moderate risk appetite.",
  },
  {
    id: "mid-cap-mf",
    name: "Mid Cap Mutual Fund",
    returnRate: 15,
    riskLevel: "high",
    lockInMonths: 0,
    taxStatus: "taxable",
    description:
      "Equity fund investing in 101st-250th companies by market cap. Higher volatility, higher potential returns.",
  },
  {
    id: "debt-mf",
    name: "Debt Mutual Fund",
    returnRate: 7.5,
    riskLevel: "low",
    lockInMonths: 0,
    taxStatus: "taxable",
    description:
      "Fixed income fund investing in bonds and securities. Gains taxed at income tax slab rate.",
  },
  {
    id: "hybrid-mf",
    name: "Hybrid Mutual Fund",
    returnRate: 10,
    riskLevel: "moderate",
    lockInMonths: 0,
    taxStatus: "taxable",
    description:
      "Balanced fund with equity and debt mix. Tax treatment depends on equity allocation.",
  },
  {
    id: "rd",
    name: "Recurring Deposit",
    returnRate: 6.8,
    riskLevel: "low",
    lockInMonths: 0,
    taxStatus: "taxable",
    description:
      "Bank recurring deposit with fixed monthly contributions. Tenure varies. Interest taxable at slab rate.",
  },
  {
    id: "fd",
    name: "Fixed Deposit",
    returnRate: 7.0,
    riskLevel: "low",
    lockInMonths: 0,
    taxStatus: "taxable",
    description:
      "Bank fixed deposit with lump-sum investment. Tenure varies. Interest taxable at slab rate.",
  },
];
