"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  AlertOctagon,
  Calendar,
  Building,
  UploadCloud,
} from "lucide-react";

interface CohortCardData {
  id: string;
  name: string;
  term: string;
  organization: string;
  studentCount: number;
  repoCount: number;
  verifiedCount: number;
  flaggedCount: number;
  avgScore: number;
}

const INITIAL_COHORTS: CohortCardData[] = [
  {
    id: "cohort-cs401",
    name: "CS401 Senior Software Engineering Capstone",
    term: "Spring 2026",
    organization: "Dept. of Computer Science",
    studentCount: 84,
    repoCount: 28,
    verifiedCount: 23,
    flaggedCount: 5,
    avgScore: 78.4,
  },
  {
    id: "cohort-hackmit",
    name: "HackMIT 2026 — Systems & AI Finalists",
    term: "October 2026",
    organization: "MIT Hackathon Committee",
    studentCount: 42,
    repoCount: 14,
    verifiedCount: 11,
    flaggedCount: 3,
    avgScore: 71.2,
  },
];

export default function EvaluatorCohortsPage() {
  const [cohorts, setCohorts] = useState<CohortCardData[]>(INITIAL_COHORTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCohortName, setNewCohortName] = useState("");
  const [newCohortTerm, setNewCohortTerm] = useState("Fall 2026");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohortName.trim()) return;

    const created: CohortCardData = {
      id: `cohort-${Date.now()}`,
      name: newCohortName.trim(),
      term: newCohortTerm,
      organization: "Computer Science Dept.",
      studentCount: 0,
      repoCount: 0,
      verifiedCount: 0,
      flaggedCount: 0,
      avgScore: 0,
    };

    setCohorts([created, ...cohorts]);
    setNewCohortName("");
    setShowCreateModal(false);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Cohort Management</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Institutional Cohorts &amp; Classes
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Group repositories by university courses, hackathon tracks, or enterprise hiring cohorts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 font-mono text-xs font-semibold shadow-md transition"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Cohort</span>
        </button>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between hover:border-white/20 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                    {cohort.term}
                  </span>
                  <h3 className="font-display text-lg font-bold text-zinc-100 mt-2">
                    {cohort.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 font-mono text-xs text-zinc-500 mt-1">
                    <Building className="h-3.5 w-3.5" />
                    <span>{cohort.organization}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs text-zinc-500">Class Average</div>
                  <div className="font-mono text-2xl font-bold text-zinc-100">
                    {cohort.avgScore > 0 ? `${cohort.avgScore}%` : "Pending"}
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 my-4 font-mono text-xs">
                <div className="rounded-xl border border-white/5 bg-zinc-950 p-3">
                  <div className="text-zinc-500 text-[10px] uppercase">Repos Audited</div>
                  <div className="text-lg font-bold text-zinc-200 mt-1">
                    {cohort.repoCount} Repos
                  </div>
                  <div className="text-[10px] text-zinc-500">{cohort.studentCount} Students</div>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                  <div className="text-emerald-400 text-[10px] uppercase">Verified Builders</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {cohort.verifiedCount}
                  </div>
                  <div className="text-[10px] text-emerald-500/80">Proof Validated</div>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
                  <div className="text-rose-400 text-[10px] uppercase">Fraud Flagged</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">
                    {cohort.flaggedCount}
                  </div>
                  <div className="text-[10px] text-rose-400/80">Big Bang / Fluff</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <Link
                href="/evaluator/audits"
                className="font-mono text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1"
              >
                <span>View Cohort Audit List</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/evaluator/dashboard"
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:bg-zinc-800 transition"
              >
                Batch Upload CSV ➔
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Cohort */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display text-lg font-bold text-zinc-100 mb-2">
              Create New Cohort
            </h3>
            <p className="font-mono text-xs text-zinc-400 mb-4">
              Set up a group container for automated batch repository auditing.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Cohort Name</label>
                <input
                  type="text"
                  placeholder="e.g. CS401 Senior Projects Fall 2026"
                  value={newCohortName}
                  onChange={(e) => setNewCohortName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Academic Term / Hackathon Date</label>
                <input
                  type="text"
                  placeholder="e.g. Fall 2026"
                  value={newCohortTerm}
                  onChange={(e) => setNewCohortTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 font-semibold shadow"
                >
                  Create Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
