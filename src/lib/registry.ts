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

function getValidatedCandidates(): Candidate[] {
  if (!validatedCandidates) {
    validatedCandidates = CandidatesArraySchema.parse(candidatesData);
  }
  return validatedCandidates;
}

function getValidatedRaces(): Race[] {
  if (!validatedRaces) {
    validatedRaces = RacesArraySchema.parse(racesData);
  }
  return validatedRaces;
}

function getValidatedIssues(): Issue[] {
  if (!validatedIssues) {
    validatedIssues = IssuesArraySchema.parse(issuesData);
  }
  return validatedIssues;
}

/**
 * Returns all races from the registry.
 */
export function getRaces(): Race[] {
  return getValidatedRaces();
}

/**
 * Returns candidates participating in a specific race.
 */
export function getCandidatesForRace(raceId: string): Candidate[] {
  const races = getValidatedRaces();
  const race = races.find((r) => r.id === raceId);
  if (!race) return [];

  const allCandidates = getValidatedCandidates();
  return allCandidates.filter((c) => race.candidates.includes(c.id));
}

/**
 * Returns a specific candidate by ID.
 */
export function getCandidateById(candidateId: string): Candidate | undefined {
  const allCandidates = getValidatedCandidates();
  return allCandidates.find((c) => c.id === candidateId);
}

/**
 * Returns all issues from the registry.
 */
export function getIssues(): Issue[] {
  return getValidatedIssues();
}

/**
 * Returns a specific issue by ID.
 */
export function getIssueById(issueId: string): Issue | undefined {
  const allIssues = getValidatedIssues();
  return allIssues.find((i) => i.id === issueId);
}

/**
 * Returns unique issues mentioned by candidates in a specific race.
 */
export function getIssuesByRace(raceId: string): Issue[] {
  const candidates = getCandidatesForRace(raceId);
  const issueIds = new Set<string>();
  candidates.forEach((c) => {
    c.stances.forEach((s) => issueIds.add(s.issueId));
  });

  const allIssues = getValidatedIssues();
  return allIssues.filter((i) => issueIds.has(i.id));
}
