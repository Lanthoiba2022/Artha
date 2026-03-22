"use client";

import { useState, useEffect } from "react";
import { useGoalsStore } from "@/lib/store/goals";
import type { Goal } from "@/types/finance";

interface GoalsDefaults {
  goals: Goal[];
  activeGoalId: string | null;
}

const DEFAULT_GOALS: GoalsDefaults = {
  goals: [],
  activeGoalId: null,
};

export function useGoals() {
  const store = useGoalsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return {
      ...DEFAULT_GOALS,
      addGoal: store.addGoal,
      updateGoal: store.updateGoal,
      removeGoal: store.removeGoal,
      setActiveGoal: store.setActiveGoal,
      hydrated: false as const,
    };
  }

  return { ...store, hydrated: true as const };
}
