export interface UserStance {
  issueId: string;
  value: number;
  weight: number;
}

export interface CandidateStance {
  issueId: string;
  value: number;
}

/**
 * Calculates alignment percentage between user and candidate stances.
 * Uses a weighted distance algorithm.
 * 
 * @param userStances Array of user stances with values and weights
 * @param candidateStances Array of candidate stances for the same issues
 * @returns A number between 0 and 100 representing alignment percentage
 */
export function calculateAlignment(
  userStances: UserStance[] | undefined | null,
  candidateStances: CandidateStance[] | undefined | null
): number {
  // Defensive check for empty or null inputs
  if (!userStances || !candidateStances || userStances.length === 0) {
    return 0;
  }

  let totalWeightedDifference = 0;
  let totalPossibleDifference = 0;

  for (const userStance of userStances) {
    // Skip invalid stances
    if (!userStance || typeof userStance.value !== "number") continue;

    const candidateStance = candidateStances.find(
      (cs) => cs && cs.issueId === userStance.issueId
    );

    // If candidate has no stance on this issue, we skip it to be fair
    if (!candidateStance || typeof candidateStance.value !== "number") {
      continue;
    }

    const weight = Math.max(0, userStance.weight || 0);
    const difference = Math.abs(userStance.value - candidateStance.value);
    
    totalWeightedDifference += difference * weight;
    totalPossibleDifference += 10 * weight; // Assuming max value difference is 10 (0 to 10 scale)
  }

  // Avoid division by zero if no matching issues were found or all weights are zero
  if (totalPossibleDifference <= 0) {
    return 0;
  }

  const alignmentScore = 1 - (totalWeightedDifference / totalPossibleDifference);
  
  return Math.round(alignmentScore * 100);
}
