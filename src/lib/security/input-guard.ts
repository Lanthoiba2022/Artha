export interface GuardResult {
  allowed: boolean;
  reason?: string;
  redirect?: string;
  /** Text with PII masked - use this instead of raw input */
  sanitized?: string;
}

// ── Jailbreak & Prompt Injection Patterns ──────────────────────────────────

const JAILBREAK_PATTERNS: RegExp[] = [
  // Direct instruction override
  /ignore\s+(all\s+)?(previous|prior|above|your|system)\s+(instructions|rules|prompts?|guidelines)/i,
  /disregard\s+(all\s+)?(previous|prior|above|your)\s+(instructions|rules|prompts?)/i,
  /forget\s+(everything|all|your)\s+(rules|instructions|training|guidelines|persona)/i,
  /override\s+(your|the|all)\s+(rules|instructions|safety|guidelines|restrictions)/i,
  /bypass\s+(your|the|all|any)\s+(safety|filter|guard|restrict|rules|moderation)/i,

  // Role manipulation
  /you\s+are\s+now\s+(a|an|the|my)\s/i,
  /(act|behave|pretend|roleplay|function)\s+(as|like|you'?re)\s+(a|an|the|my|not)\s/i,
  /new\s+(persona|identity|role|character|mode)/i,
  /switch\s+to\s+(a\s+)?(different|new|unrestricted)\s+(mode|persona|role)/i,
  /enter\s+(developer|god|admin|unrestricted|debug)\s+mode/i,

  // System prompt extraction
  /(reveal|show|display|print|output|repeat|dump|leak)\s+(your\s+)?(system\s+)?(prompt|instructions|rules|guidelines|config)/i,
  /what\s+(are|is)\s+your\s+(system\s+)?(prompt|instructions|rules|initial\s+prompt)/i,
  /tell\s+me\s+(your|the)\s+(system\s+)?(prompt|instructions|rules)/i,

  // Known jailbreak techniques
  /\bDAN\b/,
  /\bjailbreak\b/i,
  /do\s+anything\s+now/i,
  /\bDEV\s*MODE\b/i,
  /\bSUDO\b/,

  // Encoding/obfuscation attacks
  /base64|rot13|hex\s*encode|decode\s+this/i,
  /respond\s+in\s+(code|binary|hex|base64|rot13)/i,

  // Roleplay to bypass
  /for\s+(educational|research|academic|testing)\s+purposes?\s+only/i,
  /hypothetically|in\s+theory|just\s+pretend/i,
];

// ── Harmful Financial Content Patterns ─────────────────────────────────────

const HARMFUL_FINANCE_PATTERNS: { patterns: RegExp[]; reason: string; redirect: string }[] = [
  {
    reason: "tax_evasion",
    redirect:
      "I can't help with tax evasion - it's illegal under the Income Tax Act and carries severe penalties including prosecution. However, I'm great at *legal tax optimization*! I can help you save lakhs using deductions like 80C (₹1.5L), 80D, NPS (80CCD), and HRA. Want me to analyze your tax-saving options?",
    patterns: [
      /(?:hide|conceal|underreport|suppress)\s+(?:income|earnings|money|salary|revenue)/i,
      /(?:evade|escape|dodge)\s+tax/i,
      /(?:fake|fabricate|forge|inflate|create\s+fake)\s+(?:expense|receipt|bill|invoice|deduction)/i,
      /(?:black\s*money|money\s*launder|hawala|benami)/i,
      /(?:shell\s+company|dummy\s+account|round[\s-]*tripping)/i,
      /(?:avoid\s+paying\s+tax(?:es)?\s+(?:illegally|without|by\s+hiding))/i,
      /(?:not\s+(?:file|report|declare|show)\s+(?:income|tax|ITR))/i,
    ],
  },
  {
    reason: "fraud",
    redirect:
      "I can't assist with financial fraud or illegal schemes. I'm here to help you build wealth through legitimate financial planning. Would you like to explore legal investment options or tax-saving strategies?",
    patterns: [
      /(?:ponzi|pyramid)\s+scheme/i,
      /(?:insider\s+trading|front[\s-]*running|pump[\s-]*and[\s-]*dump)/i,
      /(?:forge|fake)\s+(?:document|signature|bank\s+statement)/i,
      /(?:crypto|bitcoin)\s+(?:scam|fraud|scheme|hack)/i,
    ],
  },
];

// ── Off-Topic Detection ────────────────────────────────────────────────────

const FINANCIAL_KEYWORDS = [
  "invest", "save", "saving", "budget", "income", "expense", "salary", "earn",
  "tax", "sip", "fd", "ppf", "nps", "elss", "mutual fund", "stock", "share",
  "loan", "emi", "interest", "return", "goal", "retire", "pension", "insurance",
  "deduction", "80c", "80d", "hra", "house", "car", "education", "wedding",
  "inflation", "compound", "lakh", "crore", "rupee", "inr", "money", "wealth",
  "debt", "credit", "bank", "deposit", "gold", "bond", "nifty", "sensex",
  "portfolio", "asset", "liability", "net worth", "financial", "plan", "fund",
  "epf", "pf", "gratuity", "rent", "property", "real estate", "mortgage",
  "premium", "cover", "claim", "nominee", "corpus", "annuity", "swp",
  "hi", "hello", "hey", "thanks", "thank", "ok", "yes", "no", "please",
  "help", "what", "how", "can", "should", "compare", "calculate", "show",
  // Conversational finance terms users naturally use
  "spend", "spent", "spending", "pay", "paid", "cost", "afford", "per month",
  "monthly", "yearly", "annual", "get", "make", "take home", "hand",
  "lpa", "ctc", "package", "hike",
];

// Patterns that indicate financial context even without keyword match
const FINANCIAL_PATTERNS: RegExp[] = [
  /\d+\s*k\b/i,                   // "21k", "7.5k", "8k"
  /\d+\s*l(?:akh|ac|pa)?\b/i,     // "10L", "5lakh", "12lpa"
  /\d+\s*cr\b/i,                   // "2cr"
  /₹\s*\d+/,                       // "₹50000"
  /\d+\s*(?:per|\/)\s*month/i,     // "10000 per month", "10k/month"
  /\d+[\s-]+\d+/,                  // ranges like "7.5-8k"
];

// ── PII Detection & Masking (Input Side) ───────────────────────────────────

const PII_INPUT_PATTERNS: { name: string; pattern: RegExp; replacement: string }[] = [
  { name: "aadhaar", pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: "[AADHAAR_MASKED]" },
  { name: "pan", pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, replacement: "[PAN_MASKED]" },
  { name: "credit_card", pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: "[CARD_MASKED]" },
  { name: "ifsc", pattern: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g, replacement: "[IFSC_MASKED]" },
  { name: "bank_account", pattern: /\b\d{9,18}\b(?=[\s,.]*(account|a\/c|ac\b))/gi, replacement: "[ACCOUNT_MASKED]" },
  { name: "email", pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[EMAIL_MASKED]" },
  { name: "phone", pattern: /(?:\+91[\s-]?|0)[6-9]\d{9}\b/g, replacement: "[PHONE_MASKED]" },
];

// ── Main Guard Function ────────────────────────────────────────────────────

export function guardInput(message: string): GuardResult {
  const trimmed = message.trim();

  // Empty message
  if (!trimmed) {
    return { allowed: false, reason: "empty_message" };
  }

  // Message too long (potential prompt injection via length)
  if (trimmed.length > 4000) {
    return { allowed: false, reason: "message_too_long", redirect: "Please keep your message under 4000 characters." };
  }

  // 1. Jailbreak & prompt injection check
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        reason: "blocked_jailbreak",
        redirect: "I'm Artha, your financial planning assistant. I can help you with savings goals, investment comparisons, tax optimization, and budgeting. What financial question can I help you with?",
      };
    }
  }

  // 2. Harmful financial content check
  for (const { patterns, reason, redirect } of HARMFUL_FINANCE_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed)) {
        return { allowed: false, reason, redirect };
      }
    }
  }

  // 3. Off-topic detection (only for longer messages - short ones like "hi" pass)
  if (trimmed.split(/\s+/).length > 5) {
    const lower = trimmed.toLowerCase();
    const hasKeyword = FINANCIAL_KEYWORDS.some((kw) => lower.includes(kw));
    const hasPattern = FINANCIAL_PATTERNS.some((p) => p.test(trimmed));
    if (!hasKeyword && !hasPattern) {
      return {
        allowed: false,
        reason: "off_topic",
        redirect: "I specialize in Indian personal finance - savings, investments, tax planning, loans, and budgeting. Could you ask me something in that area? For example: \"How should I invest 10k/month?\" or \"Compare old vs new tax regime for 12 LPA\"",
      };
    }
  }

  // 4. PII masking - allow the message but sanitize sensitive data
  let sanitized = trimmed;
  let piiFound = false;
  for (const { pattern, replacement } of PII_INPUT_PATTERNS) {
    const before = sanitized;
    sanitized = sanitized.replace(pattern, replacement);
    if (sanitized !== before) piiFound = true;
  }

  return {
    allowed: true,
    sanitized: piiFound ? sanitized : undefined,
  };
}
