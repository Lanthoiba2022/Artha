const INVESTMENT_KEYWORDS = [
  'invest', 'sip', 'mutual fund', 'equity', 'returns', 'portfolio',
  'nps', 'elss', 'ppf', 'fd', 'gold', 'nifty', 'sensex', 'stock',
  'bond', 'debt fund', 'index fund', 'asset allocation',
];

const DISCLAIMER = '\n\n*⚠️ This is for educational purposes only. Past returns do not guarantee future performance. Please consult a SEBI-registered financial advisor before making investment decisions.*';

// ---------- PII patterns ----------

const PII_PATTERNS: { pattern: RegExp; replacement: string }[] = [
  // Aadhaar: 1234-5678-9012 or 1234 5678 9012 or 123456789012
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: 'XXXX-XXXX-XXXX' },
  // PAN: ABCDE1234F
  { pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, replacement: 'XXXXX0000X' },
  // Credit card: 16 digits with optional spaces/dashes
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: 'XXXX-XXXX-XXXX-XXXX' },
  // Indian phone numbers: +91 or 0 prefix, 10 digits
  { pattern: /(?:\+91[\s-]?|0)\d{10}\b/g, replacement: '+91-XXXXXXXXXX' },
  // 10-digit standalone mobile numbers
  { pattern: /\b[6-9]\d{9}\b/g, replacement: 'XXXXXXXXXX' },
];

// ---------- guaranteed return claims ----------

const GUARANTEED_RETURN_PATTERNS: RegExp[] = [
  /guaranteed\s+(returns?|profit|income|growth)/i,
  /will\s+definitely\s+(earn|make|get|give|grow|return)/i,
  /assured\s+(returns?|profit)/i,
  /100%\s+(safe|sure|certain|guaranteed)/i,
  /no\s+risk\s+(at all|whatsoever|involved)/i,
  /risk[\s-]?free\s+(returns?|investment|profit)/i,
  /you\s+will\s+(earn|make|get)\s+\d+%/i,
];

const GUARANTEED_SOFTENER =
  '\n\n*📌 Note: No investment is completely risk-free and past performance does not guarantee future results. Returns mentioned above are historical/indicative and actual results may vary.*';

// ---------- main guard function ----------

export function guardOutput(response: string): string {
  let text = response;

  // 1. Mask PII
  for (const { pattern, replacement } of PII_PATTERNS) {
    text = text.replace(pattern, replacement);
  }

  // 2. Check if the model already included a disclaimer
  const alreadyHasDisclaimer =
    /sebi[- ]registered|educational\s+guidance|past\s+(returns?|performance)\s+(do\s+not|does\s+not)\s+guarantee/i.test(text);

  if (!alreadyHasDisclaimer) {
    // 3. Soften guaranteed return claims
    const hasGuaranteedClaim = GUARANTEED_RETURN_PATTERNS.some((p) =>
      p.test(text)
    );

    // 4. Add investment disclaimer if needed
    const lower = text.toLowerCase();
    const hasInvestmentAdvice = INVESTMENT_KEYWORDS.some((kw) =>
      lower.includes(kw)
    );

    if (hasGuaranteedClaim) {
      text += GUARANTEED_SOFTENER;
    } else if (hasInvestmentAdvice) {
      text += DISCLAIMER;
    }
  }

  return text;
}
