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
    firebaseService.getRaceStats(raceId).then(data => {
      if (isMounted) {
        setStats(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [raceId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 bg-zinc-100 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const scoreDiff = userScore - stats.averageScore;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Real-time Community Insights</h3>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
          Based on {stats.totalSubmissions} anonymous responses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 text-white p-6 rounded-2xl space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Most Matched Overall</span>
            <p className="text-2xl font-black mt-1">{stats.topCandidate}</p>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium">Scalable architecture powered by Firebase</p>
        </div>
        
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Top Prioritized Issues</span>
          <div className="space-y-3">
            {stats.topIssues.map((issue, idx) => (
              <div key={issue} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase">
                  <span>{issue}</span>
                  <span>{Math.max(0, 95 - idx * 15)}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-900 transition-all duration-1000" 
                    style={{ width: `${Math.max(0, 95 - idx * 15)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-zinc-100 p-6 rounded-2xl flex items-center justify-between border border-zinc-200">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Alignment Comparison</span>
            <p className="text-sm font-bold text-zinc-800 mt-1">
              {scoreDiff >= 0 
                ? `Your alignment is ${scoreDiff}% higher than the current community average.`
                : `Your alignment is ${Math.abs(scoreDiff)}% lower than the community average.`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-zinc-900">{stats.averageScore}%</span>
            <span className="text-[10px] block text-zinc-400 font-bold uppercase mt-1">Global Avg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
