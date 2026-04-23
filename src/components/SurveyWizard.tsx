"use client";

import React, { useState, useEffect } from "react";
import { getIssuesByRace } from "../lib/registry";
import { Issue } from "../types/schema";
import { QuestionCard } from "./QuestionCard";
import { useSurveyStore } from "../store/useSurveyStore";

interface SurveyWizardProps {
  raceId: string;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({ raceId }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const setRace = useSurveyStore((state) => state.setRace);

  useEffect(() => {
    const raceIssues = getIssuesByRace(raceId);
    setIssues(raceIssues);
    setRace(raceId);
  }, [raceId, setRace]);

  if (issues.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  const currentIssue = issues[currentStep];
  const progress = ((currentStep + 1) / issues.length) * 100;

  const next = () => {
    if (currentStep < issues.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Placeholder for results navigation
      console.log("Survey complete!");
      alert("Survey complete! In a real app, this would take you to the results page.");
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
            Question {currentStep + 1} of {issues.length}
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard issue={currentIssue} />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            currentStep === 0
              ? "text-zinc-300 cursor-not-allowed"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={next}
          className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-all shadow-lg active:transform active:scale-95"
        >
          {currentStep === issues.length - 1 ? "View Results" : "Next →"}
        </button>
      </div>
    </div>
  );
};
