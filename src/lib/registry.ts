import { Candidate, CandidateSchema, Issue, IssueSchema, Race, RaceSchema } from "../types/schema";
import candidatesData from "../data/candidates.json";
import racesData from "../data/races.json";
import issuesData from "../data/issues.json";
import { z } from "zod";

const CandidatesArraySchema = z.array(CandidateSchema);
const RacesArraySchema = z.array(RaceSchema);
const IssuesArraySchema = z.array(IssueSchema);

let validatedCandidates: Candidate[] | null = null;
let validatedRaces: Race[] | null = null;
let validatedIssues: Issue[] | null = null;

/**
 * Safely validates data using Zod.
 * Returns fallback if validation fails in production.
 */
function safeValidate<T>(schema: z.ZodSchema<T>, data: any, name: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error(`Registry Validation Error [${name}]:`, error);
    // In production, we might want to return an empty array/object instead of crashing
    if (Array.isArray(data)) return [] as unknown as T;
    return {} as unknown as T;
  }
}

function getValidatedCandidates(): Candidate[] {
  if (!validatedCandidates) {
    validatedCandidates = safeValidate(CandidatesArraySchema, candidatesData, "Candidates");
  }
  return validatedCandidates;
}

function getValidatedRaces(): Race[] {
  if (!validatedRaces) {
    validatedRaces = safeValidate(RacesArraySchema, racesData, "Races");
  }
  return validatedRaces;
}

function getValidatedIssues(): Issue[] {
  if (!validatedIssues) {
    validatedIssues = safeValidate(IssuesArraySchema, issuesData, "Issues");
  }
  return validatedIssues;
}

export function getRaces(): Race[] {
  return getValidatedRaces();
}

export function getCandidatesForRace(raceId: string): Candidate[] {
  const races = getValidatedRaces();
  const race = races.find((r) => r.id === raceId);
  if (!race) {
    console.warn(`Race not found in registry: ${raceId}`);
    return [];
  }

  const allCandidates = getValidatedCandidates();
  return allCandidates.filter((c) => race.candidates.includes(c.id));
}

export function getCandidateById(candidateId: string): Candidate | undefined {
  return getValidatedCandidates().find((c) => c.id === candidateId);
}

export function getIssues(): Issue[] {
  return getValidatedIssues();
}

export function getIssueById(issueId: string): Issue | undefined {
  return getValidatedIssues().find((i) => i.id === issueId);
}

export function getIssuesByRace(raceId: string): Issue[] {
  const candidates = getCandidatesForRace(raceId);
  if (candidates.length === 0) return [];

  const issueIds = new Set<string>();
  candidates.forEach((c) => {
    c.stances?.forEach((s) => issueIds.add(s.issueId));
  });

  const allIssues = getValidatedIssues();
  return allIssues.filter((i) => issueIds.has(i.id));
}
