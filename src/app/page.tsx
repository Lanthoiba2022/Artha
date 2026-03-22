"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  Lightbulb,
  IndianRupee,
  CircleDollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { BlurText } from "@/components/landing/BlurText";
import { RotatingText } from "@/components/landing/RotatingText";
import { GridBackground } from "@/components/landing/GridBackground";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";

/* ---------- example prompts ---------- */
const prompts = [
  "How much should I save monthly for a 50L house?",
  "Compare SIP vs FD for 5 years",
  "Which tax regime saves me more at 12 LPA?",
  "What's the EMI on a 50L home loan?",
  "How do I start investing with 10k/month?",
  "Plan my child's education fund",
];

/* ---------- how it works ---------- */
const steps = [
  {
    icon: MessageSquare,
    title: "Just ask",
    desc: "Type your financial question in plain language. No forms, no menus — just tell Artha what you want to know.",
  },
  {
    icon: Lightbulb,
    title: "Get instant answers",
    desc: "Artha analyzes your numbers, compares instruments, adjusts for inflation, and gives you a clear plan — right in the chat.",
  },
  {
    icon: CircleDollarSign,
    title: "Take action",
    desc: "Walk away knowing exactly how much to save, where to invest, and how much tax you'll save. Every month.",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <GridBackground />

      {/* ========= NAV ========= */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <IndianRupee className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Artha</span>
        </div>
        <Link
          href="/chat"
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:shadow-md hover:shadow-primary/30 hover:brightness-110"
        >
          Start Chatting
        </Link>
      </nav>

      {/* ========= HERO ========= */}
      <section className="relative z-10 flex flex-col items-center px-6 pb-12 pt-16 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-medium text-primary">
            <MessageSquare className="h-3 w-3" />
            AI financial advisor you can chat with
          </span>
        </motion.div>

        <h1 className="mt-8 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block">
            <BlurText text="Ask Artha about your" delay={60} />
          </span>
          <span className="block text-primary">
            <RotatingText
              texts={["savings goals", "investments", "tax planning", "home loan", "retirement"]}
              className="text-primary"
              interval={2200}
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A chat-based financial planner built for India. Just type what you
          need — savings plans, SIP comparisons, tax optimization — and
          get actionable answers instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/chat"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4" />
            Start a conversation
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/60 bg-card/40 px-7 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-primary/10 hover:border-primary/30"
          >
            See it in action
          </a>
        </motion.div>
      </section>

      {/* ========= PROMPT EXAMPLES — scrolling ticker ========= */}
      <section className="relative z-10 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        >
          <div className="flex shrink-0 animate-[scroll_30s_linear_infinite] gap-3">
            {[...prompts, ...prompts].map((p, i) => (
              <span
                key={i}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/40 bg-card/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm"
              >
                <MessageSquare className="h-3 w-3 text-primary/60" />
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========= FEATURE SHOWCASE — chat conversations ========= */}
      <section id="features" className="relative z-10 py-20">
        <div className="mx-auto mb-12 max-w-2xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            See what Artha can{" "}
            <span className="text-primary">answer</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-muted-foreground"
          >
            Real conversations. Real calculations. Watch Artha plan your finances in real-time.
          </motion.p>
        </div>
        <FeatureShowcase />
      </section>

      {/* ========= HOW IT WORKS ========= */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            As simple as{" "}
            <span className="text-primary">sending a message</span>
          </motion.h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative flex gap-6 pb-12 last:pb-0"
            >
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-14 h-[calc(100%-3.5rem)] w-px bg-gradient-to-b from-primary/40 to-border/20" />
              )}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/50 bg-background text-sm font-bold text-primary transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                {i + 1}
              </div>
              <div className="pt-1">
                <div className="mb-1 flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-bold">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========= FINAL CTA ========= */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/80 to-card/40 p-10 text-center shadow-2xl shadow-primary/5 backdrop-blur-md sm:p-16"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your financial plan is
            <br />
            <span className="text-primary">one message away</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Tell Artha your goal. Get a plan. It takes 30 seconds.
          </p>
          <Link
            href="/chat"
            className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4" />
            Chat with Artha
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </section>

      {/* ========= FOOTER ========= */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center">
        <p className="mx-auto max-w-xl px-6 text-[11px] leading-relaxed text-muted-foreground/50">
          Artha provides general financial information and is not a SEBI-registered
          investment advisor. All projections are estimates based on historical data
          and do not guarantee returns. Consult a qualified financial advisor before
          making investment decisions.
        </p>
      </footer>
    </div>
  );
}
