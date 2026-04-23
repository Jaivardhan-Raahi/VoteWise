export interface UserResponse {
  value: number; // 0-10
  weight: number; // 1 (Low), 2 (Med), 3 (High)
}

export interface SurveyState {
  responses: Record<string, UserResponse>; // issueId -> UserResponse
  currentRaceId: string | null;
}

export interface SurveyActions {
  setAnswer: (issueId: string, value: number) => void;
  setWeight: (issueId: string, weight: number) => void;
  setRace: (raceId: string) => void;
  resetSurvey: () => void;
}
