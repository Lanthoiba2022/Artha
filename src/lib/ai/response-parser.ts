import type { ParsedSegment, RichComponent, MarkerType } from '@/types/chat';

/**
 * Regex to match :::TYPE {json}::: markers in Claude's response text.
 *
 * Supported marker types:
 * - GOAL_CARD
 * - COMPARISON_TABLE
 * - SIP_CALCULATOR
 * - TAX_BREAKDOWN
 * - SAVINGS_TIMELINE
 * - OPPORTUNITY_COST
 * - EXTRACT
 */
const MARKER_REGEX =
  /:::(GOAL_CARD|COMPARISON_TABLE|SIP_CALCULATOR|TAX_BREAKDOWN|SAVINGS_TIMELINE|OPPORTUNITY_COST|EXTRACT)\s+(\{[\s\S]*?\}):::/g;

/**
 * Parse a raw response string from the AI into an array of segments.
 * Each segment is either plain text or a rich component extracted from
 * a :::TYPE {json}::: marker.
 *
 * Malformed JSON inside markers is treated as plain text so the UI
 * never crashes on a bad response.
 */
export function parseResponse(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;

  // Reset regex state since it uses the global flag
  MARKER_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = MARKER_REGEX.exec(text)) !== null) {
    // Add any plain text before this marker
    const before = text.slice(lastIndex, match.index);
    if (before.trim().length > 0) {
      segments.push({ type: 'text', content: before });
    }

    const markerType = match[1] as MarkerType;
    const jsonStr = match[2];

    try {
      const data = JSON.parse(jsonStr);
      const component = buildComponent(markerType, data);

      if (component) {
        segments.push({ type: 'rich', component });
      } else {
        // Unknown marker type — keep as text
        segments.push({ type: 'text', content: match[0] });
      }
    } catch {
      // Malformed JSON — render the raw marker as plain text
      segments.push({ type: 'text', content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last marker
  const remaining = text.slice(lastIndex);
  if (remaining.trim().length > 0) {
    segments.push({ type: 'text', content: remaining });
  }

  return segments;
}

/**
 * Map a marker type + parsed JSON data to a typed RichComponent.
 * Returns null for marker types that don't have a corresponding
 * RichComponent variant (e.g., TAX_BREAKDOWN, SAVINGS_TIMELINE,
 * OPPORTUNITY_COST are reserved for future use).
 */
function buildComponent(
  markerType: MarkerType,
  data: Record<string, unknown>
): RichComponent | null {
  switch (markerType) {
    case 'GOAL_CARD':
      return {
        type: 'GOAL_CARD',
        data: {
          name: String(data.name ?? ''),
          target: Number(data.target ?? 0),
          inflatedTarget: Number(data.inflatedTarget ?? 0),
          timeline: Number(data.timeline ?? 0),
          monthlySavings: Number(data.monthlySavings ?? 0),
          ...(data.achievability
            ? { achievability: data.achievability as 'easy' | 'moderate' | 'tight' | 'exceeds' }
            : {}),
        },
      };

    case 'COMPARISON_TABLE':
      return {
        type: 'COMPARISON_TABLE',
        data: {
          instruments: Array.isArray(data.instruments)
            ? data.instruments.map((inst: Record<string, unknown>) => ({
                name: String(inst.name ?? ''),
                monthly: Number(inst.monthly ?? 0),
                returnPercent: Number(inst.returnPercent ?? 0),
                riskLevel: (inst.riskLevel as 'low' | 'moderate' | 'high') ?? 'moderate',
                lockInMonths: Number(inst.lockInMonths ?? 0),
                maturityValue: Number(inst.maturityValue ?? 0),
                postTaxValue: Number(inst.postTaxValue ?? 0),
                ...(inst.recommended !== undefined ? { recommended: Boolean(inst.recommended) } : {}),
              }))
            : [],
        },
      };

    case 'SIP_CALCULATOR':
      return {
        type: 'SIP_CALCULATOR',
        data: {
          monthlyAmount: Number(data.monthlyAmount ?? 0),
          returnRate: Number(data.returnRate ?? 0),
          tenureMonths: Number(data.tenureMonths ?? 0),
          futureValue: Number(data.futureValue ?? 0),
          totalInvested: Number(data.totalInvested ?? 0),
          totalReturns: Number(data.totalReturns ?? 0),
        },
      };

    case 'EXTRACT':
      return {
        type: 'EXTRACT',
        data: {
          field: String(data.field ?? ''),
          value: data.value as string | number | boolean,
          confidence: (data.confidence as 'high' | 'medium' | 'low') ?? 'medium',
        },
      };

    // Reserved for future rich components
    case 'TAX_BREAKDOWN':
    case 'SAVINGS_TIMELINE':
    case 'OPPORTUNITY_COST':
      return null;

    default:
      return null;
  }
}

/**
 * Extract only the plain-text portions of a response,
 * stripping all :::MARKER::: blocks. Useful for accessibility
 * or plain-text fallback rendering.
 */
export function extractPlainText(text: string): string {
  return text.replace(MARKER_REGEX, '').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Check whether a response contains any rich markers.
 */
export function hasRichContent(text: string): boolean {
  MARKER_REGEX.lastIndex = 0;
  return MARKER_REGEX.test(text);
}
