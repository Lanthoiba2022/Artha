/**
 * Top Indian bank Fixed Deposit rates (% p.a.)
 * Rates as of March 2026 for general citizens
 */

export interface FDRateEntry {
  "1yr": number;
  "2yr": number;
  "3yr": number;
  "5yr": number;
}

export const fdRates: Record<string, FDRateEntry> = {
  SBI: { "1yr": 6.80, "2yr": 7.00, "3yr": 6.75, "5yr": 6.50 },
  HDFC: { "1yr": 7.05, "2yr": 7.15, "3yr": 7.10, "5yr": 7.00 },
  ICICI: { "1yr": 7.00, "2yr": 7.10, "3yr": 7.05, "5yr": 6.90 },
  Kotak: { "1yr": 7.10, "2yr": 7.20, "3yr": 7.10, "5yr": 6.90 },
};

/** Additional interest rate (% p.a.) for senior citizens (60+) */
export const seniorCitizenPremium = 0.50;
