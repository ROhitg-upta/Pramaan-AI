"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Terminal,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  GitCommit,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { cardEntry, cardEntryTransition } from "@/lib/animations";
import { checkBackendHealth, getAnalysisReport, analyzeRepo } from "@/lib/api";
import { type FullReportResponse } from "@/lib/mock-data";

export default function DeveloperWorkbench() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [isAuditing, setIsAuditing] = useState(false);
  const [reportData, setReportData] = useState<FullReportResponse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"churn" | "ast" | "viva">("churn");
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Live Metric Counters
  const commitsCount = useCountUp(142, 1800);
  const linesScanned = useCountUp(28491, 2000);
  const verificationRate = useCountUp(94, 2200);

  // Audio Hook for Diagnostics Sandbox
  const {
    isListening,
    volume,
    frequencies,
    errorMessage: audioError,
    toggleListening,
  } = useAudioAnalyser(32);

  // Backend Health State
  const [backendHealth, setBackendHealth] = useState<{
    live: boolean;
    mode: "LIVE" | "MOCK";
    url: string;
    latencyMs?: number;
  }>({ live: true, mode: "MOCK", url: "Testing..." });

  useEffect(() => {
    checkBackendHealth().then(setBackendHealth);
  }, []);

  const handleAudit = async (targetUrl = repoUrl) => {
    const urlToAnalyze = targetUrl.trim() || "https://github.com/demo/smart-campus-app";
    setIsAuditing(true);
    try {
      const res = await analyzeRepo(urlToAnalyze, selectedBranch);
      const analysisId = res?.analysis_id || "demo-smart-campus";
      router.push(`/investigate/${analysisId}`);
    } catch (err) {
      console.warn("Analysis trigger failed, using demo route:", err);
      router.push("/investigate/demo-smart-campus");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleLoadSample = () => {
    router.push("/investigate/demo-smart-campus");
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. Hero Header */}
      <div className="flex flex-col items-center text-center">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1 text-xs font-mono text-emerald-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Horizon 2026 • Powered by Hoollow Proof of Work</span>
          <span className="text-emerald-500/60">➔</span>
        </motion.div>

        {/* Crisp Developer Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 max-w-4xl"
        >
          Separating Real Builders{" "}
          <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            from Copy-Paste.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 font-body text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed"
        >
          Autonomous code forensics and line-targeted viva defense. We analyze commit cadence, detect 3 AM AI dumps, and verify genuine repository authorship.
        </motion.p>
      </div>

      {/* 2. The Command Bar (Raycast / Linear Style Floating Bar) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto mt-10 max-w-2xl"
      >
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-2 shadow-2xl backdrop-blur-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAudit();
            }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full flex items-center">
              <GitBranch className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="https://github.com/organization/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isAuditing}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-zinc-100 px-5 py-2.5 font-mono text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
            >
              <span>{isAuditing ? "Auditing Graph..." : "Audit Repository"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* 1-Click Demo Shortcut */}
          <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2.5 px-2">
            <span className="font-mono text-xs text-zinc-500">
              No repo on hand? Test the pre-mined sample:
            </span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Zap className="h-3 w-3" />
              <span>⚡ Try Sample: Smart Campus</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 3. Live Telemetry & Metrics Strip */}
      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-xs uppercase tracking-wider">Commits Traversed</span>
            <GitCommit className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-zinc-100">
            {commitsCount.formatted}
          </div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            Granular PyDriller mining
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-xs uppercase tracking-wider">Lines Scanned</span>
            <FileCode2 className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-zinc-100">
            {linesScanned.formatted}
          </div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            Excluding lockfiles & vendor code
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-xs uppercase tracking-wider">Logic vs Boilerplate</span>
            <Layers className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className="font-mono text-2xl font-bold text-emerald-400">72%</span>
            <span className="font-mono text-xs text-zinc-500">Tier 3 Core</span>
          </div>
          {/* Ratio bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden flex">
            <div className="h-full bg-emerald-400 w-[72%]" />
            <div className="h-full bg-zinc-600 w-[28%]" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-mono text-xs uppercase tracking-wider">Proof Verification</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-emerald-400">
            {verificationRate.value}%
          </div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            Verified Builder Authenticity
          </p>
        </div>
      </div>

      {/* 4. Interactive Feature Architecture Showcase */}
      <div className="mt-16">
        <div className="flex flex-col items-center mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-zinc-100">
            High-Precision Forensic Pillars
          </h2>
          <p className="mt-1 font-body text-sm text-zinc-400 max-w-xl">
            How Pramaan AI isolates actual engineering craft from ChatGPT scrapers and credit freeloaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Churn & Cadence */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-zinc-100">
                Commit Evolution & Churn Matrix
              </h3>
              <p className="mt-2 font-body text-sm text-zinc-400 leading-relaxed">
                Real builders write, break, test, and refactor. We compute the Added : Modified : Deleted churn ratio. Monolithic 4,000-line injections at 3 AM with zero deletions trigger immediate anomaly flags.
              </p>
            </div>
            <div className="mt-6 rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400 border border-white/5">
              <div className="text-emerald-400">● Rohit: 38% Churn (Iterative)</div>
              <div className="text-red-400 mt-1">● Aryan: 0% Churn (Monolithic Dump)</div>
            </div>
          </div>

          {/* Card 2: 4-Tier Semantic AST */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-zinc-100">
                4-Tier Semantic AST Weighting
              </h3>
              <p className="mt-2 font-body text-sm text-zinc-400 leading-relaxed">
                Not all lines are created equal. We classify changes into 4 semantic tiers: package-locks and configs (0.0x), templates (0.2x), UI bindings (1.0x), and distributed algorithms/auth systems (3.0x).
              </p>
            </div>
            <div className="mt-6 rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400 border border-white/5">
              <div className="flex justify-between">
                <span>Tier 3 (Core Algorithmic)</span>
                <span className="text-cyan-400">3.0x weight</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Tier 0 (Vendor/Lockfile)</span>
                <span className="text-zinc-600">0.0x weight</span>
              </div>
            </div>
          </div>

          {/* Card 3: Autonomous Oral Viva Defense */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-purple-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-zinc-100">
                Contributor Authorship & Viva Defense
              </h3>
              <p className="mt-2 font-body text-sm text-zinc-400 leading-relaxed">
                Gemini targets the exact functions and line ranges each student claimed to commit. It questions concurrency traps and trade-offs. Fluff and ChatGPT recitations drop the score to 24/100 instantly.
              </p>
            </div>
            <div className="mt-6 rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400 border border-white/5">
              <span className="text-purple-400">&gt; Question targeting line 78:</span>
              <p className="text-zinc-400 mt-0.5 truncate">&ldquo;How does your mutex handle Redis network partition?&rdquo;</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Interactive Sample Audit Dossier (when loaded) */}
      {reportData && isDrawerOpen && (
        <motion.div
          variants={cardEntry}
          initial="initial"
          animate="animate"
          className="mt-12 rounded-2xl border border-white/10 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Verification Report
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-xs text-zinc-400">{reportData.analysis_id}</span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-zinc-100">
                {reportData.repo_url}
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
                Composite Integrity: {reportData.integrity_grade}
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                [Dismiss]
              </button>
            </div>
          </div>

          <p className="mt-4 font-body text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-white/5">
            {reportData.executive_summary}
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.contributors.map((contrib) => (
              <div
                key={contrib.id}
                className="rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-sm">
                    <span className="font-semibold text-zinc-100">{contrib.primary_name}</span>
                    <span
                      className={`font-bold ${
                        contrib.pramaan_score && contrib.pramaan_score >= 70
                          ? "text-emerald-400"
                          : contrib.pramaan_score && contrib.pramaan_score >= 40
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {contrib.pramaan_score ? `${contrib.pramaan_score}/100` : "PENDING"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 font-mono text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Commits:</span>
                      <span>{contrib.total_commits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Lines Added / Deleted:</span>
                      <span>+{contrib.lines_added} / -{contrib.lines_deleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Churn Ratio:</span>
                      <span>{contrib.churn_ratio}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tier 3 (Core Logic):</span>
                      <span className="text-emerald-400">
                        {contrib.tier_breakdown.tier_3.percentage}%
                      </span>
                    </div>
                  </div>

                  {contrib.anomaly_flags.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {contrib.anomaly_flags.map((flag, i) => (
                        <div
                          key={i}
                          className="rounded border border-red-500/20 bg-red-500/10 px-2 py-1 font-mono text-[10px] text-red-400"
                        >
                          ⚠️ {flag.type}: {flag.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-white/5 pt-3">
                  <span
                    className={`font-mono text-[10px] uppercase font-semibold ${
                      contrib.verdict === "VERIFIED_BUILDER"
                        ? "text-emerald-400"
                        : contrib.verdict === "GHOST_CONTRIBUTOR"
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    Verdict: {contrib.verdict.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. Clean Developer Diagnostics Sandbox (Collapsible Drawer at Bottom) */}
      <div className="mt-16 border-t border-white/5 pt-6">
        <button
          onClick={() => setShowDiagnostics((prev) => !prev)}
          className="flex items-center space-x-2 font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {showDiagnostics ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          <span>Developer Diagnostics & Hardware Sandbox</span>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
            FFT Audio & API Health
          </span>
        </button>

        <AnimatePresence>
          {showDiagnostics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-xl border border-white/5 bg-zinc-900/40 p-4 font-mono text-xs overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Audio FFT */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 font-semibold">
                      Web Audio Analyser (Oral Defense Capture)
                    </span>
                    <button
                      onClick={toggleListening}
                      className="rounded border border-white/10 bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-200 hover:bg-zinc-700 transition"
                    >
                      {isListening ? "Stop Microphone" : "Test Microphone"}
                    </button>
                  </div>
                  {audioError && <p className="text-amber-400 text-[11px] mb-2">{audioError}</p>}
                  <div className="h-14 w-full rounded bg-zinc-950 p-2 flex items-end gap-1 border border-white/5">
                    {frequencies.map((f, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500/80 rounded-t transition-all duration-75"
                        style={{ height: `${Math.max(f * 100, 8)}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-zinc-500">
                    <span>Input: {isListening ? "Streaming Mic" : "Standby"}</span>
                    <span>Level: {Math.round(volume * 100)}%</span>
                  </div>
                </div>

                {/* API Health */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 font-semibold">Backend Link Status</span>
                    <button
                      onClick={() => checkBackendHealth().then(setBackendHealth)}
                      className="flex items-center space-x-1 rounded border border-white/10 bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-200 hover:bg-zinc-700 transition"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Ping</span>
                    </button>
                  </div>
                  <div className="rounded bg-zinc-950 p-3 border border-white/5 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Mode:</span>
                      <span className="text-emerald-400 font-medium">{backendHealth.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">API Endpoint:</span>
                      <span className="text-zinc-300">{backendHealth.url}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status:</span>
                      <span className="text-zinc-300">{backendHealth.live ? "Responsive" : "Offline"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
