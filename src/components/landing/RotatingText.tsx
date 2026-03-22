"use client";

import { useState, useEffect, useCallback } from "react";

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

export function RotatingText({
  texts,
  interval = 2500,
  className = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotate = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % texts.length);
      setIsAnimating(false);
    }, 300);
  }, [texts.length]);

  useEffect(() => {
    const timer = setInterval(rotate, interval);
    return () => clearInterval(timer);
  }, [rotate, interval]);

  return (
    <span
      className={`inline-block transition-all duration-300 ease-in-out ${className} ${
        isAnimating
          ? "translate-y-[20%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      {texts[index]}
    </span>
  );
}
