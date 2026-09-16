"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  GitBranch,
  Terminal,
  FileCheck,
  Download,
  Mic,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Users,
  Award,
  Layers,
  Code2,
} from "lucide-react";

export default function InvestorJudgeShowcase() {
  const [activeScenario, setActiveScenario] = useState<"chatgpt" | "ghost" | "builder">("chatgpt");
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedComment, setCopiedComment] = useState(false);

  // Judge Simulator Weights
  const [gitWeight, setGitWeight] = useState(35);
  const [astWeight, setAstWeight] = useState(25);
  const [vivaWeight, setVivaWeight] = useState(40);

  // Simulated PR Bot Mode
  const [prBotMode, setPrBotMode] = useState<"blocked" | "approved">("blocked");

  const handleCopyWorkflow = () => {
    const yaml = `name: "Pramaan AI — Proof-of-Work Forensic Audit"
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  pramaan-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: ROhitg-upta/pramaan-action@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          strict_viva_block: true`;
    navigator.clipboard.writeText(yaml);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  // Calculator Scores
  const rohitCalculated = Math.round(
    (92 * gitWeight + 88 * astWeight + 98 * vivaWeight) / 100
  );
  const aryanCalculated = Math.round(
    (14 * gitWeight + 20 * astWeight + 24 * vivaWeight) / 100
  );

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Hero Pitch & Executive Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100">
          Pramaan AI: Judge &amp; Investor Showcase
        </h1>

        <p className="font-body text-base sm:text-lg text-zinc-400 leading-relaxed">
          &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo; <br />
          Experience the autonomous forensics platform that turns hours of manual code inspection into mathematical certainty in 3 seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
          <Link
            href="/investigate/demo-smart-campus"
            className="rounded-xl bg-white px-5 py-2.5 font-medium text-zinc-950 hover:bg-zinc-200 transition shadow-sm flex items-center space-x-2"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Live Investigation (5s Scan)</span>
          </Link>
          <Link
            href="/evaluator/audit/demo-smart-campus/certificate"
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition flex items-center space-x-1.5"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>View 300 DPI Vector PDF Diploma</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Crime Scenarios Suite */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
              Forensic Crime Scenarios
            </h2>
            <p className="font-mono text-xs text-zinc-400 mt-0.5">
              Select an archetype to inspect how Pramaan isolates AI cheats from authentic builders.
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveScenario("chatgpt")}
              className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1.5 ${
                activeScenario === "chatgpt"
                  ? "border-rose-500/40 bg-rose-950/30 text-rose-300 font-semibold"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
              <span>1. ChatGPT Monolithic Dump</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario("ghost")}
              className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1.5 ${
                activeScenario === "ghost"
                  ? "border-amber-500/40 bg-amber-950/30 text-amber-300 font-semibold"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>2. Zero-Churn Ghost</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario("builder")}
              className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1.5 ${
                activeScenario === "builder"
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-semibold"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>3. Authentic Builder</span>
            </button>
          </div>
        </div>

        {/* Dynamic Scenario Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {activeScenario === "chatgpt" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-display text-lg font-bold text-zinc-100">
                      Aryan Kumar (@aryan-k) • Monolithic 3:42 AM AI Injection
                    </span>
                    <span className="rounded-full border border-rose-500/30 bg-rose-950/20 px-2.5 py-0.5 text-[10px] text-rose-400 font-bold">
                      ✕ Fails Proof-of-Work Standard
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] font-body">
                    Pushed +4,821 lines in a single commit at 03:42 AM within 6 hours of demo deadline. 0 deletions. Flunked oral defense on mutex semantics.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-rose-400">24 / 100</span>
                  <span className="text-zinc-500 text-[10px] uppercase">Composite Score</span>
                </div>
              </div>

              {/* Forensic Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Commit Count</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">1 Monolithic Commit</div>
                  <div className="text-[10px] text-zinc-500">Panic Burst at 03:42 AM</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Debugging Churn</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">0.0% Churn Ratio</div>
                  <div className="text-[10px] text-zinc-500">Zero refactoring history</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">AST Tier 3 Logic</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">1.4% (89 Lines)</div>
                  <div className="text-[10px] text-zinc-500">98.6% Generic Boilerplate</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Oral Viva Defense</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">24 / 100 Flunked</div>
                  <div className="text-[10px] text-zinc-500">Regurgitated generic buzzwords</div>
                </div>
              </div>

              {/* 1-Click Interactive Evidence Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/student/viva/ROOM-4A82"
                  className="rounded-xl bg-white text-zinc-950 px-4 py-2 font-medium hover:bg-zinc-200 transition shadow-sm flex items-center space-x-1.5"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Launch Flunked Viva Defense Session ➔</span>
                </Link>

                <Link
                  href="/evidence/demo-smart-campus"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition flex items-center space-x-1.5"
                >
                  <GitBranch className="h-3.5 w-3.5 text-rose-400" />
                  <span>Inspect DVR Crime Timeline</span>
                </Link>

                <Link
                  href="/u/aryan-k"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
                >
                  View Flagged Public Profile
                </Link>
              </div>
            </div>
          )}

          {activeScenario === "ghost" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-display text-lg font-bold text-zinc-100">
                      Priya Patel (@priya-p) • Zero-Churn Ghost Passenger
                    </span>
                    <span className="rounded-full border border-amber-500/30 bg-amber-950/20 px-2.5 py-0.5 text-[10px] text-amber-400 font-bold">
                      ⚠️ Ghost Contributor Detected
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] font-body">
                    Authored 5 commits totaling 64 lines exclusively modifying README files, CSS tags, and logo links. Claimed 33% equal authorship on academic capstone.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-amber-400">35 / 100</span>
                  <span className="text-zinc-500 text-[10px] uppercase">Composite Score</span>
                </div>
              </div>

              {/* Forensic Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Commits Mined</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">5 Trivial Commits</div>
                  <div className="text-[10px] text-zinc-500">README &amp; Config Only</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Team Share</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">14% Line Volume</div>
                  <div className="text-[10px] text-zinc-500">Extreme team Gini (0.76)</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">AST Tier 3 Logic</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">0.0% (0 Lines)</div>
                  <div className="text-[10px] text-zinc-500">Zero functional code</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Oral Viva Defense</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">58 / 100 Evaded</div>
                  <div className="text-[10px] text-zinc-500">Failed state lifecycle question</div>
                </div>
              </div>

              {/* 1-Click Interactive Evidence Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/evaluator/cohorts/cs401-capstone"
                  className="rounded-xl bg-white text-zinc-950 px-4 py-2 font-medium hover:bg-zinc-200 transition shadow-sm flex items-center space-x-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Inspect Cohort Freeloader Balance Heatmap ➔</span>
                </Link>

                <Link
                  href="/evidence/demo-smart-campus"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
                >
                  Compare DNA Radar Matrix
                </Link>
              </div>
            </div>
          )}

          {activeScenario === "builder" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-display text-lg font-bold text-zinc-100">
                      Rohit Sharma (@rohit-sharma) • 100% Verified Builder
                    </span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-0.5 text-[10px] text-emerald-400 font-bold">
                      ✓ Hoollow Verified Builder
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] font-body">
                    Authored 38 commits across 14 consecutive active days. Iterative 38.2% churn with 5,420 lines of Tier-3 algorithmic logic. Flawless oral defense certified by faculty.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-emerald-400">94 / 100</span>
                  <span className="text-zinc-500 text-[10px] uppercase">Composite Score (A+)</span>
                </div>
              </div>

              {/* Forensic Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Atomic Commits</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">42 Verified Commits</div>
                  <div className="text-[10px] text-zinc-500">Across 14 Active Days</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Debugging Churn</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">38.2% Healthy Churn</div>
                  <div className="text-[10px] text-zinc-500">Refactoring &amp; Unit Tests</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Tier 3 Core Logic</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">5,420 Lines (53.4%)</div>
                  <div className="text-[10px] text-zinc-500">Distributed Mutex &amp; AST</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5">
                  <div className="text-[10px] text-zinc-500 uppercase">Oral Viva Defense</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">98 / 100 Certified</div>
                  <div className="text-[10px] text-zinc-500">Prof. Alok Sharma Sign-off</div>
                </div>
              </div>

              {/* 1-Click Interactive Evidence Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/evaluator/audit/demo-smart-campus/certificate"
                  className="rounded-xl bg-white text-zinc-950 px-4 py-2 font-medium hover:bg-zinc-200 transition shadow-sm flex items-center space-x-1.5"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Download Official Vector PDF Diploma ➔</span>
                </Link>

                <Link
                  href="/u/rohit-sharma"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition flex items-center space-x-1.5"
                >
                  <Award className="h-3.5 w-3.5 text-emerald-400" />
                  <span>View Public Proof Profile &amp; SVG Badge</span>
                </Link>

                <Link
                  href="/verdict/demo-smart-campus"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
                >
                  Thermal Receipt
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Live Simulated GitHub Pull Request Forensics Bot */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
              <span>✦ ENTERPRISE DEVTURNKEY CAPABILITY</span>
            </div>
            <h3 className="font-display text-xl font-bold text-zinc-100">
              Automated GitHub Pull Request Forensics Bot
            </h3>
            <p className="font-mono text-xs text-zinc-400 mt-0.5">
              Live simulation of Pramaan&apos;s Webhook Bot posting sticky forensic inspection comments on candidate Pull Requests.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setPrBotMode("blocked")}
              className={`px-3 py-1.5 rounded-xl border transition ${
                prBotMode === "blocked"
                  ? "border-rose-500/40 bg-rose-950/30 text-rose-300 font-semibold"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Simulate Blocked AI Dump PR
            </button>
            <button
              type="button"
              onClick={() => setPrBotMode("approved")}
              className={`px-3 py-1.5 rounded-xl border transition ${
                prBotMode === "approved"
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-semibold"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Simulate Verified Builder PR
            </button>
          </div>
        </div>

        {/* GitHub Mock Comment Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs">
          {/* GitHub Header */}
          <div className="border-b border-zinc-800 bg-zinc-900/60 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                P
              </div>
              <span className="font-bold text-zinc-200">pramaan-ai-bot</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400">bot</span>
              <span className="text-[11px] text-zinc-500">commented 2 minutes ago</span>
            </div>
            <span className="text-[10px] text-zinc-500">SHA: 8fae491</span>
          </div>

          {/* Comment Body */}
          <div className="p-5 space-y-4 text-zinc-300 font-mono text-xs">
            <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-3">
              <span className="text-lg">⚖️</span>
              <span className="font-display font-bold text-sm text-zinc-100">
                Pramaan AI — Proof-of-Work Forensic Audit
              </span>
            </div>

            {/* Metrics Markdown Table */}
            <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/30">
              <table className="w-full text-left">
                <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Forensic Metric</th>
                    <th className="py-2 px-3">Observed Value</th>
                    <th className="py-2 px-3">Threshold Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-zinc-200">Author</td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? "@aryan-k" : "@rohit-sharma"}
                    </td>
                    <td className="py-2 px-3 text-emerald-400">✅ Verified Identity</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-zinc-200">Diff Analyzed</td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? "+4,821 / -0 lines (1 commit)" : "+1,840 / -520 lines (14 commits)"}
                    </td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? (
                        <span className="text-rose-400">🚨 Monolithic Dump Detected</span>
                      ) : (
                        <span className="text-emerald-400">✅ Atomic Commits</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-zinc-200">AST Tier 3 Logic</td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? "1.4% Algorithmic" : "54.2% Algorithmic Core"}
                    </td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? (
                        <span className="text-rose-400">🚨 Low Logic Weight (&lt;30%)</span>
                      ) : (
                        <span className="text-emerald-400">✅ High Algorithmic Core (&gt;50%)</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-zinc-200">Iterative Debugging</td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? "0.0% Churn" : "38.2% Churn Ratio"}
                    </td>
                    <td className="py-2 px-3">
                      {prBotMode === "blocked" ? (
                        <span className="text-rose-400">🚨 Zero-Churn Monolithic Dump</span>
                      ) : (
                        <span className="text-emerald-400">✅ Healthy Churn (Iterative)</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Banner */}
            <div
              className={`rounded-xl border p-4 space-y-2 ${
                prBotMode === "blocked"
                  ? "border-rose-500/30 bg-rose-950/20"
                  : "border-emerald-500/30 bg-emerald-950/20"
              }`}
            >
              <div className="font-bold text-zinc-100 flex items-center space-x-2">
                {prBotMode === "blocked" ? (
                  <>
                    <AlertOctagon className="h-4 w-4 text-rose-400" />
                    <span className="text-rose-400">
                      STATUS: MERGE BLOCKED — ORAL VIVA DEFENSE REQUIRED
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">
                      STATUS: MERGE APPROVED — PROOF OF WORK VERIFIED
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-zinc-300">
                {prBotMode === "blocked"
                  ? "Candidate pushed a monolithic dump of +4,821 lines with 0% iterative churn. A 2-minute line-targeted viva defense on lines 18–48 is required before branch merging."
                  : "Candidate verified as primary architect. AST cyclomatic weighting and iterative commit history satisfied Hoollow standards."}
              </p>
            </div>

            {/* Direct Links inside Bot Comment */}
            <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
              {prBotMode === "blocked" ? (
                <Link
                  href="/student/viva/ROOM-4A82"
                  className="rounded-lg bg-white px-3.5 py-1.5 text-zinc-950 font-bold hover:bg-zinc-200 transition"
                >
                  🎙️ Launch Oral Viva Defense (Room #PR-42-8fae491) ➔
                </Link>
              ) : (
                <Link
                  href="/evaluator/audit/demo-smart-campus/certificate"
                  className="rounded-lg bg-white px-3.5 py-1.5 text-zinc-950 font-bold hover:bg-zinc-200 transition"
                >
                  📄 View Official PDF Diploma ➔
                </Link>
              )}

              <span className="text-[10px] text-zinc-500">
                Verified under Hoollow Proof-of-Work Standard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Judge Grading Formula Simulator */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1">
            <span>✦ MATHEMATICAL OBJECTIVITY</span>
          </div>
          <h3 className="font-display text-xl font-bold text-zinc-100">
            Interactive Multi-Layer Weight Simulator
          </h3>
          <p className="font-mono text-xs text-zinc-400 mt-0.5">
            Test why Pramaan&apos;s formula cannot be bypassed by copying code from ChatGPT or tutorial repos.
          </p>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Slider 1: Git Forensics */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-200">1. Git Forensics Weight</span>
              <span className="text-emerald-400 font-bold">{gitWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={gitWeight}
              onChange={(e) => setGitWeight(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="text-[10px] text-zinc-500">Commit churn, cadence &amp; burstiness</div>
          </div>

          {/* Slider 2: AST Complexity */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-200">2. AST Complexity Weight</span>
              <span className="text-indigo-400 font-bold">{astWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={astWeight}
              onChange={(e) => setAstWeight(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="text-[10px] text-zinc-500">Tier 3 Algorithmic logic ratio</div>
          </div>

          {/* Slider 3: Oral Viva */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-200">3. Autonomous Viva Weight</span>
              <span className="text-cyan-400 font-bold">{vivaWeight}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={60}
              value={vivaWeight}
              onChange={(e) => setVivaWeight(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="text-[10px] text-zinc-500">Oral defense against AI examiner</div>
          </div>
        </div>

        {/* Live Score Output Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-emerald-400">Rohit Sharma (Authentic Builder)</span>
              <span className="text-2xl text-emerald-300 font-bold">{rohitCalculated} / 100</span>
            </div>
            <p className="text-[11px] text-zinc-300">
              High scores across git churn (92), algorithmic core (88), and verbal defense (98) guarantee Tier-1 certification regardless of weight shifts.
            </p>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-rose-400">Aryan Kumar (ChatGPT Monolithic Dump)</span>
              <span className="text-2xl text-rose-300 font-bold">{aryanCalculated} / 100</span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Even with 10,000 pasted lines, zero churn (14) and flunked viva (24) mathematically cap the candidate below passing standards.
            </p>
          </div>
        </div>
      </div>

      {/* 5. 1-Click CI/CD GitHub Action Setup Drawer */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-zinc-100">
              Deploy Pramaan CI/CD Action in 30 Seconds
            </h3>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              Copy this GitHub Action template to <code>.github/workflows/pramaan-verify.yml</code> to block cheating on every Pull Request.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyWorkflow}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-white text-zinc-950 px-4 py-2 font-semibold hover:bg-zinc-200 transition shadow-sm"
          >
            {copiedWorkflow ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedWorkflow ? "YAML Copied!" : "Copy GitHub Action YAML"}</span>
          </button>
        </div>

        <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
{`name: "Pramaan AI — Proof-of-Work Forensic Audit"
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  pramaan-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full commit history for churn analysis
      - uses: ROhitg-upta/pramaan-action@v1
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          strict_viva_block: true`}
        </pre>
      </div>
    </div>
  );
}
