"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Filter,
  Search,
  Check,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

interface BatchItem {
  teamName: string;
  repoUrl: string;
  members: string;
  githubs: string;
  status: "QUEUEING" | "CLONING" | "MINING" | "AST_ANALYSIS" | "DONE";
  progress: number;
  score?: number;
  fraudType?: "NONE" | "BIG_BANG" | "ZERO_CHURN";
}

const INITIAL_BATCH: BatchItem[] = [
  {
    teamName: "Team SmartCampus",
    repoUrl: "https://github.com/demo/smart-campus-app",
    members: "Rohit Sharma, Aryan Kumar, Priya Patel",
    githubs: "@rohit-sharma, @aryan-k, @priya-p",
    status: "DONE",
    progress: 100,
    score: 51,
    fraudType: "BIG_BANG",
  },
  {
    teamName: "AeroNav Systems",
    repoUrl: "https://github.com/mit-robotics/drone-nav",
    members: "Ananya Roy, Vikram Singh",
    githubs: "@ananya-r, @vikram-s",
    status: "DONE",
    progress: 100,
    score: 96,
    fraudType: "NONE",
  },
  {
    teamName: "DeFi Protocol Team",
    repoUrl: "https://github.com/hackmit/defi-pool",
    members: "Sameer Joshi, Aryan Kumar",
    githubs: "@sameer-j, @aryan-k",
    status: "DONE",
    progress: 100,
    score: 38,
    fraudType: "ZERO_CHURN",
  },
  {
    teamName: "MedClassifier AI",
    repoUrl: "https://github.com/stanford-ai/med-classifier",
    members: "Kavita Nair, Rahul Verma",
    githubs: "@kavita-n, @rahul-v",
    status: "DONE",
    progress: 100,
    score: 91,
    fraudType: "NONE",
  },
  {
    teamName: "RAG Summarizer Hub",
    repoUrl: "https://github.com/student-group-8/rag-summary",
    members: "Priya Patel, Arjun Das",
    githubs: "@priya-p, @arjun-d",
    status: "DONE",
    progress: 100,
    score: 42,
    fraudType: "ZERO_CHURN",
  },
];

export default function EvaluatorCohortsBatchEngine() {
  const [activeTab, setActiveTab] = useState<"batch-audit" | "leaderboard">("leaderboard");
  const [batchItems, setBatchItems] = useState<BatchItem[]>(INITIAL_BATCH);
  const [isProcessing, setIsProcessing] = useState(false);
  const [freeloaderFilterOnly, setFreeloaderFilterOnly] = useState(false);

  // Team contribution matrix modal / drawer
  const [selectedTeam, setSelectedTeam] = useState<BatchItem | null>(null);

  const [csvInput, setCsvInput] = useState(
    `Team SmartCampus, https://github.com/demo/smart-campus-app, Rohit & Aryan, @rohit-sharma @aryan-k\nAeroNav Systems, https://github.com/mit-robotics/drone-nav, Ananya & Vikram, @ananya-r @vikram-s\nCloudSync Team, https://github.com/mit-cloud/sync-engine, Kevin & Dave, @kevin-c @dave-m`
  );

  const handleLaunchBatch = () => {
    setIsProcessing(true);
    // Simulate parallel multi-thread execution
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab("leaderboard");
    }, 1500);
  };

  const handleExportGradebookCsv = () => {
    const header = "Team Name,Repository,Members,GitHub Handles,Integrity Score,Fraud Status\n";
    const rows = batchItems
      .map(
        (b) =>
          `"${b.teamName}","${b.repoUrl}","${b.members}","${b.githubs}",${b.score ?? 0},"${b.fraudType || "NONE"}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CS401_Academic_Gradebook_Pramaan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = batchItems.filter((item) => {
    if (freeloaderFilterOnly) {
      return item.fraudType && item.fraudType !== "NONE";
    }
    return true;
  });

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">CS401 Senior Capstone Cohort</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Enterprise Cohort Batch Auditing &amp; Matrix
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Automated class-wide repository ingestion, fraud dispersion analysis, and gradebook export.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            type="button"
            onClick={handleExportGradebookCsv}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Gradebook CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold transition ${
            activeTab === "leaderboard"
              ? "bg-zinc-100 text-zinc-950 shadow-md"
              : "border border-white/5 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Cohort Analytics &amp; Integrity Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("batch-audit")}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTab === "batch-audit"
              ? "bg-cyan-600 text-white shadow-md"
              : "border border-white/5 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Batch CSV Roster Ingestion</span>
        </button>
      </div>

      {/* TAB 1: COHORT ANALYTICS & LEADERBOARD MATRIX */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          {/* Class Integrity Distribution Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-5">
              <span className="text-emerald-400 text-[10px] uppercase font-bold">Verified Builders</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">68.0% (34 Students)</div>
              <p className="text-zinc-400 text-[11px] mt-1">Healthy churn, atomic commits &gt; 25</p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/15 p-5">
              <span className="text-rose-400 text-[10px] uppercase font-bold">Suspect Freeloaders</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">22.0% (11 Students)</div>
              <p className="text-zinc-400 text-[11px] mt-1">Flagged for Big Bang / Zero Churn dumps</p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/15 p-5">
              <span className="text-amber-400 text-[10px] uppercase font-bold">Ghost Contributors</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">10.0% (5 Students)</div>
              <p className="text-zinc-400 text-[11px] mt-1">Documentation/styling only; 0% Tier-3 logic</p>
            </div>
          </div>

          {/* Leaderboard Table with Freeloader Filter */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 font-mono text-xs">
              <h3 className="font-display text-base font-bold text-zinc-100">
                Cohort Leaderboard &amp; Authorship Matrix
              </h3>

              {/* 1-Click Freeloader Alert Filter */}
              <button
                type="button"
                onClick={() => setFreeloaderFilterOnly(!freeloaderFilterOnly)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition ${
                  freeloaderFilterOnly
                    ? "border-rose-500 bg-rose-950/40 text-rose-300 font-bold"
                    : "border-white/10 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
                <span>Freeloader Alert Filter {freeloaderFilterOnly ? "(Active)" : "(Show Flagged)"}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-white/5 bg-zinc-950/70 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Team Name</th>
                    <th className="py-3 px-3">Repository</th>
                    <th className="py-3 px-3">Members</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3">Fraud Diagnosis</th>
                    <th className="py-3 px-3 text-right">Contribution Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/50 transition">
                      <td className="py-3.5 px-3 font-bold text-zinc-200">{item.teamName}</td>
                      <td className="py-3.5 px-3 text-cyan-400">
                        <Link href="/evidence/demo-smart-campus" className="hover:underline flex items-center space-x-1">
                          <GitBranch className="h-3 w-3" />
                          <span>{item.repoUrl.replace("https://github.com/", "")}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-3 text-zinc-400">{item.members}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`font-bold ${
                            item.score && item.score >= 75
                              ? "text-emerald-400"
                              : item.score && item.score >= 50
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {item.score}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {item.fraudType === "BIG_BANG" ? (
                          <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-400 font-bold">
                            FLAG_BIG_BANG (03:42 AM)
                          </span>
                        ) : item.fraudType === "ZERO_CHURN" ? (
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-bold">
                            ZERO_CHURN (0.0%)
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                            ✓ Verified Builder
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTeam(item)}
                          className="rounded-lg border border-white/10 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 px-2.5 py-1 text-[11px] transition"
                        >
                          Inspect Matrix ➔
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH CSV ROSTER INGESTION */}
      {activeTab === "batch-audit" && (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-6 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-display text-base font-bold text-zinc-100">
              Batch CSV Upload Zone
            </h3>
            <p className="font-mono text-xs text-zinc-400 mt-1">
              Supports standard university LMS format: <code>team_name, repo_url, member_names, member_githubs</code>
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <textarea
              rows={5}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 p-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-[11px]">
                Validating 3 team entries. All repositories match GitHub format.
              </span>

              <button
                type="button"
                onClick={handleLaunchBatch}
                disabled={isProcessing}
                className="inline-flex items-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 font-bold shadow-lg transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isProcessing ? "Processing 50 Repositories..." : "Launch Batch Forensic Audit ➔"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Team Contribution Matrix Drawer / Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-zinc-100">
                  {selectedTeam.teamName} • Team Contribution Matrix
                </h3>
                <span className="text-zinc-400 text-[11px]">{selectedTeam.repoUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Member Comparison Breakdown */}
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-400">Rohit Sharma (@rohit-sharma)</span>
                  <span className="text-emerald-300">94 / 100 (Verified Builder)</span>
                </div>
                <div className="text-zinc-300 text-[11px]">
                  Authored 92% of Tier 3 Algorithmic Core Logic across 38 commits over 14 days. Healthy 38% churn.
                </div>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-rose-400">Aryan Kumar (@aryan-k)</span>
                  <span className="text-rose-300">24 / 100 (Suspect Freeloader)</span>
                </div>
                <div className="text-zinc-300 text-[11px]">
                  Single monolithic dump of +4,821 lines at 03:42 AM with 0 deletions. Flunked oral defense.
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-amber-400">Priya Patel (@priya-p)</span>
                  <span className="text-amber-300">35 / 100 (Ghost Member)</span>
                </div>
                <div className="text-zinc-300 text-[11px]">
                  5 commits totaling 64 lines, exclusively README formatting and CSS. 0% functional code.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/5">
              <Link
                href="/evidence/demo-smart-campus"
                className="rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 font-bold transition"
              >
                Open Full Evidence Wall ➔
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
