import { SAVING_PRINCIPLES_KB } from '@/lib/kb/saving-principles';
import { INVESTMENT_KB } from '@/lib/kb/investment';
import { TAX_OPTIMIZATION_KB } from '@/lib/kb/tax-optimization';
import { BUDGETING_KB } from '@/lib/kb/budgeting';
import { BEHAVIORAL_FINANCE_KB } from '@/lib/kb/behavioral-finance';
import { DEBT_MANAGEMENT_KB } from '@/lib/kb/debt-management';
import { RETIREMENT_KB } from '@/lib/kb/retirement';
import { RISK_MANAGEMENT_KB } from '@/lib/kb/risk-management';
import { INDIAN_INSTRUMENTS_KB } from '@/lib/kb/indian-instruments';
import { WEALTH_BUILDING_KB } from '@/lib/kb/wealth-building';
import { FINANCIAL_RATIOS_KB } from '@/lib/kb/financial-ratios';
import { LIFE_STAGES_KB } from '@/lib/kb/life-stages';

const KB_SECTIONS: Record<string, string> = {
  saving: SAVING_PRINCIPLES_KB,
  investment: INVESTMENT_KB,
  tax: TAX_OPTIMIZATION_KB,
  budgeting: BUDGETING_KB,
  behavioral: BEHAVIORAL_FINANCE_KB,
  debt: DEBT_MANAGEMENT_KB,
  retirement: RETIREMENT_KB,
  risk: RISK_MANAGEMENT_KB,
  instruments: INDIAN_INSTRUMENTS_KB,
  wealth: WEALTH_BUILDING_KB,
  ratios: FINANCIAL_RATIOS_KB,
  lifestages: LIFE_STAGES_KB,
};

const KB_TRIGGER_MAP: Record<string, string[]> = {
  saving: [
    "save", "saving", "emergency fund", "goal", "sinking fund",
    "budget", "salary", "spend", "50/30/20", "expense", "cut cost",
    "pay yourself", "windfall", "bonus", "impulse", "latte",
  ],
  investment: [
    "invest", "sip", "mutual fund", "fd", "ppf", "nps", "elss",
    "returns", "compound", "portfolio", "stock", "gold", "index fund",
    "nifty", "asset allocation", "rebalance", "diversif", "lump sum",
    "stp", "rule of 72",
  ],
  tax: [
    "tax", "80c", "80d", "hra", "regime", "deduction", "itr",
    "capital gains", "ltcg", "stcg", "80ccd", "tax loss", "harvest",
    "exemption", "old regime", "new regime",
  ],
  budgeting: [
    "budget", "50/30/20", "zero-based", "envelope", "track expense",
    "spending plan", "monthly plan", "expense track", "reverse budget",
    "pay yourself first", "overspend", "cash flow",
  ],
  behavioral: [
    "bias", "loss aversion", "anchor", "herd", "fomo", "impulse",
    "emotional", "panic sell", "sunk cost", "lifestyle inflation",
    "mental accounting", "endowment", "behavioral", "psychology",
    "overconfiden", "greed", "fear",
  ],
  debt: [
    "debt", "loan", "emi", "credit card", "borrow", "repay",
    "avalanche", "snowball", "prepay", "consolidat", "dti",
    "interest rate", "personal loan", "home loan", "car loan",
    "mortgage", "default",
  ],
  retirement: [
    "retire", "retirement", "pension", "4% rule", "fire",
    "corpus", "annuity", "swp", "epf", "nps", "old age",
    "superannuation", "bucket strategy", "25x rule",
  ],
  risk: [
    "insurance", "term plan", "health insurance", "life insurance",
    "cover", "claim", "nominee", "hlv", "risk", "protect",
    "critical illness", "disability", "premium", "ulip",
    "endowment", "mediclaim",
  ],
  instruments: [
    "ppf", "epf", "nps", "ssy", "sukanya", "scss", "senior citizen",
    "sgb", "gold bond", "kvp", "nsc", "recurring deposit", "rd",
    "post office", "small saving", "government scheme", "provident fund",
  ],
  wealth: [
    "compound", "rule of 72", "time value", "start early",
    "wealth", "rich", "crore", "asset allocation", "rebalance",
    "rupee cost", "stp", "lump sum vs sip", "double money",
    "grow wealth", "net worth",
  ],
  ratios: [
    "savings rate", "dti", "debt to income", "net worth",
    "expense ratio", "financial ratio", "benchmark", "return benchmark",
    "financial independence", "fi ratio", "liquid net worth",
    "wealth to income", "how much should i save", "am i on track",
  ],
  lifestages: [
    "first job", "student", "20s", "30s", "40s", "50s", "60s",
    "young", "retire", "career start", "marriage", "child",
    "education fund", "life stage", "age", "beginner",
    "starting out", "college", "fresher",
  ],
};

/**
 * Determines which knowledge base sections are relevant to the user's message
 * based on keyword matching, and returns them concatenated as a string
 * for injection into the LLM system prompt.
 *
 * Returns up to 3 sections. Falls back to saving + investment if no keywords match.
 */
export function getRelevantKBSections(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  const sectionScores: { key: string; score: number }[] = [];

  for (const [sectionKey, triggers] of Object.entries(KB_TRIGGER_MAP)) {
    let score = 0;
    for (const trigger of triggers) {
      if (lowerMessage.includes(trigger)) {
        score += 1;
      }
    }
    if (score > 0) {
      sectionScores.push({ key: sectionKey, score });
    }
  }

  // Sort by score descending so the most relevant sections come first
  sectionScores.sort((a, b) => b.score - a.score);

  // Pick top 3 matched sections
  const matchedKeys = sectionScores.slice(0, 3).map((s) => s.key);

  // Fallback: if no keywords matched, provide saving + investment as sensible defaults
  if (matchedKeys.length === 0) {
    matchedKeys.push('saving', 'investment');
  }

  const sections = matchedKeys
    .map((key) => KB_SECTIONS[key])
    .filter(Boolean);

  return sections.join('\n\n');
}
