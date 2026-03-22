// Message types for the chat system
export type ConversationPhase = 'onboarding' | 'goal_setting' | 'analysis' | 'planning';

export type MarkerType = 'GOAL_CARD' | 'COMPARISON_TABLE' | 'SIP_CALCULATOR' | 'TAX_BREAKDOWN' | 'SAVINGS_TIMELINE' | 'OPPORTUNITY_COST' | 'EMI_CARD' | 'INFLATION_VISUALIZER' | 'FINANCIAL_HEALTH_SCORE' | 'EXTRACT';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  richComponents?: RichComponent[];
}

// Discriminated union for rich components parsed from :::MARKERS:::
export type RichComponent =
  | { type: 'GOAL_CARD'; data: GoalCardData }
  | { type: 'COMPARISON_TABLE'; data: ComparisonTableData }
  | { type: 'SIP_CALCULATOR'; data: SIPCalculatorData }
  | { type: 'SAVINGS_TIMELINE'; data: SavingsTimelineData }
  | { type: 'TAX_BREAKDOWN'; data: TaxBreakdownData }
  | { type: 'EMI_CARD'; data: EMICardData }
  | { type: 'INFLATION_VISUALIZER'; data: InflationVisualizerData }
  | { type: 'OPPORTUNITY_COST'; data: OpportunityCostData }
  | { type: 'FINANCIAL_HEALTH_SCORE'; data: FinancialHealthScoreData }
  | { type: 'EXTRACT'; data: ExtractData };

export interface GoalCardData {
  name: string;
  target: number;
  inflatedTarget: number;
  timeline: number; // months
  monthlySavings: number;
  achievability?: 'easy' | 'moderate' | 'tight' | 'exceeds';
}

export interface ComparisonTableData {
  instruments: {
    name: string;
    monthly: number;
    returnPercent: number;
    riskLevel: 'low' | 'moderate' | 'high';
    lockInMonths: number;
    maturityValue: number;
    postTaxValue: number;
    recommended?: boolean;
  }[];
}

export interface SIPCalculatorData {
  monthlyAmount: number;
  returnRate: number;
  tenureMonths: number;
  futureValue: number;
  totalInvested: number;
  totalReturns: number;
}

export interface SavingsTimelineData {
  monthlyAmount: number;
  returnRate: number;
  tenureMonths: number;
  milestones?: { month: number; label: string }[];
}

export interface TaxBreakdownData {
  grossIncome: number;
  oldRegimeTax: number;
  newRegimeTax: number;
  deductions: { section: string; amount: number; description?: string }[];
  recommendation?: string;
}

export interface EMICardData {
  principal: number;
  rate: number;
  tenure: number; // months
  emi: number;
  totalInterest: number;
  totalPayable: number;
  prepaymentSavings?: number;
}

export interface InflationVisualizerData {
  currentAmount: number;
  years: number;
  inflationRate: number;
  futureAmount: number;
  realValue: number;
}

export interface OpportunityCostData {
  purchaseItem: string;
  purchasePrice: number;
  assetValueAfter: number;
  investmentValueAfter: number;
  opportunityCost: number;
  years: number;
}

export interface FinancialHealthScoreData {
  score: number; // 0-100
  savingsRate: number;
  dtiRatio: number;
  emergencyMonths: number;
  insuranceCoverage: number;
  breakdown: { metric: string; score: number; status: 'good' | 'average' | 'poor' }[];
}

export interface ExtractData {
  field: string;
  value: string | number | boolean;
  confidence: 'high' | 'medium' | 'low';
}

// Response parser output
export type ParsedSegment =
  | { type: 'text'; content: string }
  | { type: 'rich'; component: RichComponent };
