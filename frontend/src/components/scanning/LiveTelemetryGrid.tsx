"use client";

import React from "react";
import { GitCommit, FileCode2, Users, FileCheck2 } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface LiveTelemetryGridProps {
  commitsCount: number;
  linesCount: number;
  authorsCount: number;
  filesCount: number;
  isScanning: boolean;
}

export const LiveTelemetryGrid: React.FC<LiveTelemetryGridProps> = ({
  commitsCount,
  linesCount,
  authorsCount,
  filesCount,
  isScanning,
}) => {
  const animatedCommits = useCountUp(commitsCount, 1200);
  const animatedLines = useCountUp(linesCount, 1500);
  const animatedAuthors = useCountUp(authorsCount, 800);
  const animatedFiles = useCountUp(filesCount, 1000);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Commits Mined */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-800">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="font-mono text-xs uppercase tracking-wider">Commits Mined</span>
          <GitCommit className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-zinc-100">
          {animatedCommits.formatted}
        </div>
        <div className="mt-1 flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500">
          {isScanning && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          <span>PyDriller Graph Traversal</span>
        </div>
      </div>

      {/* Source Lines Audited */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-800">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="font-mono text-xs uppercase tracking-wider">Lines Audited</span>
          <FileCode2 className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-zinc-100">
          {animatedLines.formatted}
        </div>
        <div className="mt-1 flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500">
          {isScanning && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />}
          <span>AST Semantic Parser</span>
        </div>
      </div>

      {/* Unique Authors Resolved */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-800">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="font-mono text-xs uppercase tracking-wider">Authors Resolved</span>
          <Users className="h-4 w-4 text-purple-400" />
        </div>
        <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-zinc-100">
          {animatedAuthors.value}
        </div>
        <div className="mt-1 flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500">
          <span>Levenshtein Multi-Alias</span>
        </div>
      </div>

      {/* Files Classified */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-800">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="font-mono text-xs uppercase tracking-wider">Files Classified</span>
          <FileCheck2 className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-zinc-100">
          {animatedFiles.value}
        </div>
        <div className="mt-1 flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500">
          <span>4-Tier Weights Assigned</span>
        </div>
      </div>
    </div>
  );
};
