import { create } from "zustand";
import type { Goal } from "@/types/finance";

interface GoalsState {
  goals: Goal[];
  activeGoalId: string | null;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  setActiveGoal: (id: string | null) => void;
}

export const useGoalsStore = create<GoalsState>()(
  (set) => ({
    goals: [],
    activeGoalId: null,

    addGoal: (goal) =>
      set((state) => ({ goals: [...state.goals, goal] })),

    updateGoal: (id, updates) =>
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      })),

    removeGoal: (id) =>
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        activeGoalId: state.activeGoalId === id ? null : state.activeGoalId,
      })),

    setActiveGoal: (id) => set({ activeGoalId: id }),
  })
);
