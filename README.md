# Artha - AI Financial Planner for India

Artha is a chat-based personal finance advisor built specifically for Indian users. You just type your financial question in plain language and get actionable advice — no forms, no complicated dashboards.

## Why I picked this topic

Personal finance in India is confusing for most people. There are so many instruments (PPF, ELSS, NPS, FDs, SIPs), two tax regimes, and no one-size-fits-all answer. Most people either don't plan at all or rely on random advice from friends and family. I wanted to build something that makes financial planning as simple as sending a message.

## What it does

- **Savings goals** — Tell Artha you want to buy a bike worth 2.5L in 10 months, and it calculates exactly how much to save monthly, adjusted for inflation.
- **Investment comparisons** — Compare SIP vs FD vs PPF side by side with actual return projections.
- **Tax optimization** — Find out which tax regime (old vs new) saves you more based on your salary and deductions.
- **EMI calculations** — Get loan EMI breakdowns with total interest and prepayment savings.
- **Budget analysis** — Share your income and expenses, and Artha gives you a savings plan based on the 50/30/20 rule or other frameworks.

## How it works

The app is a Next.js frontend with a Claude AI backend. The user's financial data (income, expenses, age, goals) is tracked in the sidebar and injected into the AI's context so it can give personalized advice. A knowledge base of Indian financial concepts is keyword-matched and injected into each conversation for accurate, relevant responses.

There are no tool calls — all financial formulas (SIP, EMI, tax slabs, goal planning) are embedded directly in the system prompt so the AI calculates everything inline without interrupting the response stream.

## Tech stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **AI**: Claude (Anthropic) via Vercel AI SDK
- **State**: Zustand (client-side, session-only)
- **UI components**: shadcn/ui, Lucide icons, react-markdown

## Running locally

```bash
npm install
npm run dev
```

Create a `.env.local` file with:

```
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514
MAX_TOKENS=16384
RATE_LIMIT_MAX=30
NEXT_PUBLIC_APP_NAME=Artha
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.
