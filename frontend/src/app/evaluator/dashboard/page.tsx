"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  FileSpreadsheet,
  GitBranch,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Users,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { analyzeRepo } from "@/lib/api";

export default function EvaluatorDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [batchCsvText, setBatchCsvText] = useState(
    `https://github.com/student-team-01/smart-campus-app, main\nhttps://github.com/student-team-02/autonomous-drone, master\nhttps://github.com/student-team-03/blockchain-vote, main`
  );
  const [isQueueing, setIsQueueing] = useState(false);

  const handleSingleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = repoUrl.trim() || "https://github.com/demo/smart-campus-app";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pramaan_target_url", url);
    }
    try {
      const res = await analyzeRepo(url, branch);
      router.push(`/investigate/${res.analysis_id}`);
    } catch {
      router.push("/investigate/demo-smart-campus");
    }
  };

  const handleBatchQueue = () => {
    setIsQueueing(true);
    setTimeout(() => {
      setIsQueueing(false);
      router.push("/evaluator/audits");
    }, 1000);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Evaluator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-3 py-0.5 text-[11px] font-mono text-cyan-400 mb-2">
            <span>✦ INSTITUTIONAL FORENSICS COMMAND CENTER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Evaluator Portal: {user?.fullName || "Prof. Alok Sharma"}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            {user?.organizationName || "Dept. of Computer Science & Cyber Forensics"} • Spring 2026
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/evaluator/cohorts"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 font-mono text-xs text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Manage Cohorts (2)</span>
          </Link>
          <Link
            href="/evaluator/audits"
            className="inline-flex items-center space-x-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 font-mono text-xs font-semibold shadow-md transition"
          >
            <span>View All Audits (42)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Top KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase">
            <span>Total Repos Audited</span>
            <GitBranch className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold text-zinc-100">42</div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">Across 2 Active Cohorts</p>
        </div>

        {/* Metric 2: Fraud Flags */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-rose-400 font-mono text-xs uppercase">
            <span>Flagged Monolithic Dumps</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold text-rose-400">8 Repos</div>
          <p className="mt-1 font-mono text-[11px] text-rose-300/70">Big Bang / Zero-Churn Breach</p>
        </div>

        {/* Metric 3: Pending Vivas */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-amber-400 font-mono text-xs uppercase">
            <span>Pending Live Vivas</span>
            <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold text-amber-300">3 Sessions</div>
          <p className="mt-1 font-mono text-[11px] text-amber-400/80">
            <Link href="/evaluator/viva/session-001" className="hover:underline">
              Next: Aryan Kumar (Room #ROOM-4A82) ➔
            </Link>
          </p>
        </div>

        {/* Metric 4: Class Integrity */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-emerald-400 font-mono text-xs uppercase">
            <span>Class Integrity Grade</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 font-mono text-3xl font-bold text-emerald-400">B- (74.8%)</div>
          <p className="mt-1 font-mono text-[11px] text-emerald-500/80">34 Builders Verified</p>
        </div>
      </div>

      {/* 3. Ingestion Command Panel: Single Audit vs Batch CSV */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-base font-bold text-zinc-100">
              Audit Launchpad
            </h3>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-white/5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "single"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Single Repository
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("batch")}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === "batch"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Batch Cohort CSV (50 Repos)
            </button>
          </div>
        </div>

        {activeTab === "single" ? (
          <form onSubmit={handleSingleAudit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://github.com/organization/student-repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-4 pr-4 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <div className="w-full sm:w-32">
              <input
                type="text"
                placeholder="branch (main)"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 px-4 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 font-mono text-xs font-semibold shadow-lg transition"
            >
              <span>Launch Audit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-zinc-400 mb-2">
                Paste CSV list of Git repositories (one repo URL per line with optional branch):
              </label>
              <textarea
                rows={4}
                value={batchCsvText}
                onChange={(e) => setBatchCsvText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-500">
                Pydriller will queue 3 repositories across 6 worker threads.
              </span>
              <button
                type="button"
                onClick={handleBatchQueue}
                disabled={isQueueing}
                className="inline-flex items-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 font-mono text-xs font-semibold transition"
              >
                <UploadCloud className="h-4 w-4" />
                <span>{isQueueing ? "Queueing Repositories..." : "Queue Batch Ingestion ➔"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Recent Repositories Feed */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <h3 className="font-display text-base font-bold text-zinc-100">
            Recent Institutional Audit Runs
          </h3>
          <Link
            href="/evaluator/audits"
            className="font-mono text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1"
          >
            <span>View all 42 audits</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {/* Item 1 */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold text-zinc-200">
                  smart-campus-app
                </span>
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  CS401 Capstone
                </span>
                <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-400">
                  FLAG_BIG_BANG (03:42 AM)
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                Rohit Sharma (94) • Aryan Kumar (24/100) • Priya Patel (35/100)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-zinc-400">Grade: C+ (51/100)</span>
              <Link
                href="/evidence/demo-smart-campus"
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:bg-zinc-800 transition"
              >
                Evidence Wall ➔
              </Link>
              <Link
                href="/evaluator/viva/session-001"
                className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 font-mono text-xs font-semibold transition"
              >
                Oversee Viva ➔
              </Link>
            </div>
          </div>

          {/* Item 2 */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold text-zinc-200">
                  autonomous-drone-navigation
                </span>
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  CS401 Capstone
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                  ✓ Hoollow Verified (96%)
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                Ananya Roy (96) • Vikram Singh (89) • 142 atomic commits across 21 days
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-emerald-400 font-semibold">Grade: A (92.5/100)</span>
              <Link
                href="/evidence/demo-smart-campus"
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:bg-zinc-800 transition"
              >
                Evidence Wall ➔
              </Link>
            </div>
          </div>

          {/* Item 3 */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold text-zinc-200">
                  defi-liquidity-pool-v3
                </span>
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  HackMIT 2026
                </span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                  FLAG_ZERO_CHURN (0.0%)
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                Dev Team 4 • 2 Commits with +12,400 lines • Missing debugging history
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-amber-400 font-semibold">Grade: D+ (38/100)</span>
              <Link
                href="/evidence/demo-smart-campus"
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:bg-zinc-800 transition"
              >
                Evidence Wall ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
