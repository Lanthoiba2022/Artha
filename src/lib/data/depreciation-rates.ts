export interface DepreciationProfile {
  newRate?: number;
  usedRate?: number;
  appreciation?: number;
  description: string;
}

/**
 * Common asset depreciation / appreciation rates for India.
 * Rates are annual and expressed as decimals (e.g. 0.15 = 15%).
 * Depreciating assets use newRate/usedRate; appreciating assets use appreciation.
 */
export const DEPRECIATION_RATES: Record<string, DepreciationProfile> = {
  car: {
    newRate: 0.15,
    usedRate: 0.10,
    description:
      "New cars lose ~15% per year; used cars depreciate slower at ~10% per year.",
  },
  two_wheeler: {
    newRate: 0.12,
    usedRate: 0.08,
    description:
      "Two-wheelers depreciate ~12% per year when new, ~8% when pre-owned.",
  },
  electronics: {
    newRate: 0.25,
    usedRate: 0.20,
    description:
      "Laptops, phones, and gadgets lose value fast - ~25% per year for new items.",
  },
  property_residential: {
    appreciation: 0.05,
    description:
      "Residential property in India typically appreciates ~5% per year on average.",
  },
  gold: {
    appreciation: 0.08,
    description:
      "Gold has historically appreciated ~8% annually in INR terms over the long run.",
  },
  furniture: {
    newRate: 0.10,
    usedRate: 0.08,
    description:
      "Furniture depreciates ~10% per year; quality wooden furniture holds value better.",
  },
};
