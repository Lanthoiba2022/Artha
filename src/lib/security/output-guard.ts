const INVESTMENT_KEYWORDS = [
  'invest', 'sip', 'mutual fund', 'equity', 'returns', 'portfolio',
  'nps', 'elss', 'ppf', 'fd', 'gold', 'nifty', 'sensex', 'stock',
  'bond', 'debt fund', 'index fund', 'asset allocation',
];

const DISCLAIMER = '\n\n⚠️ *This is for educational purposes only. Past returns do not guarantee future performance. Please consult a SEBI-registered financial advisor before making investment decisions.*';

export function guardOutput(response: string): string {
  const lower = response.toLowerCase();
  const hasInvestmentAdvice = INVESTMENT_KEYWORDS.some(kw => lower.includes(kw));
  if (hasInvestmentAdvice) {
    return response + DISCLAIMER;
  }
  return response;
}
