export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
export type TaxRegime = 'old' | 'new';

export interface UserProfile {
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
  age: number | null;
  city: string | null;
  riskTolerance: RiskTolerance | null;
  taxRegime: TaxRegime | null;
  existingInvestments: { type: string; amount: number }[];
}

// Derived fields computed from UserProfile
export interface DerivedProfile {
  disposableIncome: number;
  savingsRate: number;
  profileCompleteness: number;
}
