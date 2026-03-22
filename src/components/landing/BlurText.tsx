"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
}

export function BlurText({
  text,
  className = "",
  delay = 50,
  animateBy = "words",
  direction = "bottom",
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const segments =
    animateBy === "words" ? text.split(" ") : text.split("");

  const yFrom = direction === "top" ? -15 : 15;

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {segments.map((segment, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", y: yFrom }}
          animate={
            isInView
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : { opacity: 0, filter: "blur(8px)", y: yFrom }
          }
          transition={{
            duration: 0.4,
            delay: i * (delay / 1000),
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
