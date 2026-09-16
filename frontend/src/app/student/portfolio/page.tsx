"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  GitBranch,
  Layers,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";

export default function StudentPortfolioPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const badgeMarkdown = `[![Hoollow Proof of Work](https://pramaan.ai/api/badge/${user?.githubUsername || "rohit-sharma"})](https://pramaan.ai/u/${user?.githubUsername || "rohit-sharma"})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(badgeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/student/dashboard" className="hover:text-zinc-300">
              Student Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Verified Builder Portfolio</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            {user?.fullName || "Rohit Sharma"} • Proof-of-Work Portfolio
          </h1>
          <p className="mt-1 font-mono text-xs text-emerald-400">
            &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo;
          </p>
        </div>

        <Link
          href={`/u/${user?.githubUsername || "rohit-sharma"}`}
          className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-300 hover:text-white transition"
        >
          <span>View Public Profile ↗</span>
        </Link>
      </div>

      {/* 1. Verifiable GitHub README Badge Embedder */}
      <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Award className="h-5 w-5 text-emerald-400" />
            <h3 className="font-display text-base font-bold text-zinc-100">
              Verifiable GitHub README Badge
            </h3>
          </div>
          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
            Cryptographically Anchored
          </span>
        </div>

        <p className="font-mono text-xs text-zinc-400">
          Embed your live Hoollow Proof-of-Work badge directly into your repository READMEs to prove genuine authorship to recruiters and evaluators:
        </p>

        {/* Live Badge Preview */}
        <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-zinc-500">Live Preview:</span>
            <div className="inline-flex items-center rounded-md border border-emerald-500/40 bg-zinc-900 px-3 py-1.5 font-mono text-xs shadow-md">
              <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold text-zinc-400 mr-2">
                HOOLLOW
              </span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <span>✓ Verified Builder</span>
                <span className="text-zinc-500">|</span>
                <span>Score: 94/100</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 font-mono text-xs font-semibold shadow transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied Markdown!" : "Copy Markdown Snippet"}</span>
          </button>
        </div>

        {/* Markdown Snippet Display */}
        <div className="rounded-xl bg-zinc-950 p-3 font-mono text-xs text-zinc-400 overflow-x-auto border border-white/5 select-all">
          {badgeMarkdown}
        </div>
      </div>

      {/* 2. Verified Project Credentials */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-6">
        <h3 className="font-display text-base font-bold text-zinc-100 border-b border-white/5 pb-3">
          Verified Repository Endorsements
        </h3>

        <div className="rounded-xl border border-white/5 bg-zinc-950/70 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <GitBranch className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-base font-bold text-zinc-100">smart-campus-app</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                Pramaan Score: 94/100 (A)
              </span>
            </div>

            <span className="font-mono text-xs text-zinc-500">
              Evaluated by: Prof. Alok Sharma • Certificate #CERT-8FA2
            </span>
          </div>

          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            Sole functional architect of backend JWT authentication, Redis token rotation, and distributed database models. Authored 53.3% Tier-3 core algorithmic logic with a healthy 38.2% iterative churn ratio across 14-day sprint.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
            <div className="rounded-lg bg-zinc-900 p-3 border border-white/5">
              <div className="text-zinc-500 text-[10px]">Net Lines</div>
              <div className="font-bold text-zinc-200 mt-1">+13,547 / -4,280</div>
            </div>
            <div className="rounded-lg bg-zinc-900 p-3 border border-white/5">
              <div className="text-zinc-500 text-[10px]">Iterative Churn</div>
              <div className="font-bold text-emerald-400 mt-1">38.2% (Healthy)</div>
            </div>
            <div className="rounded-lg bg-zinc-900 p-3 border border-white/5">
              <div className="text-zinc-500 text-[10px]">Viva Defense</div>
              <div className="font-bold text-emerald-400 mt-1">98/100 (Flawless)</div>
            </div>
            <div className="rounded-lg bg-zinc-900 p-3 border border-white/5">
              <div className="text-zinc-500 text-[10px]">AST Core Logic</div>
              <div className="font-bold text-emerald-400 mt-1">Tier 3 (53.3%)</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/verdict/demo-smart-campus"
              className="inline-flex items-center space-x-1 font-mono text-xs text-emerald-400 hover:underline"
            >
              <span>View Cryptographic Thermal Proof Receipt ➔</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
