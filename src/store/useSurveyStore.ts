import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SurveyState, SurveyActions } from "../types/survey";

// Constants to avoid magic numbers
export const DEFAULT_STANCE_VALUE = 5; // Neutral
export const DEFAULT_WEIGHT_VALUE = 2; // Medium

export const useSurveyStore = create<SurveyState & SurveyActions>()(
  persist(
    (set) => ({
      responses: {},
      currentRaceId: null,
      currentStep: 0,

      setAnswer: (issueId, value) =>
        set((state) => ({
          responses: {
            ...state.responses,
            [issueId]: {
              value,
              weight: state.responses[issueId]?.weight ?? DEFAULT_WEIGHT_VALUE,
            },
          },
        })),

      setWeight: (issueId, weight) =>
        set((state) => ({
          responses: {
            ...state.responses,
            [issueId]: {
              value: state.responses[issueId]?.value ?? DEFAULT_STANCE_VALUE,
              weight,
            },
          },
        })),

      setRace: (raceId) => set({ currentRaceId: raceId }),

      setCurrentStep: (step) => set({ currentStep: step }),

      resetSurvey: () => set({ responses: {}, currentRaceId: null, currentStep: 0 }),
    }),
    {
      name: "vote-wise-survey-storage",
    }
  )
);
