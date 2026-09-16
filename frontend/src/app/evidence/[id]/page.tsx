"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Clock,
  Layers,
  Sparkles,
  GitCommit,
  User,
  Radar,
  FileSpreadsheet,
} from "lucide-react";
import { getAnalysisReport } from "@/lib/api";
import { type FullReportResponse } from "@/lib/mock-data";
import { CrimeTimeline } from "@/components/evidence/CrimeTimeline";
import { DnaRadarChart } from "@/components/evidence/DnaRadarChart";
import { AnomalyCaseFiles } from "@/components/evidence/AnomalyCaseFiles";

type TabType = "overview" | "timeline" | "radar" | "anomalies";

export default function EvidenceWall() {
  const params = useParams();
  const router = useRouter();
  const analysisId = (params?.id as string) || "demo-smart-campus";

  const [report, setReport] = useState<FullReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    let isCurrent = true;
    getAnalysisReport(analysisId).then((data) => {
      if (isCurrent) {
        setReport(data);
        setLoading(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [analysisId]);

  const handleStartViva = (contributorId: string) => {
    router.push(`/viva/${analysisId}/${contributorId}`);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header Bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Link
              href={`/investigate/${analysisId}`}
              className="inline-flex items-center space-x-1 font-mono text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Live Telemetry</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
              <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center space-x-3">
            <span>{report?.repo_url || "Repository Forensic Evidence Wall"}</span>
            <span className="text-zinc-500 font-mono text-xs font-normal border border-white/10 px-2 py-0.5 rounded-md">
              branch: {report?.branch || "main"}
            </span>
          </h1>

          <p className="mt-1 font-mono text-xs sm:text-sm text-emerald-400/90">
            &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo;
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://hoollow.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 font-mono text-xs text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition shadow-sm"
          >
            <span>Export to Hoollow Profile ↗</span>
          </a>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
            <span>Integrity: {report?.integrity_grade || "C+"}</span>
            <span className="text-zinc-500">|</span>
            <span>Score: {report?.overall_pramaan_score || 51}/100</span>
          </div>
        </div>
      </div>

      {/* 2. Top Segmented Tabs Navigation */}
      <div className="mb-8 flex items-center border-b border-white/5 pb-3 overflow-x-auto scrollbar-none">
        <div className="inline-flex p-1 rounded-xl bg-zinc-900/80 border border-white/5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Overview Dossiers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "timeline"
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Git Evolution Timeline (DVR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("radar")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "radar"
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Radar className="h-3.5 w-3.5" />
            <span>DNA Radar Comparison</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("anomalies")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "anomalies"
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Anomaly Case Files ({report?.anomalies?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* 3. Loading State */}
      {loading && (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-16 text-center font-mono text-sm text-zinc-500">
          Loading forensic evidence dossiers and commit timelines...
        </div>
      )}

      {/* 4. Tab Contents */}
      {!loading && report && (
        <div>
          {/* TAB 1: OVERVIEW DOSSIERS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Executive Summary Dossier */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Forensic Executive Summary</span>
                  </h3>
                  <span className="font-mono text-xs text-zinc-500">
                    Audited {report.total_commits} commits across {report.total_files} files in {report.analysis_duration_seconds}s
                  </span>
                </div>
                <p className="font-body text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-white/5">
                  {report.executive_summary}
                </p>
              </div>

              {/* Contributor Dossiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.contributors.map((contrib) => {
                  const isVerified = contrib.pramaan_score && contrib.pramaan_score >= 75;
                  const isFlagged =
                    contrib.anomaly_flags.length > 0 ||
                    (contrib.pramaan_score && contrib.pramaan_score < 40);

                  return (
                    <div
                      key={contrib.id}
                      className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 transition backdrop-blur-sm"
                    >
                      <div>
                        {/* Contributor Header */}
                        <div className="flex items-center justify-between font-mono">
                          <div className="flex items-center space-x-2.5">
                            <span
                              className="h-3.5 w-3.5 rounded-full"
                              style={{ backgroundColor: contrib.avatar_color }}
                            />
                            <span className="font-bold text-zinc-100 text-base">
                              {contrib.primary_name}
                            </span>
                          </div>
                          <span
                            className={`font-bold text-base ${
                              isVerified
                                ? "text-emerald-400"
                                : isFlagged
                                ? "text-rose-400"
                                : "text-amber-400"
                            }`}
                          >
                            {contrib.pramaan_score ? `${contrib.pramaan_score}/100` : "PENDING"}
                          </span>
                        </div>

                        <div className="mt-1 font-mono text-[11px] text-zinc-500 pl-6">
                          {contrib.emails[0]}
                        </div>

                        {/* Metrics Table */}
                        <div className="mt-5 space-y-2 font-mono text-xs text-zinc-400">
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="text-zinc-500">Total Commits:</span>
                            <span className="text-zinc-200 font-semibold">{contrib.total_commits}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="text-zinc-500">Lines Net:</span>
                            <span className="text-zinc-200">
                              +{contrib.lines_added.toLocaleString()} / -{contrib.lines_deleted.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="text-zinc-500">Iterative Churn:</span>
                            <span
                              className={`font-semibold ${
                                contrib.churn_ratio === 0 ? "text-rose-400" : "text-zinc-200"
                              }`}
                            >
                              {contrib.churn_ratio}%
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="text-zinc-500">Core Logic (Tier 3):</span>
                            <span
                              className={`font-semibold ${
                                contrib.tier_breakdown.tier_3.percentage > 40
                                  ? "text-emerald-400"
                                  : "text-zinc-400"
                              }`}
                            >
                              {contrib.tier_breakdown.tier_3.percentage}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Active Span:</span>
                            <span className="text-zinc-300">
                              {contrib.commit_cadence.active_days} days ({contrib.commit_cadence.avg_commits_per_day}/day)
                            </span>
                          </div>
                        </div>

                        {/* Anomaly Alerts on Card */}
                        {contrib.anomaly_flags.length > 0 && (
                          <div className="mt-4 space-y-1.5">
                            {contrib.anomaly_flags.map((f, idx) => (
                              <div
                                key={idx}
                                className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 font-mono text-[11px] text-rose-300 flex items-start space-x-1.5"
                              >
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
                                <span>{f.description}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Hoollow Badge + Hot Seat Button */}
                      <div className="mt-6 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between mb-3 font-mono">
                          {isVerified ? (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                              <span>✓</span>
                              <span>Hoollow Verified Builder</span>
                            </span>
                          ) : isFlagged ? (
                            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] text-rose-400 font-semibold flex items-center space-x-1">
                              <span>✕</span>
                              <span>Fails Proof-of-Work Standard</span>
                            </span>
                          ) : (
                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400 font-semibold flex items-center space-x-1">
                              <span>!</span>
                              <span>Ghost Contributor</span>
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500 uppercase">
                            {contrib.verdict.replace(/_/g, " ")}
                          </span>
                        </div>

                        {/* Requested Primary Action CTA */}
                        <button
                          type="button"
                          onClick={() => handleStartViva(contrib.id)}
                          className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-white/10 hover:bg-white hover:text-black py-2.5 font-mono text-xs font-semibold text-zinc-100 transition shadow-sm"
                        >
                          <span>🎙️ Put in Hot Seat Viva Defense</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GIT EVOLUTION TIMELINE (DVR) */}
          {activeTab === "timeline" && (
            <CrimeTimeline
              commits={report.timeline}
              contributors={report.contributors}
              analysisId={analysisId}
              onStartViva={handleStartViva}
            />
          )}

          {/* TAB 3: DNA RADAR COMPARISON */}
          {activeTab === "radar" && (
            <DnaRadarChart contributors={report.contributors} />
          )}

          {/* TAB 4: ANOMALY CASE FILES */}
          {activeTab === "anomalies" && (
            <AnomalyCaseFiles
              anomalies={report.anomalies}
              contributors={report.contributors}
              analysisId={analysisId}
              onStartViva={handleStartViva}
            />
          )}

          {/* 5. Official Hoollow Proof of Work Watermark Footer */}
          <div className="mt-12 rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-3">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-500/90">
                VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
              </span>
            </div>
            <a
              href="https://hoollow.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition inline-flex items-center space-x-1"
            >
              <span>Export to Hoollow Profile</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
