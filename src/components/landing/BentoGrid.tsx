"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  PiggyBank,
  LineChart,
  BadgePercent,
  Calculator,
  Landmark,
  IndianRupee,
} from "lucide-react";

const features = [
  {
    icon: PiggyBank,
    title: "Savings Goal Tracker",
    description:
      "Set goals like house down payment, child's education, or retirement. Get inflation-adjusted targets and a clear monthly savings number.",
    className: "md:col-span-2",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: LineChart,
    title: "SIP & FD Comparison",
    description:
      "Compare mutual fund SIPs, fixed deposits, PPF, NPS, and ELSS side by side with post-tax maturity values.",
    className: "md:col-span-1",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: BadgePercent,
    title: "Tax Regime Optimizer",
    description:
      "Old vs new regime analysis. Discover Section 80C, 80D, and HRA deductions you might be missing.",
    className: "md:col-span-1",
    gradient: "from-emerald-500/10 to-green-500/10",
  },
  {
    icon: Calculator,
    title: "EMI & Loan Planner",
    description:
      "Calculate home loan EMIs, see total interest payable, and understand how prepayments can save you lakhs over the loan tenure.",
    className: "md:col-span-2",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: Landmark,
    title: "India-Specific Instruments",
    description:
      "Built for PPF, ELSS, NPS, Sukanya Samriddhi, and other Indian instruments with accurate lock-in periods and tax treatment.",
    className: "md:col-span-1",
    gradient: "from-sky-500/10 to-indigo-500/10",
  },
  {
    icon: IndianRupee,
    title: "Rupee-First Design",
    description:
      "All calculations in INR with Indian numbering (lakhs & crores), Indian tax slabs, and SEBI-aligned risk categories.",
    className: "md:col-span-1",
    gradient: "from-rose-500/10 to-pink-500/10",
  },
];

export function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 md:grid-cols-3"
    >
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg ${feature.className}`}
        >
          {/* Gradient hover background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          />
          <div className="relative z-10">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1.5 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
