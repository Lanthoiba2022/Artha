import { create } from "zustand";
import type { UserProfile, RiskTolerance, TaxRegime } from "@/types/user";

const DEFAULT_PROFILE: UserProfile = {
  monthlyIncome: null,
  monthlyExpenses: null,
  age: null,
  city: null,
  riskTolerance: null,
  taxRegime: null,
  existingInvestments: [],
};

interface UserProfileState extends UserProfile {
  // Derived
  disposableIncome: number;
  savingsRate: number;
  profileCompleteness: number;
  // Actions
  updateField: (field: keyof UserProfile, value: unknown) => void;
  reset: () => void;
}

function computeDerived(profile: UserProfile) {
  const income = profile.monthlyIncome ?? 0;
  const expenses = profile.monthlyExpenses ?? 0;
  const disposableIncome = income - expenses;
  const savingsRate = income ? disposableIncome / income : 0;

  const coreFields = [
    profile.monthlyIncome,
    profile.monthlyExpenses,
    profile.age,
    profile.riskTolerance,
    profile.taxRegime,
  ];
  const filled = coreFields.filter((v) => v !== null && v !== undefined).length;
  const profileCompleteness = (filled / 5) * 100;

  return { disposableIncome, savingsRate, profileCompleteness };
}

export const useUserProfileStore = create<UserProfileState>()(
  (set) => ({
    ...DEFAULT_PROFILE,
    ...computeDerived(DEFAULT_PROFILE),

    updateField: (field, value) =>
      set((state) => {
        const updated = { ...state, [field]: value };
        return { [field]: value, ...computeDerived(updated) };
      }),

    reset: () =>
      set(() => ({
        ...DEFAULT_PROFILE,
        ...computeDerived(DEFAULT_PROFILE),
      })),
  })
);
