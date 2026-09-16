"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { type VivaEvaluationResponse } from "@/lib/mock-data";

interface AuthenticityDialProps {
  evaluation: VivaEvaluationResponse;
  analysisId: string;
  hasNextQuestion: boolean;
  onNextQuestion: () => void;
  onRetest?: () => void;
}

export function AuthenticityDial({
  evaluation,
  analysisId,
  hasNextQuestion,
  onNextQuestion,
  onRetest,
}: AuthenticityDialProps) {
  const animatedScore = useCountUp(evaluation.score, 1000);
  const isBuilder = evaluation.score >= 75;
  const isFreeloader = evaluation.score < 40;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* 1. Top Evaluation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-zinc-950 px-2.5 py-0.5 text-[10px] font-mono text-zinc-400">
            <span>✦ AUTONOMOUS VIVA EVALUATION REPORT</span>
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-100 mt-1">
            Tactical Authorship Authenticity
          </h3>
        </div>

        {/* Verdict Badge */}
        <div>
          {isBuilder ? (
            <span className="inline-flex items-center space-x-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>VERIFIED BUILDER</span>
            </span>
          ) : isFreeloader ? (
            <span className="inline-flex items-center space-x-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-rose-400">
              <XCircle className="h-4 w-4 text-rose-400" />
              <span>PROBABLE FREELOADER</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-400">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>SUSPECT AI FLUFF</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Score Meter & Sub-scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Dial Card */}
        <div
          className={`rounded-xl border p-5 flex flex-col items-center justify-center text-center ${
            isBuilder
              ? "border-emerald-500/30 bg-emerald-950/20"
              : isFreeloader
              ? "border-rose-500/30 bg-rose-950/20"
              : "border-amber-500/30 bg-amber-950/20"
          }`}
        >
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Authenticity Score
          </span>
          <div
            className={`font-mono text-4xl sm:text-5xl font-extrabold my-2 ${
              isBuilder
                ? "text-emerald-400"
                : isFreeloader
                ? "text-rose-400"
                : "text-amber-400"
            }`}
          >
            {animatedScore.formatted}
            <span className="text-xl text-zinc-500">/100</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {isBuilder ? "Passes Proof-of-Work" : "Fails Proof-of-Work"}
          </span>
        </div>

        {/* Sub-score 1: Technical Accuracy */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4 font-mono text-xs flex flex-col justify-between">
          <span className="text-zinc-500">Technical Accuracy</span>
          <div className="text-2xl font-bold text-zinc-200 mt-2">
            {evaluation.technical_accuracy}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-700"
              style={{ width: `${evaluation.technical_accuracy}%` }}
            />
          </div>
        </div>

        {/* Sub-score 2: Tactical Authenticity */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4 font-mono text-xs flex flex-col justify-between">
          <span className="text-zinc-500">Tactical Authenticity</span>
          <div className="text-2xl font-bold text-zinc-200 mt-2">
            {evaluation.tactical_authenticity}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${evaluation.tactical_authenticity}%` }}
            />
          </div>
        </div>

        {/* Sub-score 3: Edge Case Preparedness */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4 font-mono text-xs flex flex-col justify-between">
          <span className="text-zinc-500">Edge-Case Preparedness</span>
          <div className="text-2xl font-bold text-zinc-200 mt-2">
            {evaluation.edge_case_preparedness}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-400 transition-all duration-700"
              style={{ width: `${evaluation.edge_case_preparedness}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Signal Breakdown: Builder vs Fluff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Builder Signals */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-3">
            <CheckCircle2 className="h-4 w-4" />
            <span>Builder Signals Detected ({evaluation.builder_signals_detected?.length || 0})</span>
          </div>
          {evaluation.builder_signals_detected?.length > 0 ? (
            <ul className="space-y-2 text-emerald-300">
              {evaluation.builder_signals_detected.map((signal, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-500">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">No genuine builder signals detected in defense.</p>
          )}
        </div>

        {/* Fluff Signals */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold mb-3">
            <AlertTriangle className="h-4 w-4" />
            <span>Fluff &amp; Evasion Flags ({evaluation.fluff_signals_detected?.length || 0})</span>
          </div>
          {evaluation.fluff_signals_detected?.length > 0 ? (
            <ul className="space-y-2 text-rose-300">
              {evaluation.fluff_signals_detected.map((signal, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-rose-500">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">Zero evasive signals detected. Clean technical defense.</p>
          )}
        </div>
      </div>

      {/* 4. Judge / Evaluator Note */}
      <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 font-mono text-xs">
        <div className="text-zinc-400 font-semibold mb-1">
          ✦ Evaluator Synthesis:
        </div>
        <p className="text-zinc-300 leading-relaxed">
          {evaluation.evaluator_note || evaluation.feedback}
        </p>
      </div>

      {/* 5. Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        {onRetest && (
          <button
            type="button"
            onClick={onRetest}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retest Defense</span>
          </button>
        )}

        <div className="flex items-center space-x-3 ml-auto">
          {hasNextQuestion && (
            <button
              type="button"
              onClick={onNextQuestion}
              className="inline-flex items-center space-x-2 rounded-xl border border-white/20 bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 font-mono text-xs font-semibold text-zinc-100 transition"
            >
              <span>Next Viva Question</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          <a
            href={`/verdict/${analysisId}`}
            className="inline-flex items-center space-x-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white px-5 py-2.5 font-mono text-xs font-bold shadow-lg transition"
          >
            <span>Proceed to Final Verdict &amp; Proof Receipt</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
