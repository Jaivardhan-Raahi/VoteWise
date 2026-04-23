export interface IssueScore {
  issueId: string;
  userValue: number;
  candidateValue: number;
  weight: number;
}

/**
 * Calculates alignment percentage using simple weighted sum algorithm.
 * 100 * (1 - (sumWeightedDiff / maxSumWeightedDiff))
 * where diff = abs(userValue - candidateValue)
 * and maxSumWeightedDiff = sum(10 * weight)
 */
export function calculateAlignment(scores: IssueScore[]): number {
  if (scores.length === 0) return 0;

  let sumWeightedDiff = 0;
  let maxSumWeightedDiff = 0;

  for (const score of scores) {
    const diff = Math.abs(score.userValue - score.candidateValue);
    sumWeightedDiff += diff * score.weight;
    maxSumWeightedDiff += 10 * score.weight;
  }

  if (maxSumWeightedDiff === 0) return 0;

  return Math.round(100 * (1 - sumWeightedDiff / maxSumWeightedDiff));
}
