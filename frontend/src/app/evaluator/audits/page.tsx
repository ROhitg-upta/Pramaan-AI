"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowLeft,
  ExternalLink,
  Download,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  GitBranch,
} from "lucide-react";

interface AuditRow {
  id: string;
  repoName: string;
  repoUrl: string;
  cohort: string;
  primaryAuthor: string;
  commitsCount: number;
  integrityGrade: string;
  score: number;
  fraudType: "NONE" | "BIG_BANG" | "ZERO_CHURN" | "GHOST_TEAM";
  status: "AUDITED" | "VIVA_PENDING" | "VERIFIED";
  vivaSessionId?: string;
}

const SAMPLE_AUDITS: AuditRow[] = [
  {
    id: "demo-smart-campus",
    repoName: "smart-campus-app",
    repoUrl: "https://github.com/demo/smart-campus-app",
    cohort: "CS401 Senior Capstone",
    primaryAuthor: "Rohit Sharma & Aryan Kumar",
    commitsCount: 45,
    integrityGrade: "C+",
    score: 51,
    fraudType: "BIG_BANG",
    status: "VIVA_PENDING",
    vivaSessionId: "session-001",
  },
  {
    id: "audit-002",
    repoName: "autonomous-drone-navigation",
    repoUrl: "https://github.com/mit-robotics/drone-nav",
    cohort: "CS401 Senior Capstone",
    primaryAuthor: "Ananya Roy",
    commitsCount: 142,
    integrityGrade: "A",
    score: 96,
    fraudType: "NONE",
    status: "VERIFIED",
  },
  {
    id: "audit-003",
    repoName: "defi-liquidity-pool-v3",
    repoUrl: "https://github.com/hackmit/defi-pool",
    cohort: "HackMIT 2026",
    primaryAuthor: "Aryan Kumar & Team",
    commitsCount: 2,
    integrityGrade: "D+",
    score: 38,
    fraudType: "ZERO_CHURN",
    status: "VIVA_PENDING",
    vivaSessionId: "session-002",
  },
  {
    id: "audit-004",
    repoName: "medtech-imaging-classifier",
    repoUrl: "https://github.com/stanford-ai/med-classifier",
    cohort: "CS401 Senior Capstone",
    primaryAuthor: "Kavita Nair",
    commitsCount: 88,
    integrityGrade: "A-",
    score: 91,
    fraudType: "NONE",
    status: "VERIFIED",
  },
  {
    id: "audit-005",
    repoName: "rag-document-summarizer",
    repoUrl: "https://github.com/student-group-8/rag-summary",
    cohort: "HackMIT 2026",
    primaryAuthor: "Priya Patel & 2 others",
    commitsCount: 12,
    integrityGrade: "C",
    score: 42,
    fraudType: "GHOST_TEAM",
    status: "VIVA_PENDING",
    vivaSessionId: "session-003",
  },
];

export default function EvaluatorAuditsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = SAMPLE_AUDITS.filter((row) => {
    const matchesSearch =
      row.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.primaryAuthor.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "FLAGGED") return row.fraudType !== "NONE";
    if (filterType === "CLEAN") return row.fraudType === "NONE";
    if (filterType === "VIVA_PENDING") return row.status === "VIVA_PENDING";

    return true;
  });

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Audits Directory</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Repository Forensic Directory
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Comprehensive audit register with AST tier classifications, commit churn, and viva triggers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => alert("Exporting forensic report CSV for 42 repositories...")}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 font-mono text-xs text-zinc-300 hover:bg-zinc-800 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV Audit Register</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search repo, student, or commit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 py-2.5 pl-9 pr-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "ALL"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Repos ({SAMPLE_AUDITS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("FLAGGED")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "FLAGGED"
                  ? "bg-rose-500/20 text-rose-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Fraud Flags Only
            </button>
            <button
              type="button"
              onClick={() => setFilterType("CLEAN")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "CLEAN"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Verified Builders
            </button>
            <button
              type="button"
              onClick={() => setFilterType("VIVA_PENDING")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "VIVA_PENDING"
                  ? "bg-amber-500/20 text-amber-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Pending Viva
            </button>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/5 bg-zinc-950/80 text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Repository</th>
                <th className="py-3 px-4">Cohort</th>
                <th className="py-3 px-4">Claimed Authors</th>
                <th className="py-3 px-4 text-center">Commits</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Forensic Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{item.repoName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{item.cohort}</td>
                  <td className="py-3.5 px-4 text-zinc-300">{item.primaryAuthor}</td>
                  <td className="py-3.5 px-4 text-center text-zinc-400">{item.commitsCount}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold ${
                        item.score >= 75
                          ? "text-emerald-400"
                          : item.score >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {item.score}/100 ({item.integrityGrade})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.fraudType === "BIG_BANG" ? (
                      <span className="inline-flex items-center space-x-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-400 font-semibold">
                        <AlertOctagon className="h-3 w-3" />
                        <span>FLAG_BIG_BANG</span>
                      </span>
                    ) : item.fraudType === "ZERO_CHURN" ? (
                      <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        <span>ZERO_CHURN</span>
                      </span>
                    ) : item.fraudType === "GHOST_TEAM" ? (
                      <span className="inline-flex items-center space-x-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-400 font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        <span>GHOST_MEMBERS</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>✓ Verified Builder</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/evidence/${item.id}`}
                        className="rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-1 text-zinc-300 hover:bg-zinc-800 transition text-[11px]"
                      >
                        Evidence Wall
                      </Link>
                      {item.vivaSessionId && (
                        <Link
                          href={`/evaluator/viva/${item.vivaSessionId}`}
                          className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 font-semibold transition text-[11px]"
                        >
                          Oversee Viva
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
