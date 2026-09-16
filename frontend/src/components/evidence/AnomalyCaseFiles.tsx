"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  FileCode2,
  Clock,
  User,
  ArrowRight,
  Filter,
  ShieldAlert,
  Eye,
} from "lucide-react";
import { type Anomaly, type Contributor } from "@/lib/mock-data";

interface AnomalyCaseFilesProps {
  anomalies: Anomaly[];
  contributors: Contributor[];
  analysisId?: string;
  onStartViva?: (contributorId: string) => void;
  onViewDiff?: (anomaly: Anomaly) => void;
}

export function AnomalyCaseFiles({
  anomalies,
  contributors,
  analysisId = "demo-smart-campus",
  onStartViva,
  onViewDiff,
}: AnomalyCaseFilesProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [contributorFilter, setContributorFilter] = useState<string>("ALL");

  // Filter logic
  const filteredAnomalies = anomalies.filter((a) => {
    if (severityFilter !== "ALL" && a.severity !== severityFilter) return false;
    if (contributorFilter !== "ALL" && a.contributor_id !== contributorFilter)
      return false;
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-400">
            <AlertOctagon className="h-3 w-3" />
            <span>CRITICAL BREACH</span>
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>HIGH RISK</span>
          </span>
        );
      case "MEDIUM":
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-yellow-400">
            <ShieldAlert className="h-3 w-3" />
            <span>MEDIUM FLAG</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-rose-500/20 bg-rose-950/20 px-2.5 py-0.5 text-[10px] font-mono text-rose-400">
            <span>✦ HEURISTIC FRAUD DETECTION ENGINE</span>
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-100 mt-1">
            Forensic Anomaly Case Files
          </h3>
          <p className="font-mono text-xs text-zinc-400">
            Algorithmic infractions detected against the Hoollow Proof-of-Work Standard.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-white/5">
            <Filter className="h-3.5 w-3.5 text-zinc-500 ml-2" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              aria-label="Filter anomalies by severity"
              className="bg-transparent px-2 py-1 text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">All Severities</option>
              <option value="CRITICAL" className="bg-zinc-900">Critical Only</option>
              <option value="HIGH" className="bg-zinc-900">High Only</option>
              <option value="MEDIUM" className="bg-zinc-900">Medium Only</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-white/5">
            <User className="h-3.5 w-3.5 text-zinc-500 ml-2" />
            <select
              value={contributorFilter}
              onChange={(e) => setContributorFilter(e.target.value)}
              aria-label="Filter anomalies by contributor"
              className="bg-transparent px-2 py-1 text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">All Contributors</option>
              {contributors.map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-900">
                  {c.primary_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Case Files List */}
      <div className="mt-6 space-y-4">
        {filteredAnomalies.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-8 text-center font-mono text-xs text-zinc-500">
            No forensic anomalies matching the active filters.
          </div>
        ) : (
          filteredAnomalies.map((item, idx) => {
            const isCritical = item.severity === "CRITICAL";

            return (
              <div
                key={item.id || idx}
                className={`rounded-xl border p-5 transition-all ${
                  isCritical
                    ? "border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50"
                    : "border-white/5 bg-zinc-950/60 hover:border-white/10"
                }`}
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      CASE #{String(idx + 1).padStart(3, "0")}
                    </span>
                    <span className="font-mono text-sm font-bold text-zinc-100">
                      {item.type.replace(/_/g, " ")}
                    </span>
                    {getSeverityBadge(item.severity)}
                  </div>

                  <div className="flex items-center space-x-3 font-mono text-xs text-zinc-400">
                    <span className="text-zinc-500">Suspect:</span>
                    <span className="text-zinc-200 font-semibold">{item.contributor_name}</span>
                    {item.commit_hash && (
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        #{item.commit_hash}
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence Summary Technical Block */}
                <div className="mt-4">
                  <div className="rounded-lg bg-zinc-900/90 border border-white/5 p-3.5 font-mono text-xs text-zinc-300 leading-relaxed">
                    <span className="text-rose-400 font-semibold uppercase tracking-wider block mb-1">
                      Algorithmic Proof:
                    </span>
                    {item.evidence_summary}
                  </div>
                </div>

                {/* Violation & Hot Seat Action Footer */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2 font-mono text-[11px] text-rose-400/90">
                    <span>✕</span>
                    <span>
                      Violates Hoollow Proof-of-Work Standard (Iterative Cadence Requirement)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {onViewDiff && (
                      <button
                        type="button"
                        onClick={() => onViewDiff(item)}
                        className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3.5 py-2 font-mono text-xs transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Inspect Diff Proof</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (onStartViva) {
                          onStartViva(item.contributor_id);
                        } else {
                          window.location.href = `/viva/${analysisId}/${item.contributor_id}`;
                        }
                      }}
                      className="inline-flex items-center justify-center space-x-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white px-4 py-2 font-mono text-xs font-semibold shadow-md transition"
                    >
                      <span>🎙️ Put in Hot Seat Viva Defense</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
