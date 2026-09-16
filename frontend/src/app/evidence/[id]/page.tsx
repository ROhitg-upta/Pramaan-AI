"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GitBranch,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getAnalysisReport } from "@/lib/api";
import { type FullReportResponse } from "@/lib/mock-data";

export default function EvidenceWallShell() {
  const params = useParams();
  const router = useRouter();
  const analysisId = (params?.id as string) || "demo-smart-campus";

  const [report, setReport] = useState<FullReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalysisReport(analysisId).then((data) => {
      setReport(data);
      setLoading(false);
    });
  }, [analysisId]);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Link
              href={`/investigate/${analysisId}`}
              className="inline-flex items-center space-x-1 font-mono text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Scanning</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
              <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
            </div>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            {report?.repo_url || "Repository Forensic Evidence Wall"}
          </h1>
          <p className="mt-1 font-mono text-xs text-emerald-400/90">
            &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo;
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://hoollow.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 font-mono text-xs text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition"
          >
            <span>Export to Hoollow Profile ↗</span>
          </a>
          <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-400">
            Integrity: {report?.integrity_grade || "C+"}
          </span>
        </div>
      </div>

      {/* Overview Contributor Grid Preview */}
      {report && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Executive Summary
            </h3>
            <p className="font-body text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-white/5">
              {report.executive_summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.contributors.map((contrib) => (
              <div
                key={contrib.id}
                className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-zinc-100 text-base">
                      {contrib.primary_name}
                    </span>
                    <span
                      className={`font-bold text-base ${
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
                  <div className="mt-1 font-mono text-[11px] text-zinc-500">
                    {contrib.emails[0]}
                  </div>

                  <div className="mt-4 space-y-2 font-mono text-xs text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-zinc-500">Total Commits:</span>
                      <span className="text-zinc-200">{contrib.total_commits}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-zinc-500">Net Lines Added:</span>
                      <span className="text-zinc-200">+{contrib.lines_added} / -{contrib.lines_deleted}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-zinc-500">Churn Ratio:</span>
                      <span className="text-zinc-200">{contrib.churn_ratio}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tier 3 (Core Logic):</span>
                      <span className="text-emerald-400 font-semibold">
                        {contrib.tier_breakdown.tier_3.percentage}%
                      </span>
                    </div>
                  </div>

                  {contrib.anomaly_flags.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      {contrib.anomaly_flags.map((f, idx) => (
                        <div
                          key={idx}
                          className="rounded border border-red-500/20 bg-red-500/10 p-2 font-mono text-[11px] text-red-400 flex items-start space-x-1.5"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{f.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
                  {contrib.pramaan_score && contrib.pramaan_score >= 75 ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                      <span>✓</span>
                      <span>Hoollow Verified Builder</span>
                    </span>
                  ) : contrib.anomaly_flags.length > 0 || (contrib.pramaan_score && contrib.pramaan_score < 40) ? (
                    <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[10px] text-rose-400 font-semibold flex items-center space-x-1">
                      <span>✕</span>
                      <span>Fails Proof-of-Work Standard</span>
                    </span>
                  ) : (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-400 font-semibold flex items-center space-x-1">
                      <span>!</span>
                      <span>Insufficient Code Complexity</span>
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-zinc-500 uppercase">
                    {contrib.verdict.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Hoollow Watermark Banner */}
          <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-3">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-emerald-500/80">
                VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
              </span>
            </div>
            <a
              href="https://hoollow.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition"
            >
              Export to Hoollow Profile ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
