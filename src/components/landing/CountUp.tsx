"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  separator?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  className = "",
  suffix = "",
  prefix = "",
  separator = ",",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(formatNumber(from, separator));

  const motionVal = useMotionValue(from);
  const spring = useSpring(motionVal, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView) {
      motionVal.set(to);
    }
  }, [isInView, motionVal, to]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(formatNumber(Math.round(v), separator));
    });
    return unsub;
  }, [spring, separator]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}

function formatNumber(n: number, sep: string): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
