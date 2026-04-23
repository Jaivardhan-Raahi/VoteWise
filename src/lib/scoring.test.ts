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
    expect(calculateAlignment(userStances, candidateStances)).toBe(50);
  });

  it("should return 0 for empty user stances", () => {
    expect(calculateAlignment([], [{ issueId: "1", value: 10 }])).toBe(0);
  });

  it("should return 0 when no issues match", () => {
    const userStances = [{ issueId: "1", value: 10, weight: 1 }];
    const candidateStances = [{ issueId: "2", value: 10 }];
    expect(calculateAlignment(userStances, candidateStances)).toBe(0);
  });

  it("should handle weights of zero", () => {
    const userStances = [
      { issueId: "1", value: 10, weight: 0 },
      { issueId: "2", value: 10, weight: 1 },
    ];
    const candidateStances = [
      { issueId: "1", value: 0 },
      { issueId: "2", value: 10 },
    ];
    // Issue 1 is ignored due to 0 weight. Issue 2 is a perfect match.
    expect(calculateAlignment(userStances, candidateStances)).toBe(100);
  });

  it("should handle missing candidate stances gracefully", () => {
    const userStances = [
      { issueId: "1", value: 10, weight: 1 },
      { issueId: "2", value: 10, weight: 1 },
    ];
    const candidateStances = [{ issueId: "1", value: 10 }];
    // Only Issue 1 is scored.
    expect(calculateAlignment(userStances, candidateStances)).toBe(100);
  });

  it("should handle extreme values correctly", () => {
    const userStances = [
      { issueId: "1", value: 10, weight: 100 },
      { issueId: "2", value: 0, weight: 100 },
    ];
    const candidateStances = [
      { issueId: "1", value: 10 },
      { issueId: "2", value: 0 },
    ];
    expect(calculateAlignment(userStances, candidateStances)).toBe(100);
  });
});
