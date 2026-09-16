"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Download,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  FileCheck,
  Sparkles,
  BarChart3,
  Award,
  Layers,
  Flame,
  UserCheck,
  UserX,
  X,
  RotateCcw,
  Check,
} from "lucide-react";

interface TeamMember {
  name: string;
  github: string;
  percentage: number;
  linesAdded: number;
  linesDeleted: number;
  commitCount: number;
  churnRate: number;
  tier3LogicShare: number;
  integrityScore: number;
  status: "VERIFIED" | "FREELOADER_SUSPECT" | "GHOST";
  colorClass: string;
  textColorClass: string;
  bgFillClass: string;
}

interface CohortTeam {
  id: string;
  teamName: string;
  repoUrl: string;
  repoName: string;
  branch: string;
  giniIndex: number; // 0 (perfect equality) to 1 (monopolized)
  status: "BALANCED" | "HIGH_ASYMMETRY" | "MONOLITHIC_DUMP";
  endorsed: boolean;
  retestRequired: boolean;
  members: TeamMember[];
}

const INITIAL_TEAMS: CohortTeam[] = [
  {
    id: "team-smartcampus",
    teamName: "Team SmartCampus",
    repoUrl: "https://github.com/demo/smart-campus-app",
    repoName: "demo/smart-campus-app",
    branch: "main",
    giniIndex: 0.76,
    status: "HIGH_ASYMMETRY",
    endorsed: false,
    retestRequired: true,
    members: [
      {
        name: "Rohit Sharma",
        github: "rohit-sharma",
        percentage: 78,
        linesAdded: 8420,
        linesDeleted: 2190,
        commitCount: 42,
        churnRate: 34.2,
        tier3LogicShare: 89.4,
        integrityScore: 94,
        status: "VERIFIED",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-400",
        bgFillClass: "bg-emerald-500/10 border-emerald-500/30",
      },
      {
        name: "Priya Patel",
        github: "priya-p",
        percentage: 14,
        linesAdded: 1120,
        linesDeleted: 140,
        commitCount: 9,
        churnRate: 11.2,
        tier3LogicShare: 9.2,
        integrityScore: 58,
        status: "GHOST",
        colorClass: "bg-indigo-500",
        textColorClass: "text-indigo-400",
        bgFillClass: "bg-indigo-500/10 border-indigo-500/30",
      },
      {
        name: "Aryan Kumar",
        github: "aryan-k",
        percentage: 8,
        linesAdded: 4821,
        linesDeleted: 0,
        commitCount: 1,
        churnRate: 0.0,
        tier3LogicShare: 1.4,
        integrityScore: 24,
        status: "FREELOADER_SUSPECT",
        colorClass: "bg-rose-500",
        textColorClass: "text-rose-400",
        bgFillClass: "bg-rose-500/10 border-rose-500/30",
      },
    ],
  },
  {
    id: "aeronav-systems",
    teamName: "AeroNav Systems",
    repoUrl: "https://github.com/mit-robotics/drone-nav",
    repoName: "mit-robotics/drone-nav",
    branch: "main",
    giniIndex: 0.18,
    status: "BALANCED",
    endorsed: true,
    retestRequired: false,
    members: [
      {
        name: "Ananya Roy",
        github: "ananya-r",
        percentage: 54,
        linesAdded: 5240,
        linesDeleted: 1840,
        commitCount: 38,
        churnRate: 32.5,
        tier3LogicShare: 52.0,
        integrityScore: 96,
        status: "VERIFIED",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-400",
        bgFillClass: "bg-emerald-500/10 border-emerald-500/30",
      },
      {
        name: "Vikram Singh",
        github: "vikram-s",
        percentage: 46,
        linesAdded: 4890,
        linesDeleted: 1610,
        commitCount: 34,
        churnRate: 29.8,
        tier3LogicShare: 48.0,
        integrityScore: 95,
        status: "VERIFIED",
        colorClass: "bg-cyan-500",
        textColorClass: "text-cyan-400",
        bgFillClass: "bg-cyan-500/10 border-cyan-500/30",
      },
    ],
  },
  {
    id: "defi-protocol-team",
    teamName: "DeFi Pool Protocol",
    repoUrl: "https://github.com/hackmit/defi-pool",
    repoName: "hackmit/defi-pool",
    branch: "master",
    giniIndex: 0.82,
    status: "MONOLITHIC_DUMP",
    endorsed: false,
    retestRequired: true,
    members: [
      {
        name: "Sameer Joshi",
        github: "sameer-j",
        percentage: 84,
        linesAdded: 9810,
        linesDeleted: 3400,
        commitCount: 51,
        churnRate: 38.6,
        tier3LogicShare: 91.0,
        integrityScore: 92,
        status: "VERIFIED",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-400",
        bgFillClass: "bg-emerald-500/10 border-emerald-500/30",
      },
      {
        name: "Devika Rao",
        github: "devika-r",
        percentage: 16,
        linesAdded: 680,
        linesDeleted: 20,
        commitCount: 3,
        churnRate: 2.1,
        tier3LogicShare: 9.0,
        integrityScore: 38,
        status: "FREELOADER_SUSPECT",
        colorClass: "bg-rose-500",
        textColorClass: "text-rose-400",
        bgFillClass: "bg-rose-500/10 border-rose-500/30",
      },
    ],
  },
  {
    id: "medclassifier-ai",
    teamName: "MedClassifier AI",
    repoUrl: "https://github.com/stanford-ai/med-classifier",
    repoName: "stanford-ai/med-classifier",
    branch: "main",
    giniIndex: 0.22,
    status: "BALANCED",
    endorsed: true,
    retestRequired: false,
    members: [
      {
        name: "Kavita Nair",
        github: "kavita-n",
        percentage: 52,
        linesAdded: 6100,
        linesDeleted: 2150,
        commitCount: 41,
        churnRate: 31.0,
        tier3LogicShare: 55.2,
        integrityScore: 93,
        status: "VERIFIED",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-400",
        bgFillClass: "bg-emerald-500/10 border-emerald-500/30",
      },
      {
        name: "Rahul Verma",
        github: "rahul-v",
        percentage: 48,
        linesAdded: 5820,
        linesDeleted: 1980,
        commitCount: 39,
        churnRate: 28.7,
        tier3LogicShare: 44.8,
        integrityScore: 91,
        status: "VERIFIED",
        colorClass: "bg-cyan-500",
        textColorClass: "text-cyan-400",
        bgFillClass: "bg-cyan-500/10 border-cyan-500/30",
      },
    ],
  },
  {
    id: "rag-summarizer-hub",
    teamName: "RAG Summarizer Hub",
    repoUrl: "https://github.com/student-group-8/rag-summary",
    repoName: "student-group-8/rag-summary",
    branch: "main",
    giniIndex: 0.79,
    status: "HIGH_ASYMMETRY",
    endorsed: false,
    retestRequired: true,
    members: [
      {
        name: "Arjun Das",
        github: "arjun-d",
        percentage: 82,
        linesAdded: 7600,
        linesDeleted: 2310,
        commitCount: 46,
        churnRate: 33.4,
        tier3LogicShare: 88.0,
        integrityScore: 90,
        status: "VERIFIED",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-400",
        bgFillClass: "bg-emerald-500/10 border-emerald-500/30",
      },
      {
        name: "Meera Sen",
        github: "meera-s",
        percentage: 18,
        linesAdded: 920,
        linesDeleted: 30,
        commitCount: 4,
        churnRate: 3.2,
        tier3LogicShare: 12.0,
        integrityScore: 42,
        status: "FREELOADER_SUSPECT",
        colorClass: "bg-rose-500",
        textColorClass: "text-rose-400",
        bgFillClass: "bg-rose-500/10 border-rose-500/30",
      },
    ],
  },
  {
    id: "hyperledger-audit-vault",
    teamName: "HyperLedger Audit Vault",
    repoUrl: "https://github.com/crypto-collab/hyper-vault",
    repoName: "crypto-collab/hyper-vault",
    branch: "main",
    giniIndex: 0.28,
    status: "BALANCED",
    endorsed: true,
    retestRequired: false,
    members: [
      {
        name: "Rohan Kulkarni",
        github: "rohan-k",
        percentage: 42,
        linesAdded: 4100,
        linesDeleted: 1400,
        commitCount: 29,
        churnRate: 31.4,
        tier3LogicShare: 40.0,
        integrityScore: 89,
        status: "VERIFIED",
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-400",
        bgFillClass: "bg-emerald-500/10 border-emerald-500/30",
      },
      {
        name: "Siddharth Sen",
        github: "siddharth-s",
        percentage: 38,
        linesAdded: 3800,
        linesDeleted: 1290,
        commitCount: 27,
        churnRate: 29.5,
        tier3LogicShare: 37.0,
        integrityScore: 88,
        status: "VERIFIED",
        colorClass: "bg-cyan-500",
        textColorClass: "text-cyan-400",
        bgFillClass: "bg-cyan-500/10 border-cyan-500/30",
      },
      {
        name: "Neha Gupta",
        github: "neha-g",
        percentage: 20,
        linesAdded: 2100,
        linesDeleted: 820,
        commitCount: 16,
        churnRate: 24.2,
        tier3LogicShare: 23.0,
        integrityScore: 82,
        status: "VERIFIED",
        colorClass: "bg-indigo-500",
        textColorClass: "text-indigo-400",
        bgFillClass: "bg-indigo-500/10 border-indigo-500/30",
      },
    ],
  },
];

export default function CohortDetailPage() {
  const params = useParams();
  const cohortId = (params?.id as string) || "cs401-capstone";

  const [teams, setTeams] = useState<CohortTeam[]>(INITIAL_TEAMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "ASYMMETRIC" | "BALANCED" | "FLAGGED">("ALL");
  const [selectedActionTeam, setSelectedActionTeam] = useState<CohortTeam | null>(null);
  const [actionType, setActionType] = useState<"ENDORSE" | "RETEST" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEndorseTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, endorsed: true, retestRequired: false } : t))
    );
    showToast("✓ Team verified & formal academic endorsement generated.");
    setActionType(null);
    setSelectedActionTeam(null);
  };

  const handleFlagRetest = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, retestRequired: true, endorsed: false } : t))
    );
    showToast("⚠️ Team flagged for mandatory Hot Seat Viva Defense.");
    setActionType(null);
    setSelectedActionTeam(null);
  };

  const handleBatchEndorsePassing = () => {
    setTeams((prev) =>
      prev.map((t) => (t.status === "BALANCED" ? { ...t, endorsed: true, retestRequired: false } : t))
    );
    showToast("✓ Batch endorsed all balanced collaborative teams.");
  };

  const handleExportCsv = () => {
    const headers = "Team Name,Repository,Gini Inequality,Authorship Status,Primary Builder,Freeloader Flags\n";
    const rows = teams
      .map((t) => {
        const primary = t.members.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev));
        const suspects = t.members.filter((m) => m.status !== "VERIFIED").map((m) => m.name).join("; ");
        return `"${t.teamName}","${t.repoUrl}",${t.giniIndex},"${t.status}","${primary.name} (${primary.percentage}%)","${suspects || "None"}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Pramaan_Cohort_Balance_${cohortId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch =
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members.some(
          (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.github.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (filterMode === "ASYMMETRIC") {
        return team.status === "HIGH_ASYMMETRY" || team.giniIndex >= 0.65;
      }
      if (filterMode === "BALANCED") {
        return team.status === "BALANCED";
      }
      if (filterMode === "FLAGGED") {
        return team.status === "MONOLITHIC_DUMP" || team.retestRequired;
      }
      return true;
    });
  }, [teams, searchQuery, filterMode]);

  // Cohort Stats
  const totalTeams = teams.length;
  const asymmetricTeams = teams.filter((t) => t.status === "HIGH_ASYMMETRY" || t.status === "MONOLITHIC_DUMP").length;
  const avgGini = (teams.reduce((acc, t) => acc + t.giniIndex, 0) / totalTeams).toFixed(2);
  const totalStudents = teams.reduce((acc, t) => acc + t.members.length, 0);
  const verifiedBuilders = teams.reduce(
    (acc, t) => acc + t.members.filter((m) => m.status === "VERIFIED").length,
    0
  );

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-500/30 bg-zinc-950 px-4 py-3 text-xs font-mono text-emerald-400 shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Breadcrumbs & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300 transition">
              Evaluator Dashboard
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/evaluator/cohorts" className="hover:text-zinc-300 transition">
              Cohorts
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-200 font-semibold">{cohortId.toUpperCase()}</span>
          </div>

          <div className="flex items-center space-x-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              CS401 Senior Capstone • Freeloader Heatmap
            </h1>
            <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-950/30 px-2.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
              Live Churn Mining
            </span>
          </div>

          <p className="mt-1 font-mono text-xs text-zinc-400">
            Real-time segmented git contribution distribution, commit entropy imbalance detection, and 1-click Endorse / Retest workflows.
          </p>
        </div>

        {/* Global Cohort Actions */}
        <div className="flex items-center space-x-2.5 font-mono text-xs">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Balance CSV</span>
          </button>

          <button
            type="button"
            onClick={handleBatchEndorsePassing}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2 text-zinc-950 font-medium hover:bg-zinc-200 transition shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-950" />
            <span>Batch Endorse Passing</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
            <span>Teams Audited</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-zinc-100">{totalTeams}</div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            {totalStudents} Enrolled Engineering Students
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
            <span>Severe Asymmetry Rate</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-rose-400">
            {((asymmetricTeams / totalTeams) * 100).toFixed(0)}%
          </div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            {asymmetricTeams} of {totalTeams} teams have &gt;75% single author bias
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
            <span>Mean Gini Imbalance</span>
            <BarChart3 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-amber-400">{avgGini}</div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            Scale: 0.00 (Balanced) to 1.00 (Total Monopoly)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs">
            <span>Proof of Work Standard</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-emerald-400">
            {((verifiedBuilders / totalStudents) * 100).toFixed(0)}%
          </div>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            {verifiedBuilders} of {totalStudents} verified organic builders
          </p>
        </div>
      </div>

      {/* 3. Search & Quick Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams, repositories, or student GitHub handles..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-4 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1.5 rounded-xl border transition ${
              filterMode === "ALL"
                ? "border-zinc-700 bg-zinc-800 text-zinc-100 font-semibold"
                : "border-zinc-800/80 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All Teams ({teams.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("ASYMMETRIC")}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1.5 ${
              filterMode === "ASYMMETRIC"
                ? "border-rose-500/40 bg-rose-950/30 text-rose-300 font-semibold"
                : "border-zinc-800/80 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <AlertOctagon className="h-3 w-3 text-rose-400" />
            <span>Severe Asymmetry (Freeloaders)</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("BALANCED")}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center space-x-1.5 ${
              filterMode === "BALANCED"
                ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-semibold"
                : "border-zinc-800/80 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Balanced</span>
          </button>
        </div>
      </div>

      {/* 4. Cohort Team Cards & Segmented Balance Heatmap */}
      <div className="space-y-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm space-y-6 transition hover:border-zinc-700"
          >
            {/* Team Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-display text-lg font-bold text-zinc-100">{team.teamName}</h3>

                  {/* Status Badges */}
                  {team.status === "BALANCED" && (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Balanced Collaboration</span>
                    </span>
                  )}

                  {team.status === "HIGH_ASYMMETRY" && (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-rose-500/20 bg-rose-950/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-rose-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>High Asymmetry • Freeloader Risk</span>
                    </span>
                  )}

                  {team.status === "MONOLITHIC_DUMP" && (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/20 bg-amber-950/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                      <AlertOctagon className="h-3 w-3" />
                      <span>Monolithic Dump Flagged</span>
                    </span>
                  )}

                  {team.endorsed && (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-400">
                      <FileCheck className="h-3 w-3" />
                      <span>Endorsed by Professor</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 font-mono text-xs text-zinc-400">
                  <a
                    href={team.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 hover:text-zinc-200 transition underline underline-offset-4"
                  >
                    <GitBranch className="h-3 w-3 text-zinc-500" />
                    <span>{team.repoName}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-zinc-600" />
                  </a>
                  <span>•</span>
                  <span>Branch: {team.branch}</span>
                  <span>•</span>
                  <span className="font-semibold text-zinc-300">
                    Gini Inequality: {team.giniIndex.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons for this Team */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                <Link
                  href="/evidence/demo-smart-campus"
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition"
                >
                  Inspect DVR Timeline ➔
                </Link>

                <Link
                  href="/evaluator/audit/demo-smart-campus/certificate"
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition"
                >
                  View Credential PDF
                </Link>

                {!team.endorsed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedActionTeam(team);
                      setActionType("ENDORSE");
                    }}
                    className="rounded-xl bg-white px-3 py-1.5 text-zinc-950 font-medium hover:bg-zinc-200 transition shadow-sm"
                  >
                    Endorse Team
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedActionTeam(team);
                      setActionType("RETEST");
                    }}
                    className="rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 px-3 py-1.5 font-medium transition"
                  >
                    Flag Retest
                  </button>
                )}
              </div>
            </div>

            {/* SEGMENTED HORIZONTAL CONTRIBUTION BALANCE BAR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-400">Team Codebase Authorship Distribution</span>
                <span className="text-zinc-500 text-[11px]">Total Commits: {team.members.reduce((a, b) => a + b.commitCount, 0)}</span>
              </div>

              {/* The Multi-Colored Horizontal Segmented Bar */}
              <div className="h-4 w-full rounded-full overflow-hidden bg-zinc-950 flex border border-zinc-800">
                {team.members.map((member, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${member.percentage}%` }}
                    className={`h-full ${member.colorClass} transition-all relative group cursor-pointer`}
                    title={`${member.name} (@${member.github}): ${member.percentage}%`}
                  />
                ))}
              </div>

              {/* Legend with percentages */}
              <div className="flex flex-wrap items-center gap-4 pt-1 font-mono text-xs">
                {team.members.map((member, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${member.colorClass}`} />
                    <span className="text-zinc-200 font-medium">{member.name}</span>
                    <span className={`${member.textColorClass} font-bold`}>{member.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTRIBUTOR ROSTER BREAKDOWN TABLE */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Contributor</th>
                    <th className="py-2.5 px-4 text-center">Share</th>
                    <th className="py-2.5 px-4">Commits / Churn</th>
                    <th className="py-2.5 px-4">Tier-3 Logic Share</th>
                    <th className="py-2.5 px-4 text-center">Score</th>
                    <th className="py-2.5 px-4">Proof of Work Verdict</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {team.members.map((member, mIdx) => (
                    <tr key={mIdx} className="hover:bg-zinc-900/30 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-zinc-100 ${member.colorClass}`}>
                            {member.name.slice(0, 1)}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-200">{member.name}</div>
                            <div className="text-[11px] text-zinc-500">@{member.github}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${member.textColorClass}`}>{member.percentage}%</span>
                      </td>

                      <td className="py-3 px-4 text-zinc-400">
                        <div>{member.commitCount} commits ({member.churnRate}% churn)</div>
                        <div className="text-[10px] text-zinc-500">
                          +{member.linesAdded.toLocaleString()} / -{member.linesDeleted.toLocaleString()} lines
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-1.5 w-16 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              style={{ width: `${member.tier3LogicShare}%` }}
                              className={`h-full ${member.colorClass}`}
                            />
                          </div>
                          <span className="text-zinc-300 font-medium">{member.tier3LogicShare}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-bold ${
                            member.integrityScore >= 75
                              ? "text-emerald-400"
                              : member.integrityScore >= 50
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {member.integrityScore}/100
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {member.status === "VERIFIED" && (
                          <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            <Check className="h-3 w-3" />
                            <span>✓ Hoollow Verified Builder</span>
                          </span>
                        )}
                        {member.status === "FREELOADER_SUSPECT" && (
                          <span className="inline-flex items-center space-x-1 rounded-full border border-rose-500/20 bg-rose-950/20 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                            <X className="h-3 w-3" />
                            <span>✕ Fails Proof-of-Work Standard</span>
                          </span>
                        )}
                        {member.status === "GHOST" && (
                          <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/20 bg-amber-950/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span>⚠️ Ghost Contributor</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href="/student/viva/ROOM-4A82"
                            className="rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 hover:text-zinc-100 transition"
                          >
                            Hot Seat Viva
                          </Link>
                          <Link
                            href={`/u/${member.github}`}
                            className="rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 hover:text-zinc-100 transition"
                          >
                            Profile
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Endorse / Retest Confirmation Modal */}
      {selectedActionTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                {actionType === "ENDORSE" ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertOctagon className="h-5 w-5 text-rose-400" />
                )}
                <h3 className="font-display text-base font-bold text-zinc-100">
                  {actionType === "ENDORSE"
                    ? `Endorse Authorship: ${selectedActionTeam.teamName}`
                    : `Flag for Mandatory Oral Retest: ${selectedActionTeam.teamName}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedActionTeam(null);
                  setActionType(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionType === "ENDORSE" ? (
              <div className="space-y-3 text-zinc-300">
                <p>
                  You are officially endorsing the code authorship distribution for{" "}
                  <strong className="text-zinc-100">{selectedActionTeam.teamName}</strong>.
                </p>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-[11px] text-emerald-300">
                  ✓ Academic Certificate of Authorship will be locked with SHA-256 integrity hash and published to each verified student profile.
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-zinc-300">
                <p>
                  Flagging <strong className="text-zinc-100">{selectedActionTeam.teamName}</strong> will schedule a mandatory Hot Seat Viva defense for suspect contributors (
                  {selectedActionTeam.members
                    .filter((m) => m.status !== "VERIFIED")
                    .map((m) => m.name)
                    .join(", ")}
                  ).
                </p>
                <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-[11px] text-rose-300">
                  ⚠️ Suspect students will receive calendar invitations to defend specific commits under the real-time AI viva terminal.
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedActionTeam(null);
                  setActionType(null);
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-400 hover:text-zinc-200 transition"
              >
                Cancel
              </button>

              {actionType === "ENDORSE" ? (
                <button
                  type="button"
                  onClick={() => handleEndorseTeam(selectedActionTeam.id)}
                  className="rounded-xl bg-white px-4 py-2 text-zinc-950 font-medium hover:bg-zinc-200 transition"
                >
                  Confirm Official Endorsement
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleFlagRetest(selectedActionTeam.id)}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-white font-medium hover:bg-rose-500 transition"
                >
                  Confirm Retest Notice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
