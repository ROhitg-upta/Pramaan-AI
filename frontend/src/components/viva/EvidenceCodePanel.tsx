"use client";

import React from "react";
import { FileCode, GitCommit, Layers, AlertCircle, ShieldAlert } from "lucide-react";
import { type VivaQuestion } from "@/lib/mock-data";

interface EvidenceCodePanelProps {
  question: VivaQuestion;
  contributorName: string;
}

export function EvidenceCodePanel({ question, contributorName }: EvidenceCodePanelProps) {
  // Parse starting line number from line_range (e.g., "12-34" -> 12)
  const startLine = React.useMemo(() => {
    if (!question.line_range) return 1;
    const parts = question.line_range.split("-");
    const num = parseInt(parts[0], 10);
    return isNaN(num) ? 1 : num;
  }, [question.line_range]);

  // Split code snippet into lines
  const codeLines = React.useMemo(() => {
    return question.code_snippet.split("\n");
  }, [question.code_snippet]);

  const referencedSet = React.useMemo(() => {
    return new Set(question.referenced_lines || []);
  }, [question.referenced_lines]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/60 px-5 py-3.5">
        <div className="flex items-center space-x-2.5">
          <FileCode className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold text-zinc-200">
            {question.file_path}
          </span>
          <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
            #{question.commit_hash.slice(0, 7)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            <Layers className="h-3 w-3" />
            <span>Tier 3: Core Algorithmic Logic</span>
          </span>

          <span className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
            Lines {question.line_range}
          </span>
        </div>
      </div>

      {/* 2. Sub-header Spotlight Label */}
      <div className="flex items-center justify-between bg-cyan-950/20 border-b border-cyan-500/20 px-5 py-2 font-mono text-[11px] text-cyan-300">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span>EVIDENCE CODE DIFF • TARGETED FOR VIVA CHALLENGE</span>
        </div>
        <span className="text-zinc-500 text-[10px]">
          Claimed Author: <span className="text-zinc-300 font-semibold">{contributorName}</span>
        </span>
      </div>

      {/* 3. Syntax-Formatted Code Viewer with Line Spotlight */}
      <div className="flex-1 overflow-x-auto p-4 font-mono text-xs leading-6">
        <table className="w-full border-collapse">
          <tbody>
            {codeLines.map((line, idx) => {
              const currentLineNumber = startLine + idx;
              const isHighlighted =
                referencedSet.has(currentLineNumber) ||
                (referencedSet.size === 0 && idx < 5); // Fallback highlight

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isHighlighted
                      ? "bg-cyan-950/40 text-cyan-100 font-medium"
                      : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  {/* Line Number Column */}
                  <td
                    className={`select-none w-12 text-right pr-4 py-0.5 border-r ${
                      isHighlighted
                        ? "border-cyan-400/50 text-cyan-400 font-bold"
                        : "border-white/5 text-zinc-600"
                    }`}
                  >
                    {currentLineNumber}
                  </td>

                  {/* Spotlight Indicator Pill */}
                  <td className="w-4 px-1 py-0.5 text-center select-none">
                    {isHighlighted ? (
                      <span className="text-cyan-400 font-bold">&gt;</span>
                    ) : null}
                  </td>

                  {/* Code Line Content */}
                  <td className="pl-3 pr-4 py-0.5 whitespace-pre">
                    <span
                      className={
                        isHighlighted
                          ? "text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          : "text-zinc-400"
                      }
                    >
                      {line}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Code Panel Footer */}
      <div className="border-t border-white/5 bg-zinc-950/90 px-5 py-3 flex items-center justify-between font-mono text-[11px] text-zinc-500">
        <span>Lines {Array.from(referencedSet).join(", ")} highlighted for questioning</span>
        <span className="text-zinc-600">PyDriller AST Verified</span>
      </div>
    </div>
  );
}
