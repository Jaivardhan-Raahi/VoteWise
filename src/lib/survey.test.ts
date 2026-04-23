import { describe, it, expect, beforeEach } from "vitest";
import { useSurveyStore } from "../store/useSurveyStore";

describe("Survey Integration", () => {
  beforeEach(() => {
    useSurveyStore.getState().resetSurvey();
  });

  it("should maintain survey state as user progresses", () => {
    const store = useSurveyStore.getState();
    
    // Start survey
    store.setRace("pres-2024");
    expect(useSurveyStore.getState().currentRaceId).toBe("pres-2024");

    // Answer first question
    store.setAnswer("issue-1", 8);
    store.setWeight("issue-1", 3);
    
    // Answer second question
    store.setAnswer("issue-2", 2);
    
    const state = useSurveyStore.getState();
    expect(state.responses["issue-1"]).toEqual({ value: 8, weight: 3 });
    expect(state.responses["issue-2"].value).toBe(2);
    expect(state.responses["issue-2"].weight).toBe(2); // Default weight
  });

  it("should reset survey correctly", () => {
    const store = useSurveyStore.getState();
    store.setRace("pres-2024");
    store.setAnswer("issue-1", 8);
    
    store.resetSurvey();
    
    const state = useSurveyStore.getState();
    expect(state.currentRaceId).toBe(null);
    expect(state.responses).toEqual({});
    expect(state.currentStep).toBe(0);
  });
});
