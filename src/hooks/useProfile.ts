"use client";

import { useState, useEffect } from "react";
import { useUserProfileStore } from "@/lib/store/user-profile";
import type { UserProfile } from "@/types/user";

const DEFAULT_PROFILE: UserProfile & { disposableIncome: number; savingsRate: number; profileCompleteness: number } = {
  monthlyIncome: null,
  monthlyExpenses: null,
  age: null,
  city: null,
  riskTolerance: null,
  taxRegime: null,
  existingInvestments: [],
  disposableIncome: 0,
  savingsRate: 0,
  profileCompleteness: 0,
};

export function useProfile() {
  const store = useUserProfileStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return { ...DEFAULT_PROFILE, hydrated: false as const };
  }

  return { ...store, hydrated: true as const };
}
