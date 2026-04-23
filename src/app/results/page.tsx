"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSurveyStore } from "@/store/useSurveyStore";
import { getCandidatesForRace, getIssuesByRace } from "@/lib/registry";
import { calculateAlignment } from "@/lib/scoring";
import { useRouter } from "next/navigation";
import { firebaseService } from "@/lib/firebase-service";

import { ResultCard } from "@/components/ResultCard";
import { getMatchExplanation } from "@/lib/gemini";

export default function ResultsPage() {
  const responses = useSurveyStore((state) => state.responses);
  const currentRaceId = useSurveyStore((state) => state.currentRaceId);
  const resetSurvey = useSurveyStore((state) => state.resetSurvey);
  const router = useRouter();
  
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [stats, setStats] = useState<{ commonIssue: string, topCandidate: string } | null>(null);

  const results = useMemo(() => {
    if (!currentRaceId) return [];

    const candidates = getCandidatesForRace(currentRaceId);
    
    const userStances = Object.entries(responses).map(([issueId, resp]) => ({
      issueId,
      value: resp.value,
      weight: resp.weight,
    }));

    const scoredCandidates = candidates.map((candidate) => {
      const score = calculateAlignment(userStances, candidate.stances);
      return { candidate, score };
    });

    return scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [currentRaceId, responses]);

  // Task 4: Firestore Write optimized
  useEffect(() => {
    if (results.length > 0 && !hasSaved && currentRaceId) {
      const saveResult = async () => {
        setHasSaved(true);
        const topMatch = results[0];
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
      };
      saveResult();
    }
  }, [results, hasSaved, responses, currentRaceId]);

  // Task 5: Firestore Read (Analytics) optimized
  useEffect(() => {
    if (currentRaceId) {
      firebaseService.getRaceStats(currentRaceId).then(setStats);
    }
  }, [currentRaceId]);

  // Optimized fetch explanation function with Retry support
  const fetchExplanation = useCallback(async () => {
    if (results.length > 0) {
      setLoadingExpl(true);
      setExplanation(null);
      const topMatch = results[0];
      
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
  }, [results, responses, currentRaceId]);

  useEffect(() => {
    if (results.length > 0 && !explanation && !loadingExpl) {
      fetchExplanation();
    }
  }, [results, explanation, loadingExpl, fetchExplanation]);

  const handleRetake = () => {
    resetSurvey();
    router.push("/");
  };

  if (!currentRaceId || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50">
        <p className="text-zinc-500 mb-4">No survey data found.</p>
        <button onClick={() => router.push("/survey")} className="px-6 py-2 bg-zinc-900 text-white rounded-lg font-semibold">
          Go to Survey
        </button>
      </div>
    );
  }

  const isError = explanation?.includes("temporarily unavailable");

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Your Top Matches</h1>
          <p className="text-lg text-zinc-600">Based on your stances, here are the candidates that align closest with your views.</p>
        </header>

        <div className="space-y-6">
          {results.map(({ candidate, score }) => (
            <ResultCard key={candidate.id} candidate={candidate} score={score} />
          ))}
        </div>

        <div className={`p-8 rounded-2xl border transition-all duration-300 ${isError ? 'bg-amber-50 border-amber-100' : 'bg-white border-zinc-200 shadow-sm'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loadingExpl ? 'bg-zinc-900 animate-pulse' : (isError ? 'bg-amber-400' : 'bg-zinc-900')}`} />
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                {loadingExpl ? 'Generating explanation...' : 'Why this match?'}
              </h2>
            </div>
            {isError && !loadingExpl && (
              <button 
                onClick={fetchExplanation}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-200"
              >
                Try Again
              </button>
            )}
          </div>
          
          {loadingExpl ? (
            <div className="space-y-3">
              <div className="h-4 bg-zinc-100 rounded w-full animate-pulse" />
              <div className="h-4 bg-zinc-100 rounded w-5/6 animate-pulse" />
            </div>
          ) : (
            <p className={`leading-relaxed italic ${isError ? 'text-amber-800 text-sm' : 'text-zinc-600'}`}>
              "{explanation || "Preparing your match analysis..."}"
            </p>
          )}
          
          <div className="pt-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Powered by Google Gemini AI</span>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-200">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Most Matched</span>
              <span className="text-sm font-bold text-zinc-800">{stats.topCandidate}</span>
            </div>
            <div className="bg-zinc-100 p-4 rounded-xl border border-zinc-200">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Top Community Issue</span>
              <span className="text-sm font-bold text-zinc-800">{stats.commonIssue}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-8">
          <button onClick={handleRetake} className="text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
            ← Reset and Retake Survey
          </button>
        </div>
      </div>
    </main>
  );
}
