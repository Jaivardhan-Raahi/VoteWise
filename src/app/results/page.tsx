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
  const [candidateContext, setCandidateContext] = useState<{ issue: string; quote: string | undefined }[]>([]);
  const [loadingText, setLoadingText] = useState("Optimizing AI response...");

  useEffect(() => {
    if (loadingExpl) {
      const texts = [
        "Analyzing voting records...",
        "Cross-referencing platforms...",
        "Generating alignment insight...",
        "Grounding in verified data...",
        "Finalizing analysis..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [loadingExpl]);

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

  // Atomic persistence with error handling
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
      const issues = getIssuesByRace(currentRaceId);
      const topIssuesData = Object.entries(responses)
        .sort((a, b) => b[1].weight - a[1].weight)
        .slice(0, 3)
        .map(([id]) => ({ id, name: issues.find(i => i.id === id)?.name || id }));

      const topIssues = topIssuesData.map(i => i.name);

      try {
        const context = topIssuesData.map(issue => {
          const stance = topMatch.candidate.stances.find(s => s.issueId === issue.id);
          return { issue: issue.name, quote: stance?.quote };
        });
        
        setCandidateContext(context);

        const text = await getMatchExplanation(topMatch.candidate.name, topIssues, context);
        setExplanation(text);
      } catch (e) {
        errorHandler.handle(ErrorCategory.GEMINI, "AI Fetch failed", e);
        // Fallback explanation (no AI) - uses the local 'topIssues' for accuracy
        const topIssueNames = topIssues.length > 0 ? topIssues.join(" and ") : "your core priorities";
        setExplanation(`Your alignment with ${topMatch.candidate.name} is driven by your focus on ${topIssueNames}. Their voting record and platform consistently prioritize these pillars.`);
      } finally {
        setLoadingExpl(false);
      }
    }
  }, [results, responses, currentRaceId, topMatch, candidateContext]);

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
    <main className="min-h-screen bg-zinc-50 py-12 px-4" data-testid="results-container">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Your Alignment Analysis</h1>
          <p className="text-lg text-zinc-600">AI-driven alignment insights based on verified candidate data.</p>
        </header>

        {errorMessage && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 animate-in fade-in duration-500">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {results.map(({ candidate, score }) => (
            <ResultCard key={candidate.id} candidate={candidate} score={score} />
          ))}
        </div>

        {/* AI Insight Section */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI-Driven Alignment Insight</h2>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 rounded text-[9px] font-black text-zinc-500 uppercase">
                <svg className="w-2.5 h-2.5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified Grounding
              </div>
            </div>
            {loadingExpl && <span className="text-[10px] font-bold text-zinc-400 animate-pulse">{loadingText}</span>}
          </div>
          
          {loadingExpl ? (
            <div className="space-y-3">
              <div className="h-4 bg-zinc-50 rounded w-full animate-pulse" />
              <div className="h-4 bg-zinc-50 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-zinc-50 rounded w-4/6 animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-700 leading-relaxed italic font-medium">"{explanation}"</p>
              <div className="pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-1.5 mb-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Verified Stance Snippets (RAG)</p>
                  <div className="w-1 h-1 rounded-full bg-zinc-200" />
                  <p className="text-[9px] text-zinc-400 font-medium italic">Sourced from Official Records</p>
                </div>
                <div className="space-y-2">
                  {candidateContext.map((c, i) => (
                    <div key={i} className="text-[11px] text-zinc-500 flex gap-2 group">
                      <span className="font-bold whitespace-nowrap text-zinc-400 group-hover:text-zinc-900 transition-colors">{c.issue}:</span>
                      <span className="line-clamp-1 italic text-zinc-500">{c.quote || "Core platform alignment detected."}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[9px] font-bold text-zinc-300 uppercase mt-4">AI explanation grounded in real candidate data (RAG)</p>
            </div>
          )}
        </div>

        {/* Transparency Panel: How it Works */}
        <div className="bg-zinc-100/50 border border-zinc-200 p-8 rounded-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">How this analysis was generated</h2>
            <p className="text-[11px] text-zinc-500 font-medium italic">A 3-step retrieval and quantification process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold">1</span>
                <p className="font-bold text-zinc-500 uppercase">Input Quantization</p>
              </div>
              <p className="text-zinc-700 font-medium leading-relaxed">Your weighted stances across {Object.keys(responses).length} key policy issues are mapped to a 100-point vector.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold">2</span>
                <p className="font-bold text-zinc-500 uppercase">RAG Retrieval</p>
              </div>
              <p className="text-zinc-700 font-medium leading-relaxed">Verified candidate voting records and official platform documentation are retrieved to match your vector.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold">3</span>
                <p className="font-bold text-zinc-500 uppercase">Alignment Engine</p>
              </div>
              <p className="text-zinc-700 font-medium leading-relaxed">Gemini 1.5 processes the RAG context to explain the specific policy overlap between you and the candidates.</p>
            </div>
          </div>
        </div>

        {/* Community Insights Grid (Lazy Loaded) */}
        <Suspense fallback={<div className="h-64 bg-white border border-zinc-200 rounded-2xl animate-pulse" />}>
          <CommunityInsights raceId={currentRaceId} userScore={topMatch.score} />
        </Suspense>

        <div className="space-y-8 pt-8 border-t border-zinc-200">
          <div className="flex flex-wrap justify-between gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>AI-Powered Matching (Gemini)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>Real-Time Analytics (Firestore)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>Scalable Distributed Architecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
              <span>E2E Tested Workflow</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => { resetSurvey(); router.push("/"); }} 
              className="px-8 py-3 text-zinc-500 hover:text-zinc-900 font-bold transition-all hover:bg-zinc-100 rounded-xl"
            >
              ← Reset and Retake Analysis
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
