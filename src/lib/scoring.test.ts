import { describe, it, expect } from "vitest";
import { calculateAlignment } from "./scoring";

describe("calculateAlignment", () => {
  it("should calculate 100% alignment when stances match perfectly", () => {
    const userStances = [
      { issueId: "1", value: 10, weight: 1 },
      { issueId: "2", value: 0, weight: 1 },
    ];
    const candidateStances = [
      { issueId: "1", value: 10 },
      { issueId: "2", value: 0 },
    ];
    
    expect(calculateAlignment(userStances, candidateStances)).toBe(100);
  });

  it("should calculate 0% alignment when stances are opposite", () => {
    const userStances = [{ issueId: "1", value: 10, weight: 1 }];
    const candidateStances = [{ issueId: "1", value: 0 }];
    
    expect(calculateAlignment(userStances, candidateStances)).toBe(0);
  });

  it("should respect weights correctly", () => {
    // Two issues. 
    // Issue 1: Match (User 10, Cand 10) - Weight High (3)
    // Issue 2: Mismatch (User 10, Cand 0) - Weight Low (1)
    // Total weight = 4. 
    // Contribution: (3 * 100%) + (1 * 0%) = 300 / 4 = 75%
    const userStances = [
      { issueId: "1", value: 10, weight: 3 },
      { issueId: "2", value: 10, weight: 1 },
    ];
    const candidateStances = [
      { issueId: "1", value: 10 },
      { issueId: "2", value: 0 },
    ];
    
    expect(calculateAlignment(userStances, candidateStances)).toBe(75);
  });

  it("should handle neutral stances (5)", () => {
    const userStances = [{ issueId: "1", value: 5, weight: 1 }];
    const candidateStances = [{ issueId: "1", value: 10 }];
    // Difference is 5 out of 10. Alignment 50%.
    expect(calculateAlignment(userStances, candidateStances)).toBe(50);
  });
});
