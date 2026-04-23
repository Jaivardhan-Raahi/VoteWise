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
 * Calculates alignment percentage using simple weighted sum algorithm.
 * 100 * (1 - (sumWeightedDiff / maxSumWeightedDiff))
 * where diff = abs(userValue - candidateValue)
 * and maxSumWeightedDiff = sum(10 * weight)
 */
export function calculateAlignment(
  userStances: UserStance[],
  candidateStances: CandidateStance[]
): number {
  if (userStances.length === 0) return 0;

  let sumWeightedDiff = 0;
  let maxSumWeightedDiff = 0;

  for (const userStance of userStances) {
    const candidateStance = candidateStances.find(
      (cs) => cs.issueId === userStance.issueId
    );

    if (!candidateStance) continue;

    const diff = Math.abs(userStance.value - candidateStance.value);
    sumWeightedDiff += diff * userStance.weight;
    maxSumWeightedDiff += 10 * userStance.weight;
  }

  if (maxSumWeightedDiff === 0) return 0;

  return Math.round(100 * (1 - sumWeightedDiff / maxSumWeightedDiff));
}
