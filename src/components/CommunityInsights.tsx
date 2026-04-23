"use client";

import React, { useEffect, useState } from "react";
import { firebaseService, CommunityStats } from "@/lib/firebase-service";

interface CommunityInsightsProps {
  raceId: string;
  userScore: number;
}

export const CommunityInsights: React.FC<CommunityInsightsProps> = ({ raceId, userScore }) => {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      const data = await firebaseService.getRaceStats(raceId);
      if (isMounted) {
        setStats(data);
        setLoading(false);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, [raceId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        <div className="h-32 bg-zinc-100 rounded-2xl" />
        <div className="h-32 bg-zinc-100 rounded-2xl" />
      </div>
    );
  }

  if (!stats) return null;

  const scoreDiff = userScore - stats.averageScore;

  return (
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
          <span className="text-2xl font-black text-zinc-900">{userScore}%</span>
          <span className="text-[10px] block text-zinc-400 font-bold uppercase">Your Score</span>
        </div>
      </div>
    </div>
  );
};
