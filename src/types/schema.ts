import { z } from "zod";

export const StanceSchema = z.object({
  issueId: z.string(),
  value: z.number().min(0).max(10),
  sourceUrl: z.string().url(),
  quote: z.string().max(280).optional(), // D-05: Stances are "Bite-sized" summaries (max 280 chars)
});

export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  party: z.string(),
  imageUrl: z.string().url().optional(),
  stances: z.array(StanceSchema),
});

export const RaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  candidates: z.array(z.string()), // Array of Candidate IDs
});

export const IssueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Stance = z.infer<typeof StanceSchema>;
export type Candidate = z.infer<typeof CandidateSchema>;
export type Race = z.infer<typeof RaceSchema>;
export type Issue = z.infer<typeof IssueSchema>;
