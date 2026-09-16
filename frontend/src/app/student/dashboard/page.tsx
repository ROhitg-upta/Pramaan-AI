"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Github,
  GitBranch,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ExternalLink,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const isRohit = user?.githubUsername === "rohit-sharma";

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Student Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-0.5 text-[11px] font-mono text-emerald-400 mb-2">
            <span>✦ HOOLLOW VERIFIED BUILDER DASHBOARD</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Welcome back, {user?.fullName || "Rohit Sharma"}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Connected GitHub: <span className="text-zinc-200 font-bold">@{user?.githubUsername || "rohit-sharma"}</span> • Anti-Impersonation Active
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <Link
            href={`/u/${user?.githubUsername || "rohit-sharma"}`}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition"
          >
            <span>Public Proof Profile ↗</span>
          </Link>
          <Link
            href="/student/portfolio"
            className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 font-semibold shadow-md transition"
          >
            <span>View Proof Portfolio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Scheduled Viva Examination Callout Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Scheduled Viva Defense Ready
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-zinc-100">
              smart-campus-app • Capstone Final Evaluation
            </h3>
            <p className="font-mono text-xs text-zinc-400">
              Evaluator: Prof. Alok Sharma • Room Code: <span className="text-amber-300 font-bold">ROOM-4A82</span>
            </p>
          </div>

          <Link
            href="/student/viva/ROOM-4A82"
            className="inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 font-mono text-xs font-bold shadow-lg transition"
          >
            <span>Enter Viva Examination Room ➔</span>
          </Link>
        </div>
      </div>

      {/* 3. Verified Builder Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5">
          <div className="text-zinc-500 text-xs uppercase">Verified Lines</div>
          <div className="text-3xl font-bold text-zinc-100 mt-2">
            {isRohit ? "13,547" : "4,821"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">PyDriller Audited</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5">
          <div className="text-zinc-500 text-xs uppercase">Iterative Churn</div>
          <div className={`text-3xl font-bold mt-2 ${isRohit ? "text-emerald-400" : "text-rose-400"}`}>
            {isRohit ? "38.2%" : "0.0%"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">{isRohit ? "Healthy Debugging" : "Monolithic Dump"}</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5">
          <div className="text-zinc-500 text-xs uppercase">Core Logic (Tier 3)</div>
          <div className={`text-3xl font-bold mt-2 ${isRohit ? "text-emerald-400" : "text-zinc-400"}`}>
            {isRohit ? "53.3%" : "1.9%"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">AST Tree Complexity</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5">
          <div className="text-zinc-500 text-xs uppercase">Pramaan Trust Score</div>
          <div className={`text-3xl font-bold mt-2 ${isRohit ? "text-emerald-400" : "text-rose-400"}`}>
            {isRohit ? "94/100" : "24/100"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">{isRohit ? "✓ Verified Builder" : "✕ Suspect Freeloader"}</p>
        </div>
      </div>

      {/* 4. Student's Audited Repositories */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
        <h3 className="font-display text-base font-bold text-zinc-100 mb-4 border-b border-white/5 pb-3">
          Your Audited Repositories
        </h3>

        <div className="divide-y divide-white/5 font-mono text-xs">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-sm text-zinc-100">smart-campus-app</span>
                {isRohit ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                    ✓ Hoollow Verified Builder
                  </span>
                ) : (
                  <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400">
                    ✕ Fails Proof-of-Work Standard
                  </span>
                )}
              </div>
              <p className="text-zinc-400 mt-1">
                {isRohit
                  ? "Sole functional author of backend JWT auth, caching, and database models."
                  : "Single monolithic commit of 4,821 lines at 03:42 AM with zero iterative history."}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/evidence/demo-smart-campus"
                className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 transition"
              >
                Inspect Evidence Wall ➔
              </Link>
              <Link
                href="/student/viva/ROOM-4A82"
                className="rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white px-3 py-1.5 font-bold transition"
              >
                Join Viva ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
