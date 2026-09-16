"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GitBranch,
  ShieldAlert,
  ArrowLeft,
  Layers,
  Clock,
  Radar,
  Flame,
  User,
  AlertTriangle,
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/investigate/${analysisId}`}
              className="inline-flex items-center space-x-1 font-mono text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Investigation</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="font-mono text-xs text-emerald-400 font-semibold uppercase">
              ACT 3: The Evidence Wall
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            {report?.repo_url || "Repository Forensic Evidence Wall"}
          </h1>
          <p className="mt-1 font-body text-sm text-zinc-400">
            Comprehensive audit dossier: Contributor DNA, Commit Evolution Timeline, and Anomaly Profiles.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-400">
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
                  <span className="font-mono text-[11px] text-zinc-400 uppercase font-semibold">
                    {contrib.verdict.replace(/_/g, " ")}
                  </span>
                  <span className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-zinc-400">
                    Ready for Viva
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
