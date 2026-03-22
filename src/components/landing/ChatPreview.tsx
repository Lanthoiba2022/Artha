"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const messages = [
  {
    role: "user" as const,
    text: "I'm 28, earning 80k/mo. Want to buy a 50L house in 3 years.",
  },
  {
    role: "bot" as const,
    text: "You'd need ~12L for down payment + registration. With 35k/mo disposable income, here's your plan:",
  },
  {
    role: "bot" as const,
    text: "25k/mo in large-cap SIP @ ~12% = 12.3L in 3 yrs. Park 10k/mo in a liquid fund as safety buffer. Total tax saved via ELSS: ~46k/yr under 80C.",
  },
];

export function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-lg"
    >
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/40" />
            <div className="h-3 w-3 rounded-full bg-warning/40" />
            <div className="h-3 w-3 rounded-full bg-success/40" />
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            Artha
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-3 p-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: msg.role === "user" ? 20 : -20 }
              }
              transition={{ duration: 0.4, delay: 0.3 + i * 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
