export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  inflatedTarget: number;
  timelineMonths: number;
  monthlySavings: number;
  category: string;
  priority: number;
  status: 'active' | 'achieved' | 'abandoned';
  createdAt: number;
}

export interface Investment {
  name: string;
  type: 'sip' | 'lumpsum' | 'recurring';
  monthlyAmount: number;
  returnRate: number;
  riskLevel: 'low' | 'moderate' | 'high';
  lockInMonths: number;
  maturityValue: number;
  postTaxValue: number;
  taxStatus: string;
  description: string;
}

export interface InstrumentProfile {
  id: string;
  name: string;
  returnRate: number;
  riskLevel: 'low' | 'moderate' | 'high';
  lockInMonths: number;
  taxStatus: 'EEE' | 'EET' | 'taxable';
  description: string;
  minInvestment?: number;
  maxInvestment?: number;
}

export interface TaxResult {
  regime: 'old' | 'new';
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
}

export interface GoalSavingsResult {
  targetToday: number;
  inflatedTarget: number;
  timelineMonths: number;
  annualReturn: number;
  annualInflation: number;
  monthlySavingsNeeded: number;
}

export interface SIPResult {
  monthlyAmount: number;
  tenureMonths: number;
  annualReturn: number;
  totalInvested: number;
  futureValue: number;
  totalReturns: number;
}

export interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

export interface EMIResult {
  emi: number;
  totalPayable: number;
  totalInterest: number;
  principal: number;
}

export interface AmortizationEntry {
  month: number;
  emi: number;
  principalPart: number;
  interestPart: number;
  balance: number;
}

export interface PrepaymentResult {
  originalInterest: number;
  newInterest: number;
  interestSaved: number;
  newTenureMonths: number;
  monthsSaved: number;
}

export interface BuyVsInvestResult {
  assetValueAfter: number;
  investmentValueAfter: number;
  opportunityCost: number;
  recommendation: string;
}

export interface DepreciationEntry {
  year: number;
  value: number;
  depreciationAmount: number;
}

export interface OpportunityResult {
  totalLoanCost: number;
  ifInvestedInstead: number;
  opportunityCost: number;
}
