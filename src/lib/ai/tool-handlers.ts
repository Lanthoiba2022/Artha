// Tool handlers are defined inline in tools.ts execute functions.
// With Vercel AI SDK, tools auto-execute via the `execute` callback.
// This file provides a re-export for convenience and a manual execution
// fallback if needed (e.g., testing or server-side orchestration).

export { arthaTools } from './tools';
