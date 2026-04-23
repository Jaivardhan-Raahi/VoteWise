import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SurveyState, SurveyActions } from "../types/survey";

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
              weight: state.responses[issueId]?.weight ?? 2, // Default to Medium (2)
            },
          },
        })),

      setWeight: (issueId, weight) =>
        set((state) => ({
          responses: {
            ...state.responses,
            [issueId]: {
              value: state.responses[issueId]?.value ?? 5, // Default to Neutral (5)
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
