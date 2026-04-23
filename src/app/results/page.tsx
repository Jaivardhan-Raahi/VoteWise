"use client";

import React, { useMemo, useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useSurveyStore } from "@/store/useSurveyStore";
import { getCandidatesForRace, getIssuesByRace } from "@/lib/registry";
import { calculateAlignment } from "@/lib/scoring";
import { useRouter } from "next/navigation";
import { firebaseService } from "@/lib/firebase-service";
import { errorHandler, ErrorCategory } from "@/lib/error-handler";

import { ResultCard } from "@/components/ResultCard";
import { getMatchExplanation } from "@/lib/gemini";

// Lazy load analytics for better performance (Task 4)
const CommunityInsights = lazy(() => import("@/components/CommunityInsights").then(m => ({ default: m.CommunityInsights })));

export default function ResultsPage() {
  const responses = useSurveyStore((state) => state.responses);
  const currentRaceId = useSurveyStore((state) => state.currentRaceId);
  const resetSurvey = useSurveyStore((state) => state.resetSurvey);
  const router = useRouter();
  
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!currentRaceId) return [];
    
    try {
      const candidates = getCandidatesForRace(currentRaceId);
      const userStances = Object.entries(responses).map(([issueId, resp]) => ({
        issueId,
        value: resp.value,
        weight: resp.weight,
      }));

      return candidates.map((candidate) => ({
        candidate,
        score: calculateAlignment(userStances, candidate.stances)
      })).sort((a, b) => b.score - a.score).slice(0, 3);
    } catch (e) {
      errorHandler.log(e);
      return [];
    }
  }, [currentRaceId, responses]);

  const topMatch = results[0];

  // Atomic persistence with error handling (Task 1 & 3)
  useEffect(() => {
    if (results.length > 0 && !hasSaved && currentRaceId) {
      const persistResults = async () => {
        setHasSaved(true);
        try {
          const issues = getIssuesByRace(currentRaceId);
          const topIssues = Object.entries(responses)
            .sort((a, b) => b[1].weight - a[1].weight)
            .slice(0, 3)
            .map(([issueId]) => issues.find(i => i.id === issueId)?.name || issueId);

          await firebaseService.saveResult({
            candidateId: topMatch.candidate.id,
            candidateName: topMatch.candidate.name,
            raceId: currentRaceId,
            topIssues,
            score: topMatch.score,
          });
        } catch (e) {
          const msg = errorHandler.handle(ErrorCategory.FIREBASE, "Auto-save failed", e);
          setErrorMessage(msg);
        }
      };
      persistResults();
    }
  }, [results, hasSaved, responses, currentRaceId, topMatch]);

  const fetchExplanation = useCallback(async () => {
    if (results.length > 0 && currentRaceId) {
      setLoadingExpl(true);
      try {
        const issues = getIssuesByRace(currentRaceId);
        const topIssues = Object.entries(responses)
          .sort((a, b) => b[1].weight - a[1].weight)
          .slice(0, 3)
          .map(([id]) => issues.find(i => i.id === id)?.name || id);

        const text = await getMatchExplanation(topMatch.candidate.name, topIssues);
        setExplanation(text);
      } catch (e) {
        errorHandler.handle(ErrorCategory.GEMINI, "AI Fetch failed", e);
        setExplanation("AI explanation is temporarily unavailable.");
      } finally {
        setLoadingExpl(false);
      }
    }
  }, [results, responses, currentRaceId, topMatch]);

  useEffect(() => {
    if (results.length > 0 && !explanation && !loadingExpl) {
      fetchExplanation();
    }
  }, [results, explanation, loadingExpl, fetchExplanation]);

  if (!currentRaceId || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50">
        <button onClick={() => router.push("/survey")} className="px-6 py-2 bg-zinc-900 text-white rounded-lg">
          Go to Survey
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Your Top Matches</h1>
          <p className="text-lg text-zinc-600">Candidates that align closest with your views.</p>
        </header>

        {errorMessage && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {results.map(({ candidate, score }) => (
            <ResultCard key={candidate.id} candidate={candidate} score={score} />
          ))}
        </div>

        {/* AI Insight Section */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Why this match?</h2>
          {loadingExpl ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-full" />
              <div className="h-4 bg-zinc-100 rounded w-2/3" />
            </div>
          ) : (
            <p className="text-zinc-700 leading-relaxed italic">"{explanation}"</p>
          )}
        </div>

        {/* Community Insights Grid (Lazy Loaded) */}
        <Suspense fallback={<div className="h-64 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl animate-pulse" />}>
          <CommunityInsights raceId={currentRaceId} userScore={topMatch.score} />
        </Suspense>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => { resetSurvey(); router.push("/"); }} 
            className="text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            ← Reset and Retake Survey
          </button>
        </div>
      </div>
    </main>
  );
}
