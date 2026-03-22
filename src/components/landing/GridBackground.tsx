"use client";

import { motion } from "framer-motion";

export function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.19 155 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.19 155 / 0.5) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Main emerald glow — top center */}
      <motion.div
        className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.19 155 / 0.12), oklch(0.50 0.14 175 / 0.05), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary warm glow — right */}
      <div
        className="absolute right-0 top-1/4 h-[400px] w-[400px] translate-x-1/4 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.70 0.17 130 / 0.3), transparent 70%)",
        }}
      />

      {/* Subtle gold accent — bottom left */}
      <div
        className="absolute bottom-1/4 left-0 h-[350px] w-[350px] -translate-x-1/4 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.14 90 / 0.4), transparent 70%)",
        }}
      />

      {/* Gradient fade at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
