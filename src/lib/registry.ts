import { Candidate, CandidateSchema, Race, RaceSchema } from "../types/schema";
import candidatesData from "../data/candidates.json";
import racesData from "../data/races.json";
import { z } from "zod";

const CandidatesArraySchema = z.array(CandidateSchema);
const RacesArraySchema = z.array(RaceSchema);

let validatedCandidates: Candidate[] | null = null;
let validatedRaces: Race[] | null = null;

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
