"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Sliders,
  FileCheck2,
  Lock,
  ArrowRight,
  Clock,
  User,
  GitBranch,
} from "lucide-react";

export default function EvaluatorVivaControlRoom() {
  const params = useParams();
  const router = useRouter();
  const sessionId = (params?.sessionId as string) || "session-001";

  const [aiScore, setAiScore] = useState<number>(24);
  const [manualOverrideScore, setManualOverrideScore] = useState<number>(25);
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [evaluatorNotes, setEvaluatorNotes] = useState<string>(
    "Candidate was unable to explain token refresh propagation mechanism. High probability of monolithic copy-paste."
  );
  const [isSealing, setIsSealing] = useState<boolean>(false);

  const handleSealCertificate = () => {
    setIsSealing(true);
    setTimeout(() => {
      setIsSealing(false);
      router.push("/verdict/demo-smart-campus");
    }, 1000);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Live Viva Oversight</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Room #ROOM-4A82</span>
          </div>

          <div className="flex items-center space-x-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
              Viva Examination Control Room
            </h1>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs text-amber-400 font-semibold flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>LIVE DEFENSE IN PROGRESS</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-zinc-300">
            Candidate: <span className="text-zinc-100 font-bold">Aryan Kumar</span> (@aryan-k)
          </div>
          <Link
            href="/evidence/demo-smart-campus"
            className="rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2 text-zinc-400 hover:text-zinc-200 transition"
          >
            Evidence Wall ↗
          </Link>
        </div>
      </div>

      {/* 2. Split Screen: Candidate Defense Stream vs Evaluator Scoring Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Defense Telemetry (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question Review Card */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 font-mono text-xs">
              <span className="text-zinc-400 font-semibold flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Active Gemini Viva Challenge (Question 1 of 3)</span>
              </span>
              <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-rose-400 text-[10px]">
                DIFFICULTY: HARD
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 font-mono text-xs text-zinc-200 leading-relaxed mb-4">
              &ldquo;Aryan, in your useAuthContext hook at line 18, you call onAuthStateChanged to track authentication state. If the Firebase auth token expires while the user has an active WebSocket connection on the dashboard, how does your hook propagate the re-authentication requirement to the WebSocket layer? I don&apos;t see any token refresh logic here.&rdquo;
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-500">
              <span>Required Concepts:</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">#token refresh</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">#websocket reconnection</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">#stale closure</span>
            </div>
          </div>

          {/* Candidate Submitted Defense */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 font-mono text-xs">
              <span className="text-zinc-400 font-semibold flex items-center space-x-1.5">
                <User className="h-3.5 w-3.5 text-zinc-300" />
                <span>Candidate Response Received</span>
              </span>
              <span className="text-zinc-500 text-[10px]">Recorded 1m ago via Web Audio</span>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 font-mono text-xs text-rose-200 leading-relaxed">
              &ldquo;The useAuthContext hook automatically handles token refresh in the background using Firebase standard architecture.&rdquo;
            </div>

            <div className="mt-4 rounded-lg bg-zinc-950 p-3 font-mono text-xs space-y-1.5">
              <div className="text-rose-400 font-semibold text-[11px]">✦ AI Fraud Detection Flags:</div>
              <div className="text-zinc-400 text-[11px]">• Generic phrase &ldquo;automatically handles&rdquo; detected (Zero implementation depth)</div>
              <div className="text-zinc-400 text-[11px]">• Did not explain WebSocket propagation mechanism</div>
            </div>
          </div>
        </div>

        {/* Right: Evaluator Override & Certification Console (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 font-mono">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                  Professor Evaluation Suite
                </span>
                <h3 className="font-display text-base font-bold text-zinc-100">
                  Scoring &amp; Override
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-500">AI Proposed:</span>
                <div className="font-mono text-xl font-bold text-rose-400">{aiScore}/100</div>
              </div>
            </div>

            {/* Manual Override Slider */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 flex items-center space-x-1.5">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Final Endorsed Score:</span>
                </label>
                <span
                  className={`text-lg font-bold ${
                    manualOverrideScore >= 75
                      ? "text-emerald-400"
                      : manualOverrideScore >= 50
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {manualOverrideScore} / 100
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={manualOverrideScore}
                onChange={(e) => {
                  setManualOverrideScore(parseInt(e.target.value, 10));
                  setIsOverridden(true);
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />

              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0 (Freeloader)</span>
                <span>50 (Marginal)</span>
                <span>100 (Verified Builder)</span>
              </div>
            </div>

            {/* Evaluator Notes */}
            <div className="space-y-2 font-mono text-xs">
              <label className="block text-zinc-300">Official Evaluator Remarks (Immutable on chain):</label>
              <textarea
                rows={4}
                value={evaluatorNotes}
                onChange={(e) => setEvaluatorNotes(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Seal & Sign Action */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <button
                type="button"
                onClick={handleSealCertificate}
                disabled={isSealing}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 font-mono text-xs font-bold shadow-lg transition"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {isSealing ? "Sealing Cryptographic Certificate..." : "Seal & Sign Cryptographic Certificate ➔"}
                </span>
              </button>

              <p className="text-center font-mono text-[10px] text-zinc-500">
                Signs certificate with Prof. Alok Sharma&apos;s institutional key.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
