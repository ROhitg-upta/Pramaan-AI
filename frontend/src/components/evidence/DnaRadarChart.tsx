"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { ShieldCheck, AlertTriangle, UserCheck, Eye, EyeOff } from "lucide-react";
import { type Contributor } from "@/lib/mock-data";

interface DnaRadarChartProps {
  contributors: Contributor[];
  selectedContributorId?: string | null;
  onSelectContributor?: (id: string | null) => void;
}

const AXIS_KEYS = [
  { key: "algorithmic_depth", label: "Algorithmic Depth" },
  { key: "iterative_churn", label: "Iterative Churn" },
  { key: "commit_consistency", label: "Commit Consistency" },
  { key: "code_breadth", label: "Code Breadth" },
  { key: "ast_complexity", label: "AST Complexity" },
];

const DEFAULT_PALETTE: Record<string, { stroke: string; fill: string }> = {
  "contrib-001": { stroke: "#10b981", fill: "#10b981" }, // Emerald
  "contrib-002": { stroke: "#f43f5e", fill: "#f43f5e" }, // Rose
  "contrib-003": { stroke: "#f59e0b", fill: "#f59e0b" }, // Amber
};

export function DnaRadarChart({
  contributors,
  selectedContributorId,
  onSelectContributor,
}: DnaRadarChartProps) {
  const [mounted, setMounted] = useState(false);
  const [activeContributors, setActiveContributors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const initial: Record<string, boolean> = {};
    contributors.forEach((c) => {
      initial[c.id] = true;
    });
    setActiveContributors(initial);
  }, [contributors]);

  const toggleContributor = (id: string) => {
    setActiveContributors((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isolateContributor = (id: string) => {
    setActiveContributors((prev) => {
      const allOthersInactive = Object.keys(prev).every(
        (key) => (key === id ? prev[key] : !prev[key])
      );
      if (allOthersInactive) {
        // Reset to all active
        const all: Record<string, boolean> = {};
        contributors.forEach((c) => {
          all[c.id] = true;
        });
        return all;
      } else {
        const isolated: Record<string, boolean> = {};
        contributors.forEach((c) => {
          isolated[c.id] = c.id === id;
        });
        return isolated;
      }
    });
  };

  // Transform radar data for Recharts
  const chartData = AXIS_KEYS.map(({ key, label }) => {
    const dataPoint: Record<string, string | number> = {
      axis: label,
      fullMark: 100,
    };

    contributors.forEach((c) => {
      const axes = c.radar_axes as Record<string, number>;
      dataPoint[c.id] = axes ? axes[key] ?? 0 : 0;
    });

    return dataPoint;
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
            <span>✦ 5-AXIS PROOF-OF-WORK FINGERPRINT</span>
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-100 mt-1">
            DNA Radar Authorship Comparison
          </h3>
          <p className="font-mono text-xs text-zinc-400">
            Cross-examining algorithmic depth, iterative churn, commit cadence, module breadth, and AST tiering.
          </p>
        </div>

        {/* Legend / Contributor Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {contributors.map((c) => {
            const isActive = activeContributors[c.id] ?? true;
            const colors = DEFAULT_PALETTE[c.id] || {
              stroke: c.avatar_color || "#a1a1aa",
              fill: c.avatar_color || "#a1a1aa",
            };

            return (
              <div
                key={c.id}
                className={`inline-flex items-center space-x-2 rounded-xl px-3 py-1.5 font-mono text-xs transition border cursor-pointer ${
                  isActive
                    ? "border-white/10 bg-zinc-950/80 text-zinc-200 shadow-sm"
                    : "border-white/5 bg-zinc-900/40 text-zinc-500 opacity-60 hover:opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleContributor(c.id)}
                  className="flex items-center space-x-1.5 hover:text-white"
                  title={isActive ? "Hide on Radar" : "Show on Radar"}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors.stroke }}
                  />
                  <span className="font-semibold">{c.primary_name}</span>
                  {isActive ? (
                    <Eye className="h-3 w-3 text-zinc-400" />
                  ) : (
                    <EyeOff className="h-3 w-3 text-zinc-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => isolateContributor(c.id)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 border-l border-white/10 pl-1.5"
                  title="Isolate this contributor"
                >
                  Solo
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar Chart Body */}
      <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Chart Viewport */}
        <div className="w-full lg:w-3/5 h-[380px] flex items-center justify-center">
          {!mounted ? (
            <div className="flex h-full w-full items-center justify-center text-zinc-600 font-mono text-xs">
              Synthesizing polar radar matrix...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#27272a" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{
                    fill: "#a1a1aa",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  stroke="#3f3f46"
                  tick={{ fill: "#71717a", fontSize: 9, fontFamily: "monospace" }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataItem = payload[0]?.payload;
                      return (
                        <div className="rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-xs shadow-2xl">
                          <div className="font-semibold text-zinc-200 border-b border-white/10 pb-1.5 mb-2">
                            {dataItem.axis}
                          </div>
                          <div className="space-y-1">
                            {contributors.map((c) => {
                              if (!activeContributors[c.id]) return null;
                              const colors = DEFAULT_PALETTE[c.id] || { stroke: c.avatar_color };
                              return (
                                <div
                                  key={c.id}
                                  className="flex items-center justify-between space-x-4"
                                >
                                  <span
                                    className="flex items-center space-x-1.5"
                                    style={{ color: colors.stroke }}
                                  >
                                    <span
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: colors.stroke }}
                                    />
                                    <span>{c.primary_name}:</span>
                                  </span>
                                  <span className="font-bold text-zinc-100">
                                    {dataItem[c.id]} / 100
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {contributors.map((c) => {
                  if (!activeContributors[c.id]) return null;
                  const palette = DEFAULT_PALETTE[c.id] || {
                    stroke: c.avatar_color || "#a1a1aa",
                    fill: c.avatar_color || "#a1a1aa",
                  };

                  return (
                    <Radar
                      key={c.id}
                      name={c.primary_name}
                      dataKey={c.id}
                      stroke={palette.stroke}
                      fill={palette.fill}
                      fillOpacity={c.id === "contrib-001" ? 0.25 : 0.15}
                      strokeWidth={2}
                    />
                  );
                })}
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Side Forensic Comparison Cards */}
        <div className="w-full lg:w-2/5 flex flex-col space-y-3">
          {contributors.map((c) => {
            const isVerified = c.pramaan_score && c.pramaan_score >= 75;
            const isFlagged = c.anomaly_flags.length > 0 || (c.pramaan_score && c.pramaan_score < 40);
            const palette = DEFAULT_PALETTE[c.id] || { stroke: c.avatar_color };

            return (
              <div
                key={c.id}
                className="rounded-xl border border-white/5 bg-zinc-950/60 p-4 font-mono text-xs hover:border-white/10 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: palette.stroke }}
                    />
                    <span className="font-bold text-zinc-200 text-sm">
                      {c.primary_name}
                    </span>
                  </div>

                  <span
                    className={`font-bold ${
                      isVerified
                        ? "text-emerald-400"
                        : isFlagged
                        ? "text-rose-400"
                        : "text-amber-400"
                    }`}
                  >
                    Score: {c.pramaan_score ?? "N/A"}/100
                  </span>
                </div>

                {/* Proof of Work Badge */}
                <div className="mb-3">
                  {isVerified ? (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span>✓ Hoollow Verified Builder</span>
                    </span>
                  ) : isFlagged ? (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400">
                      <span>✕ Fails Proof-of-Work Standard</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                      <span>! Insufficient Proof-of-Work</span>
                    </span>
                  )}
                </div>

                {/* Radar Values Mini Strip */}
                <div className="grid grid-cols-5 gap-1 text-[10px] text-zinc-400 border-t border-white/5 pt-2">
                  <div className="text-center">
                    <div className="text-zinc-600">Depth</div>
                    <div className="font-semibold text-zinc-200">
                      {c.radar_axes?.algorithmic_depth ?? 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-600">Churn</div>
                    <div className="font-semibold text-zinc-200">
                      {c.radar_axes?.iterative_churn ?? 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-600">Cadence</div>
                    <div className="font-semibold text-zinc-200">
                      {c.radar_axes?.commit_consistency ?? 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-600">Breadth</div>
                    <div className="font-semibold text-zinc-200">
                      {c.radar_axes?.code_breadth ?? 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-600">AST</div>
                    <div className="font-semibold text-zinc-200">
                      {c.radar_axes?.ast_complexity ?? 0}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
