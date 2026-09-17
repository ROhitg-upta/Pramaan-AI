"use client";

import React, { useState } from "react";
import { Check, Loader2, Circle, Info, Activity, ShieldCheck } from "lucide-react";

export interface PipelinePhase {
  id: string;
  name: string;
  description: string;
  status: "pending" | "active" | "completed";
  duration?: string;
  tooltipExplanation?: string;
}

const DEFAULT_TOOLTIPS: Record<string, string> = {
  ingest: "Clones shallow git history up to 50 commits to analyze real author trees.",
  mining: "Traverses file diffs line-by-line using PyDriller to calculate deletions vs additions.",
  identity: "Fuzzy matches contributor aliases and git email addresses to expose single users masquerading as teams.",
  ast: "Constructs Abstract Syntax Trees to measure cyclomatic complexity and algorithmic density.",
  heuristics: "Checks for Zero Churn, 3 AM Big Bang Dumps, and panic commits before deadlines.",
  viva: "Extracts challenged line numbers from Tier-3 code and prompts Gemini 2.5 Flash for oral defense questions.",
};

interface PhaseProgressProps {
  phases: PipelinePhase[];
  overallProgress: number; // 0 to 100
  backendConnected?: boolean;
}

export const PhaseProgress: React.FC<PhaseProgressProps> = ({
  phases,
  overallProgress,
  backendConnected = true,
}) => {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
      {/* Top Header & Progress Percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Pipeline Orchestration
            </span>

            {/* Live Backend Connection Badge */}
            <span
              className={`inline-flex items-center space-x-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                backendConnected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  backendConnected ? "bg-emerald-400" : "bg-cyan-400"
                }`}
              />
              <span>
                {backendConnected
                  ? "Backend Engine: Active"
                  : "Backend Engine: Simulating"}
              </span>
            </span>
          </div>

          <h2 className="font-display text-lg font-bold text-zinc-100 mt-1">
            Forensic Analysis Pipeline
          </h2>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <span className="text-xl sm:text-2xl font-bold text-zinc-100">
            {Math.round(overallProgress)}%
          </span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* 6-Stage Phase Grid with Hover/Click Diagnostic Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {phases.map((phase, idx) => {
          const isPending = phase.status === "pending";
          const isActive = phase.status === "active";
          const isCompleted = phase.status === "completed";
          const tooltip = phase.tooltipExplanation || DEFAULT_TOOLTIPS[phase.id] || phase.description;
          const isTooltipOpen = activeTooltipId === phase.id;

          return (
            <div
              key={phase.id}
              className={`relative flex items-start space-x-3 rounded-xl border p-3.5 transition-all ${
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                  : isCompleted
                  ? "border-white/5 bg-zinc-950/70"
                  : "border-white/5 bg-zinc-950/30 opacity-50"
              }`}
            >
              {/* Icon Status */}
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-sm">
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

              {/* Text Info & Interactive Info Icon */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      0{idx + 1}
                    </span>

                    {/* Interactive ℹ️ Diagnostic Trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveTooltipId(isTooltipOpen ? null : phase.id)}
                      onMouseEnter={() => setActiveTooltipId(phase.id)}
                      onMouseLeave={() => setActiveTooltipId(null)}
                      className="text-zinc-500 hover:text-emerald-400 transition focus:outline-none"
                      title="Click or hover for forensic diagnostic description"
                    >
                      <Info className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    {phase.duration && isCompleted && (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                        {phase.duration}
                      </span>
                    )}
                    {isActive && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </div>
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

                {/* Floating Tooltip Diagnostic Bubble */}
                {isTooltipOpen && (
                  <div className="absolute left-2 right-2 bottom-full mb-2 z-30 rounded-xl border border-emerald-500/30 bg-zinc-950/95 p-3 text-[11px] font-mono text-zinc-300 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-1 duration-150">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>{phase.name} Forensics</span>
                    </div>
                    <div className="leading-relaxed text-zinc-300 font-body text-[11px]">
                      {tooltip}
                    </div>
                    <div className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-b border-r border-emerald-500/30 bg-zinc-950" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
