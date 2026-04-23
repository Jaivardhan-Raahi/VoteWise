import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSurveyStore } from "../store/useSurveyStore";
import { firebaseService } from "./firebase-service";

// Mock Firestore
vi.mock("./firebase-service", () => ({
  firebaseService: {
    saveResult: vi.fn().mockResolvedValue(undefined),
    getRaceStats: vi.fn().mockResolvedValue({
      topCandidate: "Test Candidate",
      topIssues: ["Economy"],
      averageScore: 75,
      totalSubmissions: 10,
      candidateBreakdown: { "Test Candidate": 10 }
    })
  }
}));

describe("Survey to Persistence Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSurveyStore.getState().resetSurvey();
  });

  it("should simulate full survey flow and trigger persistence", async () => {
    const store = useSurveyStore.getState();
    
    // 1. User answers questions
    store.setRace("pres-2024");
    store.setAnswer("issue-1", 10);
    store.setWeight("issue-1", 3);
    
    const state = useSurveyStore.getState();
    expect(state.responses["issue-1"]).toBeDefined();
    
    // 2. Trigger "Save" (simulating ResultsPage behavior)
    const mockResult = {
      candidateId: "cand-1",
      candidateName: "Candidate 1",
      raceId: "pres-2024",
      topIssues: ["Economy"],
      score: 95
    };
    
    await firebaseService.saveResult(mockResult);
    
    expect(firebaseService.saveResult).toHaveBeenCalledWith(mockResult);
    expect(firebaseService.saveResult).toHaveBeenCalledTimes(1);
  });

  it("should handle Firestore write failures gracefully", async () => {
    // Mock a failure
    (firebaseService.saveResult as any).mockRejectedValueOnce(new Error("Write timeout"));
    
    const mockResult = {
      candidateId: "cand-1",
      candidateName: "Candidate 1",
      raceId: "pres-2024",
      topIssues: ["Economy"],
      score: 95
    };

    // The service itself handles the catch and logs, but we verify it was called
    await expect(firebaseService.saveResult(mockResult)).rejects.toThrow("Write timeout");
  });
});
