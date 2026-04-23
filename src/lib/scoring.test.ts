import { describe, it, expect } from "vitest";
import { calculateAlignment } from "./scoring";

describe("calculateAlignment - Edge Cases & Enterprise Hardening", () => {
  it("should handle null or undefined inputs safely", () => {
    // @ts-ignore
    expect(calculateAlignment(null, [])).toBe(0);
    // @ts-ignore
    expect(calculateAlignment([], undefined)).toBe(0);
  });

  it("should handle invalid stance values (non-numbers)", () => {
    const userStances = [
      // @ts-ignore
      { issueId: "1", value: "invalid", weight: 1 },
      { issueId: "2", value: 10, weight: 1 },
    ];
    const candidateStances = [{ issueId: "2", value: 10 }];
    
    // Should ignore the invalid stance and score based on the valid one
    expect(calculateAlignment(userStances, candidateStances)).toBe(100);
  });

  it("should handle extreme weights", () => {
    const userStances = [
      { issueId: "1", value: 10, weight: 1000000 },
      { issueId: "2", value: 0, weight: 1 },
    ];
    const candidateStances = [
      { issueId: "1", value: 10 },
      { issueId: "2", value: 10 },
    ];
    // Weight 1,000,000 should dominate. 
    // Without high weight: (100% + 0%) / 2 = 50%
    // With high weight: ~100%
    expect(calculateAlignment(userStances, candidateStances)).toBeGreaterThan(99);
  });

  it("should return 0 when totalPossibleDifference is 0", () => {
    const userStances = [{ issueId: "1", value: 10, weight: 0 }];
    const candidateStances = [{ issueId: "1", value: 10 }];
    expect(calculateAlignment(userStances, candidateStances)).toBe(0);
  });

  it("should handle large datasets efficiently", () => {
    const largeUserStances = Array.from({ length: 1000 }, (_, i) => ({
      issueId: `issue-${i}`,
      value: 5,
      weight: 1
    }));
    const largeCandidateStances = Array.from({ length: 1000 }, (_, i) => ({
      issueId: `issue-${i}`,
      value: 5
    }));
    
    const start = performance.now();
    const result = calculateAlignment(largeUserStances, largeCandidateStances);
    const end = performance.now();
    
    expect(result).toBe(100);
    expect(end - start).toBeLessThan(50); // Should be very fast (< 50ms)
  });
});
