"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  PiggyBank,
  LineChart,
  BadgePercent,
  Calculator,
  SendHorizonal,
} from "lucide-react";

/* --- Conversation data --- */

const conversations = [
  {
    icon: PiggyBank,
    tab: "Savings Goal",
    messages: [
      { role: "user" as const, text: "I want to save for a house down payment of 12 lakhs in 3 years" },
      {
        role: "bot" as const,
        text: "Great goal! Here's your savings plan:",
        card: (
          <div className="mt-2 space-y-2 rounded-lg border border-border/30 bg-background/40 p-3 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Target (inflation-adjusted)</span><span className="font-mono font-bold">13,42,000</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Monthly SIP needed</span><span className="font-mono font-bold text-primary">29,500</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Recommended instrument</span><span className="font-bold text-primary">Large-cap SIP</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border/40 mt-1">
              <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ delay: 0.8, duration: 0.8 }} />
            </div>
            <div className="text-right text-[10px] text-muted-foreground">72% achievable with current savings</div>
          </div>
        ),
      },
      { role: "user" as const, text: "Can I do it in 25k/month instead?" },
      { role: "bot" as const, text: "At 25k/mo in a large-cap SIP @ ~12%, you'd reach 12.3L in 3 years. That's 91% of your inflation-adjusted target. I'd suggest parking an extra 5k/mo in a liquid fund to cover the gap." },
    ],
  },
  {
    icon: LineChart,
    tab: "Compare SIPs",
    messages: [
      { role: "user" as const, text: "Compare SIP, FD and PPF for 10,000/month over 5 years" },
      {
        role: "bot" as const,
        text: "Here's your comparison:",
        card: (
          <div className="mt-2 space-y-2.5 rounded-lg border border-border/30 bg-background/40 p-3 text-xs">
            {[
              { name: "SIP (Large Cap)", ret: "~12%", val: "14.2L", risk: "Moderate", w: "85%", best: true },
              { name: "PPF", ret: "7.1%", val: "10.9L", risk: "Zero", w: "65%", best: false },
              { name: "FD (5yr)", ret: "7.0%", val: "8.7L", risk: "Zero", w: "52%", best: false },
            ].map((r, i) => (
              <div key={r.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className={r.best ? "font-bold text-primary" : "text-muted-foreground"}>{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{r.ret}</span>
                    <span className="font-mono font-bold">{r.val}</span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border/40">
                  <motion.div className={`h-full rounded-full ${r.best ? "bg-primary" : "bg-primary/40"}`} initial={{ width: 0 }} animate={{ width: r.w }} transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }} />
                </div>
              </div>
            ))}
            <div className="pt-1 text-[10px] text-primary font-semibold">SIP wins by 5.5L over FD for this timeline</div>
          </div>
        ),
      },
      { role: "bot" as const, text: "For a 5-year horizon, SIP gives you the best returns but with moderate risk. PPF is safer but locked in. Want me to show ELSS options that also save tax?" },
    ],
  },
  {
    icon: BadgePercent,
    tab: "Tax Saving",
    messages: [
      { role: "user" as const, text: "Which tax regime is better for me? I earn 12 LPA" },
      {
        role: "bot" as const,
        text: "Let me check your deductions:",
        card: (
          <div className="mt-2 space-y-1.5 rounded-lg border border-border/30 bg-background/40 p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Deductions found</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Old Regime Wins</span>
            </div>
            {[
              { label: "80C (ELSS + PPF)", val: "1,50,000" },
              { label: "80D (Health)", val: "25,000" },
              { label: "HRA", val: "1,20,000" },
            ].map((d, i) => (
              <motion.div key={d.label} className="flex justify-between" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" style={{ opacity: 1 - i * 0.25 }} />{d.label}</span>
                <span className="font-mono font-bold text-primary">-{d.val}</span>
              </motion.div>
            ))}
            <div className="border-t border-border/30 pt-1.5 mt-1.5 flex justify-between font-bold">
              <span>Tax saved</span>
              <span className="text-primary font-mono">89,400/yr</span>
            </div>
          </div>
        ),
      },
      { role: "bot" as const, text: "Old regime saves you 89,400/yr more. You're already using 80C via PPF - adding ELSS would give you market-linked returns + the same tax benefit." },
    ],
  },
  {
    icon: Calculator,
    tab: "EMI Planning",
    messages: [
      { role: "user" as const, text: "What's the EMI for a 50 lakh home loan at 8.5% for 20 years?" },
      {
        role: "bot" as const,
        text: "Here's your EMI breakdown:",
        card: (
          <div className="mt-2 space-y-2 rounded-lg border border-border/30 bg-background/40 p-3 text-xs">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-extrabold">41,619</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full">
              <motion.div className="bg-primary" initial={{ width: 0 }} animate={{ width: "62%" }} transition={{ delay: 0.5, duration: 0.6 }} />
              <motion.div className="bg-primary/25" initial={{ width: 0 }} animate={{ width: "38%" }} transition={{ delay: 0.7, duration: 0.5 }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Principal: 30.8L</span><span>Interest: 19.2L</span>
            </div>
            <motion.div className="rounded border border-primary/20 bg-primary/5 px-2 py-1.5 text-primary text-[11px] font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              Prepay just 5k/mo extra → save 8.2L in interest
            </motion.div>
          </div>
        ),
      },
      { role: "user" as const, text: "What if I increase EMI by 10% every year?" },
      { role: "bot" as const, text: "With a 10% annual step-up, you'd close the loan in ~13 years instead of 20, saving 14.6L in total interest. Your first year EMI stays 41,619 and rises to ~1.08L by year 13." },
    ],
  },
];

/* --- Main component --- */

export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % conversations.length);
  }, []);

  useEffect(() => {
    if (!isInView || paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isInView, paused, next]);

  const conv = conversations[active];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-2xl px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Chat window chrome */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-2xl shadow-primary/5 backdrop-blur-md">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-border/40 bg-card/80 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/50" />
            <div className="h-3 w-3 rounded-full bg-warning/50" />
            <div className="h-3 w-3 rounded-full bg-success/50" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs font-semibold">Artha Chat</span>
          </div>
        </div>

        {/* Topic tabs */}
        <div className="flex border-b border-border/30 bg-card/50">
          {conversations.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.tab}
                onClick={() => setActive(i)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <c.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{c.tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="chatTab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          {/* Progress */}
          {!paused && (
            <div className="ml-auto flex items-center pr-3">
              <div className="h-1 w-14 overflow-hidden rounded-full bg-border/30">
                <motion.div key={active} className="h-full bg-primary/50" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />
              </div>
            </div>
          )}
        </div>

        {/* Chat messages */}
        <div className="min-h-[420px] p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {conv.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.18, duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary">
                      <span className="text-[10px] font-bold text-white">A</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-primary-foreground"
                        : "rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-foreground"
                    }`}
                  >
                    {msg.text}
                    {"card" in msg && msg.card}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="border-t border-border/30 bg-card/60 px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/50 px-3 py-2">
            <span className="flex-1 text-xs text-muted-foreground/50">Ask Artha anything about your finances...</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SendHorizonal className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
