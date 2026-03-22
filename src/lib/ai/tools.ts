import { tool } from 'ai';
import { z } from 'zod';
import { requiredMonthlySavings } from '@/lib/calculations/goal-planner';
import { sipFutureValue } from '@/lib/calculations/sip';
import { calculateNewRegimeTax } from '@/lib/calculations/tax';
import { instrumentProfiles } from '@/lib/data/instrument-profiles';

export const arthaTools = {
  calculate_goal_savings: tool({
    description:
      'Calculate monthly savings needed to reach a financial goal, accounting for inflation. Returns the inflated target, monthly SIP required, and breakdown.',
    inputSchema: z.object({
      targetAmount: z
        .number()
        .describe("Target amount in INR at today's prices"),
      timelineMonths: z
        .number()
        .int()
        .positive()
        .describe('Number of months to achieve the goal'),
      annualReturnRate: z
        .number()
        .describe(
          'Expected annual return rate as a decimal (e.g. 0.12 for 12%). Use 0.12 as default'
        ),
      annualInflationRate: z
        .number()
        .describe(
          'Annual inflation rate as a decimal (e.g. 0.06 for 6%). Use 0.06 as default'
        ),
    }),
    execute: async (input) => {
      const result = requiredMonthlySavings(
        input.targetAmount,
        input.timelineMonths,
        input.annualReturnRate,
        input.annualInflationRate
      );
      return {
        targetToday: result.targetToday,
        inflatedTarget: Math.round(result.inflatedTarget),
        timelineMonths: result.timelineMonths,
        annualReturn: result.annualReturn,
        annualInflation: result.annualInflation,
        monthlySavingsNeeded: Math.round(result.monthlySavingsNeeded),
      };
    },
  }),

  compare_instruments: tool({
    description:
      'Compare investment instruments for a goal. Shows monthly SIP needed and maturity value for each instrument to reach the target amount within the given tenure.',
    inputSchema: z.object({
      targetAmount: z
        .number()
        .describe(
          'Target maturity amount in INR (already inflation-adjusted if needed)'
        ),
      tenureMonths: z
        .number()
        .int()
        .positive()
        .describe('Investment tenure in months'),
      instrumentIds: z
        .array(z.string())
        .describe(
          'Instrument IDs to compare (from instrument-profiles). Use ["ppf", "elss", "large-cap-mf", "fd", "rd"] as default'
        ),
    }),
    execute: async (input) => {
      const comparison = input.instrumentIds
        .map((id) => {
          const profile = instrumentProfiles.find((p) => p.id === id);
          if (!profile) return null;

          const annualReturn = profile.returnRate / 100;
          const r = annualReturn / 12;

          // Calculate monthly SIP needed to reach targetAmount
          let monthlySavings: number;
          if (r === 0) {
            monthlySavings = input.targetAmount / input.tenureMonths;
          } else {
            monthlySavings =
              (input.targetAmount * r) /
              ((Math.pow(1 + r, input.tenureMonths) - 1) * (1 + r));
          }

          // Calculate maturity value if investing that monthly amount
          const sipResult = sipFutureValue(
            monthlySavings,
            annualReturn,
            input.tenureMonths
          );

          return {
            id: profile.id,
            name: profile.name,
            monthly: Math.round(monthlySavings),
            returnPercent: profile.returnRate,
            riskLevel: profile.riskLevel,
            lockInMonths: profile.lockInMonths,
            maturityValue: Math.round(sipResult.futureValue),
            postTaxValue: Math.round(sipResult.futureValue), // simplified; full tax calc depends on instrument
            taxStatus: profile.taxStatus,
          };
        })
        .filter(
          (item): item is NonNullable<typeof item> => item !== null
        );

      return { instruments: comparison };
    },
  }),

  calculate_tax: tool({
    description:
      'Calculate income tax under the new regime for an Indian taxpayer. Returns tax breakdown including effective and marginal rates.',
    inputSchema: z.object({
      grossAnnualIncome: z
        .number()
        .positive()
        .describe('Annual gross income in INR'),
    }),
    execute: async (input) => {
      const result = calculateNewRegimeTax(input.grossAnnualIncome);
      return {
        regime: result.regime,
        grossIncome: result.grossIncome,
        standardDeduction: result.standardDeduction,
        taxableIncome: result.taxableIncome,
        taxBeforeCess: Math.round(result.taxBeforeCess),
        cess: Math.round(result.cess),
        totalTax: Math.round(result.totalTax),
        effectiveRate:
          Math.round(result.effectiveRate * 10000) / 100, // as percentage with 2 decimals
        marginalRate: result.marginalRate * 100, // as percentage
      };
    },
  }),
};
