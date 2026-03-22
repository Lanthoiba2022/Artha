/** Data schema version for cache invalidation */
export const DATA_VERSION = "1.0.0";

/** Date when the hardcoded data was last verified */
export const DATA_LAST_UPDATED = "2026-03-22";

/** Current financial year for tax calculations */
export const FINANCIAL_YEAR = "FY 2025-26";

/** Default annual inflation rate */
export const DEFAULT_INFLATION = 0.06;

/** Short-Term Capital Gains tax rate (equity, listed) */
export const STCG_RATE = 0.20;

/** Long-Term Capital Gains tax rate (equity, listed) */
export const LTCG_RATE = 0.125;

/** LTCG exemption limit per financial year */
export const LTCG_EXEMPTION = 125000;

/** Maximum characters in a single chat message */
export const MAX_MESSAGE_LENGTH = 4000;

/** Maximum messages retained in a conversation */
export const MAX_CONVERSATION_LENGTH = 50;

/** API rate limit: max requests per minute per user */
export const RATE_LIMIT_PER_MINUTE = 30;
