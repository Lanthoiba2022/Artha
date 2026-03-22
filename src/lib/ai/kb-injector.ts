import { SAVING_PRINCIPLES_KB } from '@/lib/kb/saving-principles';
import { INVESTMENT_KB } from '@/lib/kb/investment';
import { TAX_OPTIMIZATION_KB } from '@/lib/kb/tax-optimization';

const KB_SECTIONS: Record<string, string> = {
  saving: SAVING_PRINCIPLES_KB,
  investment: INVESTMENT_KB,
  tax: TAX_OPTIMIZATION_KB,
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
