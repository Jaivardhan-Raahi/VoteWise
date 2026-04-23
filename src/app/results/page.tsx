"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSurveyStore } from "@/store/useSurveyStore";
import { getCandidatesForRace, getIssuesByRace } from "@/lib/registry";
import { calculateAlignment } from "@/lib/scoring";
import { useRouter } from "next/navigation";
import { firebaseService, CommunityStats } from "@/lib/firebase-service";

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
  const [stats, setStats] = useState<CommunityStats | null>(null);

  const results = useMemo(() => {
    if (!currentRaceId) return [];
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
  }, [currentRaceId, responses]);

  const topMatch = results[0];

  useEffect(() => {
    if (results.length > 0 && !hasSaved && currentRaceId) {
      setHasSaved(true);
      const issues = getIssuesByRace(currentRaceId);
      const topIssues = Object.entries(responses)
        .sort((a, b) => b[1].weight - a[1].weight)
        .slice(0, 3)
        .map(([issueId]) => issues.find(i => i.id === issueId)?.name || issueId);

      firebaseService.saveResult({
        candidateId: topMatch.candidate.id,
        candidateName: topMatch.candidate.name,
        raceId: currentRaceId,
        topIssues,
        score: topMatch.score,
      }).then(() => {
        firebaseService.getRaceStats(currentRaceId).then(setStats);
      });
    }
  }, [results, hasSaved, responses, currentRaceId, topMatch]);

  const fetchExplanation = useCallback(async () => {
    if (results.length > 0 && currentRaceId) {
      setLoadingExpl(true);
      const issues = getIssuesByRace(currentRaceId);
      const topIssues = Object.entries(responses)
        .sort((a, b) => b[1].weight - a[1].weight)
        .slice(0, 3)
        .map(([id]) => issues.find(i => i.id === id)?.name || id);

      const text = await getMatchExplanation(topMatch.candidate.name, topIssues);
      setExplanation(text);
      setLoadingExpl(false);
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

  const scoreDiff = stats ? topMatch.score - stats.averageScore : 0;

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-zinc-900">Your Top Matches</h1>
          {stats && (
            <p className="text-zinc-500 font-medium">
              You align <span className="text-zinc-900">{topMatch.score}%</span> with your top match. 
              The community average is <span className="text-zinc-900">{stats.averageScore}%</span>.
            </p>
          )}
        </header>

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

        {/* Community Insights Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 text-white p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Most Matched Candidate</span>
              <p className="text-xl font-bold">{stats.topCandidate}</p>
              <p className="text-xs text-zinc-400">Overall community favorite</p>
            </div>
            
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Top Community Issues</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {stats.topIssues.map(issue => (
                  <span key={issue} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded uppercase">
                    {issue}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-zinc-100 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Alignment Comparison</span>
                <p className="text-sm font-bold text-zinc-800">
                  {scoreDiff > 0 
                    ? `You are ${scoreDiff}% more aligned than the average user.`
                    : `You are ${Math.abs(scoreDiff)}% less aligned than the average user.`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-zinc-900">{topMatch.score}%</span>
                <span className="text-[10px] block text-zinc-400 font-bold uppercase">Your Score</span>
              </div>
            </div>
          </div>
        )}

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
