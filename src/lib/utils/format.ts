/**
 * Format a number as Indian currency: ₹1,23,456.78
 * Uses the Indian numbering system (lakhs and crores)
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount == null) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Split into integer and decimal parts
  const [intPart, decPart] = absAmount.toFixed(2).split('.');

  // Indian grouping: first 3 digits from right, then groups of 2
  let result = '';
  const digits = intPart;
  const len = digits.length;

  if (len <= 3) {
    result = digits;
  } else {
    // Last 3 digits
    result = digits.slice(-3);
    let remaining = digits.slice(0, -3);
    // Group remaining in pairs
    while (remaining.length > 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }

  const formatted = `₹${isNegative ? '-' : ''}${result}.${decPart}`;
  return formatted;
}

/**
 * Format as compact Indian notation: ₹10L, ₹1.5Cr
 */
export function formatCompact(amount: number | null | undefined): string {
  if (amount == null) return '₹0';

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10_000_000) {
    return `${sign}₹${(absAmount / 10_000_000).toFixed(1)}Cr`;
  }
  if (absAmount >= 100_000) {
    return `${sign}₹${(absAmount / 100_000).toFixed(1)}L`;
  }
  if (absAmount >= 1_000) {
    return `${sign}₹${(absAmount / 1_000).toFixed(1)}K`;
  }
  return `${sign}₹${absAmount.toFixed(0)}`;
}

/**
 * Format a decimal as percentage: 0.125 → "12.5%"
 */
export function formatPercent(value: number | null | undefined, decimals: number = 1): string {
  if (value == null) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format percentage from already-percentage value: 12.5 → "12.5%"
 */
export function formatPercentDirect(value: number | null | undefined, decimals: number = 1): string {
  if (value == null) return '0%';
  return `${value.toFixed(decimals)}%`;
}
