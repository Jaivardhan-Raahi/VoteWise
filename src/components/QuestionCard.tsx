"use client";

import React from "react";
import { Issue } from "../types/schema";
import { useSurveyStore } from "../store/useSurveyStore";

interface QuestionCardProps {
  issue: Issue;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ issue }) => {
  const response = useSurveyStore((state) => state.responses[issue.id]);
  const setAnswer = useSurveyStore((state) => state.setAnswer);
  const setWeight = useSurveyStore((state) => state.setWeight);

  const value = response?.value ?? 5;
  const weight = response?.weight ?? 2;

  const weights = [
    { label: "Low", value: 1 },
    { label: "Medium", value: 2 },
    { label: "High", value: 3 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">{issue.name}</h2>
        <p className="text-zinc-500 leading-relaxed">{issue.description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-sm font-medium text-zinc-700 uppercase tracking-wider">
            Your Stance
          </label>
          <span className="text-3xl font-bold text-zinc-900">{value}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => setAnswer(issue.id, parseInt(e.target.value, 10))}
          aria-label={`Your stance on ${issue.name}`}
          aria-valuetext={`${value} out of 10`}
          className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <div className="flex justify-between text-xs text-zinc-400 font-medium px-1">
          <span>STRONGLY DISAGREE</span>
          <span>NEUTRAL</span>
          <span>STRONGLY AGREE</span>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <label className="block text-sm font-medium text-zinc-700 uppercase tracking-wider">
          How important is this to you?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {weights.map((w) => (
            <button
              key={w.value}
              onClick={() => setWeight(issue.id, w.value)}
              className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                weight === w.value
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                  : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
