// Message types for the chat system
export type ConversationPhase = 'onboarding' | 'goal_setting' | 'analysis' | 'planning';

export type MarkerType = 'GOAL_CARD' | 'COMPARISON_TABLE' | 'SIP_CALCULATOR' | 'TAX_BREAKDOWN' | 'SAVINGS_TIMELINE' | 'OPPORTUNITY_COST' | 'EXTRACT';

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

export interface ExtractData {
  field: string;
  value: string | number | boolean;
  confidence: 'high' | 'medium' | 'low';
}

// Response parser output
export type ParsedSegment =
  | { type: 'text'; content: string }
  | { type: 'rich'; component: RichComponent };
