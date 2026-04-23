"use client";

import React from "react";
import { Candidate } from "@/types/schema";

interface ResultCardProps {
  candidate: Candidate;
  score: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ candidate, score }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-zinc-900">{candidate.name}</h3>
        <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-bold rounded uppercase tracking-wider">
          {candidate.party}
        </span>
      </div>
      
      <div className="text-right">
        <div className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
          Match
        </div>
        <div className="text-4xl font-black text-zinc-900 leading-none">
          {score}%
        </div>
      </div>
    </div>
  );
};
