"use client";

import React from "react";
import { Check, Loader2, Circle } from "lucide-react";

export interface PipelinePhase {
  id: string;
  name: string;
  description: string;
  status: "pending" | "active" | "completed";
  duration?: string;
}

interface PhaseProgressProps {
  phases: PipelinePhase[];
  overallProgress: number; // 0 to 100
}

export const PhaseProgress: React.FC<PhaseProgressProps> = ({
  phases,
  overallProgress,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-xl">
      {/* Top Header & Progress Percentage */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Pipeline Orchestration
          </span>
          <h2 className="font-display text-lg font-bold text-zinc-100 mt-0.5">
            Forensic Analysis Pipeline
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xl font-bold text-zinc-100">
            {Math.round(overallProgress)}%
          </span>
          <span className="font-mono text-xs text-zinc-500">COMPLETE</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* 6-Stage Phase List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {phases.map((phase, idx) => {
          const isPending = phase.status === "pending";
          const isActive = phase.status === "active";
          const isCompleted = phase.status === "completed";

          return (
            <div
              key={phase.id}
              className={`flex items-start space-x-3 rounded-xl border p-3 transition-all ${
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                  : isCompleted
                  ? "border-white/5 bg-zinc-950/60"
                  : "border-white/5 bg-zinc-950/20 opacity-40"
              }`}
            >
              {/* Icon Status */}
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                    <Circle className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    0{idx + 1}
                  </span>
                  {phase.duration && isCompleted && (
                    <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                      {phase.duration}
                    </span>
                  )}
                  {isActive && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 font-medium animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
                <h4
                  className={`font-mono text-xs font-semibold tracking-tight truncate mt-0.5 ${
                    isActive
                      ? "text-emerald-300"
                      : isCompleted
                      ? "text-zinc-200"
                      : "text-zinc-500"
                  }`}
                >
                  {phase.name}
                </h4>
                <p className="font-body text-[11px] text-zinc-400 truncate mt-0.5">
                  {phase.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
