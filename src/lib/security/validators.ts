import { z } from 'zod';

export const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(4000),
  })).max(50),
  userProfile: z.object({
    monthlyIncome: z.number().min(0).max(100_000_000).nullable().optional(),
    monthlyExpenses: z.number().min(0).max(100_000_000).nullable().optional(),
    age: z.number().min(10).max(120).nullable().optional(),
    riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).nullable().optional(),
    taxRegime: z.enum(['old', 'new']).nullable().optional(),
  }).optional(),
  goals: z.array(z.object({
    id: z.string(),
    name: z.string(),
    targetAmount: z.number(),
    timelineMonths: z.number(),
  })).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
