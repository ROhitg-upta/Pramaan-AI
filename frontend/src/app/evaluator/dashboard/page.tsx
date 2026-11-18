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
  Download,
  FileText,
  X,
  Mic,
  Code2,
  BarChart3,
  Layers,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { analyzeRepo } from "@/lib/api";
import { mockFullReport } from "@/lib/mock-data";

interface ContributorTranscript {
  name: string;
  role: string;
  score: number;
  verdict: "VERIFIED_BUILDER" | "PROBABLE_FREELOADER" | "GHOST_CODER";
  question: string;
  transcript: string;
  builderSignals: string[];
  fluffSignals: string[];
}

const SAMPLE_TRANSCRIPTS: Record<string, ContributorTranscript> = {
  "Rohit Sharma": {
    name: "Rohit Sharma",
    role: "Lead Full-Stack Author (74% codebase)",
    score: 94,
    verdict: "VERIFIED_BUILDER",
    question: "In useAuthContext.jsx, you wrapped session state with a custom retry loop. What happens if network disconnects before Firebase resolves?",
    transcript: "I added an AbortController with a 5-second timeout and queued unauthenticated requests in an in-memory buffer so the socket layer doesn't encounter race conditions or drop active WebSocket subscriptions.",
    builderSignals: [
      "Referenced AbortController and network timeout constraints",
      "Demonstrated awareness of WebSocket session race conditions",
      "Explained state queueing architecture",
    ],
    fluffSignals: [],
  },
  "Aryan Kumar": {
    name: "Aryan Kumar",
    role: "Claimed Backend Contributor (24% code dump)",
    score: 24,
    verdict: "PROBABLE_FREELOADER",
    question: "Regarding your monolithic commit on auth_service.py at 3:42 AM, why is the churn ratio 0.0% and how do you handle concurrency?",
    transcript: "We followed industry standard best practices to make the backend scalable and secure. The code was tested thoroughly and follows clean architecture principles.",
    builderSignals: [],
    fluffSignals: [
      "Recited generic textbook buzzwords ('industry standard', 'clean architecture')",
      "Zero explanation of concurrency or Redis mutex logic",
      "Unable to justify monolithic 4,800-line overnight dump",
    ],
  },
  "Priya Patel": {
    name: "Priya Patel",
    role: "Documenter / Layout (2% code)",
    score: 35,
    verdict: "GHOST_CODER",
    question: "In your commits to styles and README, why were there zero modifications to the core recommendation algorithm despite claiming backend co-authorship?",
    transcript: "I helped with testing and worked closely with Rohit to review the code and write the documentation and markdown files.",
    builderSignals: ["Acknowledged focus on documentation and review"],
    fluffSignals: [
      "0% Tier-3 core algorithmic code authored",
      "Attribution misaligned with claimed technical capstone responsibilities",
    ],
  },
};

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

  // Anomaly filter state
  const [anomalyFilter, setAnomalyFilter] = useState<"all" | "big_bang" | "ghost" | "zero_churn">("all");

  // Transcript modal state
  const [selectedTranscript, setSelectedTranscript] = useState<ContributorTranscript | null>(null);

  const handleSingleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = repoUrl.trim() || "https://github.com/demo/smart-campus-app";
    triggerQuickAudit(url, branch);
  };

  const triggerQuickAudit = async (url: string, branchName = "main") => {
    setRepoUrl(url);
    setBranch(branchName);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pramaan_target_url", url);
    }
    try {
      const res = await analyzeRepo(url, branchName);
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

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Repository,Student Name,Pramaan Score,Verdict,Commits,Lines Added,Churn %,Tier 3 Lines,Flags\\n" +
      "smart-campus-app,Rohit Sharma,94,VERIFIED_BUILDER,42,7420,14.2%,6200,None\\n" +
      "smart-campus-app,Aryan Kumar,24,PROBABLE_FREELOADER,2,4800,0.0%,0,FLAG_BIG_BANG;FLAG_ZERO_CHURN\\n" +
      "smart-campus-app,Priya Patel,35,GHOST_CODER,1,620,0.0%,0,FLAG_GHOST_CONTRIBUTOR\\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Pramaan_Class_Audit_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Evaluator Mode Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 bg-amber-950/10 p-5 rounded-2xl border backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/20 px-3.5 py-1 text-xs font-mono text-amber-300 font-bold mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>INSTITUTIONAL EVALUATOR MODE</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Academic Integrity &amp; Team Attribution Dashboard
          </h1>

          <p className="mt-1 font-mono text-xs text-zinc-400">
            Evaluator: <span className="text-zinc-200 font-semibold">{user?.fullName || "Prof. Alok Sharma"}</span> • Dept. of Computer Science • Cohort: CS401 Senior Capstone
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 font-mono text-xs text-zinc-200 hover:border-amber-500/50 hover:text-amber-300 transition shadow-sm active:scale-95"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>Export CSV Audit Report</span>
          </button>

          <Link
            href="/evaluator/cohorts"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 font-mono text-xs text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
          >
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>Cohorts (2)</span>
          </Link>
        </div>
      </div>

      {/* 2. Side-by-Side Team Member Comparison Matrix */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-lg font-bold text-zinc-100">
                Team Member Side-by-Side Comparison: smart-campus-app
              </h2>
            </div>
            <p className="font-mono text-xs text-zinc-400 mt-1">
              Cross-examining 3 contributors: Genuine builder activity vs overnight monolithic dumps and ghost co-authors.
            </p>
          </div>

          <Link
            href="/evidence/demo-smart-campus"
            className="font-mono text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1 shrink-0"
          >
            <span>Open DVR Timeline Evidence Wall</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Student Contributor</th>
                <th className="py-3 px-3">Integrity Score</th>
                <th className="py-3 px-3">Attribution</th>
                <th className="py-3 px-3">Tier 3 (Algorithmic)</th>
                <th className="py-3 px-3">Commit Churn</th>
                <th className="py-3 px-3">Detected Red Flags</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Row 1: Rohit Sharma (Verified Builder) */}
              <tr className="hover:bg-zinc-800/40 transition">
                <td className="py-3.5 px-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-zinc-100 text-sm">Rohit Sharma</div>
                      <div className="text-[10px] text-zinc-500">rohit.sharma@university.edu • 42 commits</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    94/100 • VERIFIED BUILDER
                  </span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-zinc-200">
                  74.2% <span className="text-zinc-500 font-normal">of project</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="text-emerald-400 font-bold">6,200 lines</span>
                  <div className="text-[10px] text-zinc-500">engine/, auth/, crypto/</div>
                </td>
                <td className="py-3.5 px-3 text-zinc-300">
                  14.2% <span className="text-emerald-400 text-[10px]">(Healthy iterative churn)</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>0 Anomalies</span>
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTranscript(SAMPLE_TRANSCRIPTS["Rohit Sharma"])}
                    className="inline-flex items-center space-x-1 rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-1 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300 transition"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Transcript</span>
                  </button>
                  <Link
                    href="/viva/demo-smart-campus/contrib-001"
                    className="inline-flex items-center space-x-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 font-semibold transition"
                  >
                    <span>Viva ➔</span>
                  </Link>
                </td>
              </tr>

              {/* Row 2: Aryan Kumar (Probable Freeloader) */}
              <tr className="hover:bg-zinc-800/40 transition bg-rose-950/10">
                <td className="py-3.5 px-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="h-3.5 w-3.5 rounded-full bg-rose-500 shrink-0" />
                    <div>
                      <div className="font-bold text-rose-200 text-sm">Aryan Kumar</div>
                      <div className="text-[10px] text-zinc-500">aryan.k@gmail.com • 2 commits</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    24/100 • FREELOADER
                  </span>
                </td>
                <td className="py-3.5 px-3 font-semibold text-rose-300">
                  23.8% <span className="text-zinc-500 font-normal">(overnight dump)</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="text-rose-400 font-bold">0 lines</span>
                  <div className="text-[10px] text-zinc-500">Tier 0 boilerplate only</div>
                </td>
                <td className="py-3.5 px-3 text-rose-400 font-bold">
                  0.0% <span className="text-rose-400 text-[10px]">(Zero debugging commits)</span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="space-y-1">
                    <span className="inline-block rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold">
                      FLAG_BIG_BANG (3:42 AM)
                    </span>
                    <span className="inline-block rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold">
                      FLAG_ZERO_CHURN (0.0%)
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTranscript(SAMPLE_TRANSCRIPTS["Aryan Kumar"])}
                    className="inline-flex items-center space-x-1 rounded-lg border border-rose-500/30 bg-rose-950/40 px-2.5 py-1 text-rose-200 hover:bg-rose-900/40 transition"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Transcript</span>
                  </button>
                  <Link
                    href="/viva/demo-smart-campus/contrib-002"
                    className="inline-flex items-center space-x-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 font-semibold transition"
                  >
                    <span>Oversee Viva ➔</span>
                  </Link>
                </td>
              </tr>

              {/* Row 3: Priya Patel (Ghost Contributor) */}
              <tr className="hover:bg-zinc-800/40 transition bg-amber-950/10">
                <td className="py-3.5 px-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="h-3.5 w-3.5 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-amber-200 text-sm">Priya Patel</div>
                      <div className="text-[10px] text-zinc-500">priya.patel@student.edu • 1 commit</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    35/100 • GHOST CODER
                  </span>
                </td>
                <td className="py-3.5 px-3 text-zinc-400">
                  2.0% <span className="text-zinc-500 font-normal">of project</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="text-zinc-400 font-bold">0 lines</span>
                  <div className="text-[10px] text-zinc-500">86% docs / readme</div>
                </td>
                <td className="py-3.5 px-3 text-zinc-400">
                  0.0% <span className="text-zinc-500 text-[10px]">(No source edits)</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-block rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold">
                    FLAG_GHOST_CONTRIBUTOR
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTranscript(SAMPLE_TRANSCRIPTS["Priya Patel"])}
                    className="inline-flex items-center space-x-1 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-amber-200 hover:bg-amber-900/40 transition"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Transcript</span>
                  </button>
                  <Link
                    href="/viva/demo-smart-campus/contrib-003"
                    className="inline-flex items-center space-x-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 font-semibold transition"
                  >
                    <span>Viva ➔</span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Red Flags & Anomaly Panel */}
      <div className="rounded-2xl border border-rose-500/20 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <AlertOctagon className="h-5 w-5 text-rose-400" />
            <h3 className="font-display text-base font-bold text-zinc-100">
              Forensic Red Flags Detected Across Capstone Teams
            </h3>
          </div>

          {/* Anomaly Filter Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-white/5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setAnomalyFilter("all")}
              className={`px-3 py-1 rounded-lg transition ${
                anomalyFilter === "all" ? "bg-rose-500/20 text-rose-300 font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All Flags (3)
            </button>
            <button
              type="button"
              onClick={() => setAnomalyFilter("big_bang")}
              className={`px-3 py-1 rounded-lg transition ${
                anomalyFilter === "big_bang" ? "bg-rose-500/20 text-rose-300 font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Big Bang (1)
            </button>
            <button
              type="button"
              onClick={() => setAnomalyFilter("ghost")}
              className={`px-3 py-1 rounded-lg transition ${
                anomalyFilter === "ghost" ? "bg-rose-500/20 text-rose-300 font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Ghost Coder (1)
            </button>
            <button
              type="button"
              onClick={() => setAnomalyFilter("zero_churn")}
              className={`px-3 py-1 rounded-lg transition ${
                anomalyFilter === "zero_churn" ? "bg-rose-500/20 text-rose-300 font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Zero Churn (1)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Anomaly 1 */}
          {(anomalyFilter === "all" || anomalyFilter === "big_bang") && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
              <div className="flex items-center justify-between text-rose-300 font-bold">
                <span>FLAG_BIG_BANG</span>
                <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">03:42 AM</span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Aryan Kumar deposited <strong>+4,800 lines</strong> in a single commit with 0 previous git activity. Monolithic pattern indicates external copy-paste or AI generated dump.
              </p>
              <div className="pt-2 text-[10px] text-rose-400/80">Target Repo: smart-campus-app</div>
            </div>
          )}

          {/* Anomaly 2 */}
          {(anomalyFilter === "all" || anomalyFilter === "zero_churn") && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>FLAG_ZERO_CHURN</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">0.0% Churn</span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Backend services added with zero modifications, zero bug fixes, and zero iterative refactoring. Human development organically exhibits 10–25% churn.
              </p>
              <div className="pt-2 text-[10px] text-amber-400/80">Author: Aryan Kumar</div>
            </div>
          )}

          {/* Anomaly 3 */}
          {(anomalyFilter === "all" || anomalyFilter === "ghost") && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>FLAG_GHOST_CONTRIBUTOR</span>
                <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300">2.0% Attribution</span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Priya Patel claims full-stack engineering credit on capstone, but AST parsing reveals 0% algorithmic lines authored (86% markdown documentation and CSS padding).
              </p>
              <div className="pt-2 text-[10px] text-cyan-400/80">Author: Priya Patel</div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Ingestion Command Panel: Single Audit vs Batch CSV */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-base font-bold text-zinc-100">
              Evaluator Audit Launchpad
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
              Batch Cohort CSV (Class Ingestion)
            </button>
          </div>
        </div>

        {activeTab === "single" ? (
          <>
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

            {/* Quick Test Repositories */}
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Quick Test Repositories (1-Click Evaluator Ingestion)</span>
                </span>
                <span className="text-[10px] text-zinc-500">Auto-populates and runs pipeline</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => triggerQuickAudit("https://github.com/ROhitg-upta/Pramaan-AI")}
                  className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-left hover:border-emerald-500/60 hover:bg-emerald-950/40 transition group"
                >
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span>✨</span>
                      <span className="font-bold text-emerald-200 group-hover:text-emerald-100">ROhitg-upta/Pramaan-AI</span>
                    </div>
                    <div className="text-[10px] text-emerald-400/80 truncate mt-0.5">Real Repo • Live Ingestion</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 shrink-0 font-bold ml-1">➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerQuickAudit("https://github.com/demo/smart-campus-app")}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/80 p-2.5 text-left hover:border-cyan-500/40 hover:bg-zinc-900 transition group"
                >
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span>🏫</span>
                      <span className="font-bold text-zinc-200 group-hover:text-cyan-300">Smart Campus App</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">3 Authors • Capstone Sample</div>
                  </div>
                  <span className="text-[10px] text-cyan-400 shrink-0 font-bold ml-1">➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerQuickAudit("https://github.com/demo/monolithic-ai-dump")}
                  className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/20 p-2.5 text-left hover:border-rose-500/60 hover:bg-rose-950/40 transition group"
                >
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <span>🚨</span>
                      <span className="font-bold text-rose-300 group-hover:text-rose-200">Monolithic AI Dump</span>
                    </div>
                    <div className="text-[10px] text-rose-400/70 truncate mt-0.5">Fraud Sample (3:42 AM)</div>
                  </div>
                  <span className="text-[10px] text-rose-400 shrink-0 font-bold ml-1">➔</span>
                </button>
              </div>
            </div>
          </>
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
                Pydriller will queue 3 repositories across 6 worker threads on Render.
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

      {/* 5. Student Viva Transcript Modal */}
      {selectedTranscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl space-y-4 font-mono text-xs">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-zinc-100">{selectedTranscript.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedTranscript.score >= 75
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {selectedTranscript.score}/100 • {selectedTranscript.verdict}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{selectedTranscript.role}</div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTranscript(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Question Asked */}
            <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">AI Oral Viva Question:</span>
              <p className="text-zinc-200 leading-relaxed">{selectedTranscript.question}</p>
            </div>

            {/* Student's Transcribed Defense */}
            <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/90 border border-white/5">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-cyan-400">
                <Mic className="h-3 w-3" />
                <span>Student Voice / Text Transcript:</span>
              </div>
              <p className="text-zinc-100 leading-relaxed italic">&ldquo;{selectedTranscript.transcript}&rdquo;</p>
            </div>

            {/* AI Evaluator Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                  Builder Signals Detected ({selectedTranscript.builderSignals.length})
                </span>
                {selectedTranscript.builderSignals.length > 0 ? (
                  <ul className="space-y-1 text-emerald-300/90 text-[11px]">
                    {selectedTranscript.builderSignals.map((s, idx) => (
                      <li key={idx}>✓ {s}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-zinc-500 text-[11px]">No concrete builder signals detected.</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
                <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">
                  Fluff / Freeloader Flags ({selectedTranscript.fluffSignals.length})
                </span>
                {selectedTranscript.fluffSignals.length > 0 ? (
                  <ul className="space-y-1 text-rose-300/90 text-[11px]">
                    {selectedTranscript.fluffSignals.map((f, idx) => (
                      <li key={idx}>⚠ {f}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-zinc-500 text-[11px]">No evasion signals detected.</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <span className="text-[11px] text-zinc-500">Evaluated autonomously via Pramaan AI Forensic Engine</span>
              <button
                type="button"
                onClick={() => setSelectedTranscript(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
