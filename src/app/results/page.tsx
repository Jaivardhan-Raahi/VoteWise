"use client";

import React, { useMemo } from "react";
import { useSurveyStore } from "@/store/useSurveyStore";
import { getCandidatesForRace, getIssuesByRace } from "@/lib/registry";
import { calculateAlignment } from "@/lib/scoring";
import { useRouter } from "next/navigation";

import { ResultCard } from "@/components/ResultCard";
import { getMatchExplanation } from "@/lib/gemini";

export default function ResultsPage() {
  const responses = useSurveyStore((state) => state.responses);
  const currentRaceId = useSurveyStore((state) => state.currentRaceId);
  const resetSurvey = useSurveyStore((state) => state.resetSurvey);
  const router = useRouter();
  
  const [explanation, setExplanation] = React.useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = React.useState(false);

  const results = useMemo(() => {
    if (!currentRaceId) return [];

    const candidates = getCandidatesForRace(currentRaceId);
    
    // Transform store responses into the format expected by calculateAlignment
    const userStances = Object.entries(responses).map(([issueId, resp]) => ({
      issueId,
      value: resp.value,
      weight: resp.weight,
    }));

    const scoredCandidates = candidates.map((candidate) => {
      const score = calculateAlignment(userStances, candidate.stances);
      return {
        candidate,
        score,
      };
    });

    // Sort by score descending and take top 3
    return scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [currentRaceId, responses]);

  // Fetch explanation for the top match
  React.useEffect(() => {
    async function fetchExplanation() {
      if (results.length > 0 && !explanation && !loadingExpl) {
        setLoadingExpl(true);
        const topMatch = results[0];
        
        // Find top 3 issues by weight
        const topIssues = Object.entries(responses)
          .sort((a, b) => b[1].weight - a[1].weight)
          .slice(0, 3)
          .map(([issueId]) => {
             const issues = getIssuesByRace(currentRaceId!);
             return issues.find(i => i.id === issueId)?.name || issueId;
          });

        const text = await getMatchExplanation(topMatch.candidate.name, topIssues);
        setExplanation(text);
        setLoadingExpl(false);
      }
    }
    fetchExplanation();
  }, [results, responses, currentRaceId, explanation, loadingExpl]);

  const handleRetake = () => {
    resetSurvey();
    router.push("/");
  };

  if (!currentRaceId || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50">
        <p className="text-zinc-500 mb-4">No survey data found.</p>
        <button
          onClick={() => router.push("/survey")}
          className="px-6 py-2 bg-zinc-900 text-white rounded-lg font-semibold"
        >
          Go to Survey
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
            Your Top Matches
          </h1>
          <p className="text-lg text-zinc-600">
            Based on your stances, here are the candidates that align closest with your views.
          </p>
        </header>

        <div className="space-y-6">
          {results.map(({ candidate, score }) => (
            <ResultCard 
              key={candidate.id} 
              candidate={candidate} 
              score={score} 
            />
          ))}
        </div>

        {/* Why this match? Section */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
              Why this match?
            </h2>
          </div>
          
          {loadingExpl ? (
            <div className="space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-zinc-100 rounded w-1/2 animate-pulse" />
            </div>
          ) : (
            <p className="text-zinc-600 leading-relaxed italic">
              "{explanation || "Analyzing your priorities to find the best match..."}"
            </p>
          )}
          
          <div className="pt-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
              Powered by Google Gemini AI
            </span>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleRetake}
            className="text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            ← Reset and Retake Survey
          </button>
        </div>
      </div>
    </main>
  );
}
