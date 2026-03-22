interface GuardResult {
  allowed: boolean;
  reason?: string;
  redirect?: string;
}

const BLOCKED_PATTERNS: RegExp[] = [
  /ignore (previous|all|above|your) instructions/i,
  /you are now/i,
  /pretend you/i,
  /act as if/i,
  /system prompt/i,
  /reveal your (instructions|prompt|rules)/i,
  /forget (everything|your|all)/i,
  /new persona/i,
  /override/i,
  /jailbreak/i,
];

const TAX_EVASION_PATTERNS: RegExp[] = [
  /hide income/i,
  /evade tax/i,
  /avoid paying tax(es)? illegally/i,
  /fake (expenses|bills|receipts)/i,
  /black money/i,
  /money launder/i,
  /tax fraud/i,
  /show fake/i,
  /underreport/i,
];

export function guardInput(message: string): GuardResult {
  if (BLOCKED_PATTERNS.some(p => p.test(message))) {
    return { allowed: false, reason: 'blocked_jailbreak' };
  }
  if (TAX_EVASION_PATTERNS.some(p => p.test(message))) {
    return {
      allowed: false,
      reason: 'tax_evasion',
      redirect: "I can't help with tax evasion — it's illegal and carries heavy penalties. However, I'm great at *legal tax optimization* using deductions like 80C, 80D, NPS, and HRA. These can save you lakhs legally. Want me to analyze your tax-saving options?",
    };
  }
  return { allowed: true };
}
