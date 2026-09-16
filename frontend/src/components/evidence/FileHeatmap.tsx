"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, Layers, User, Hash, Eye, Sparkles } from "lucide-react";
import { type Contributor } from "@/lib/mock-data";

export interface FileItem {
  filePath: string;
  lines: number;
  primaryAuthor: string;
  contributorId: string;
  tier: number; // 0, 1, 2, 3
  lastCommitHash: string;
  category: "ALGORITHMIC" | "CONTROLLER" | "UI_LAYOUT" | "BOILERPLATE";
}

export const defaultFileMap: FileItem[] = [
  {
    filePath: "src/engine/recommender.py",
    lines: 480,
    primaryAuthor: "Rohit Sharma",
    contributorId: "contrib-001",
    tier: 3,
    lastCommitHash: "4a82e1f",
    category: "ALGORITHMIC",
  },
  {
    filePath: "src/engine/collaborative_filter.py",
    lines: 420,
    primaryAuthor: "Aryan Kumar",
    contributorId: "contrib-002",
    tier: 3,
    lastCommitHash: "3f82a9d",
    category: "ALGORITHMIC",
  },
  {
    filePath: "src/api/v1/auth.py",
    lines: 290,
    primaryAuthor: "Rohit Sharma",
    contributorId: "contrib-001",
    tier: 3,
    lastCommitHash: "c4b1d2e",
    category: "ALGORITHMIC",
  },
  {
    filePath: "src/controllers/campus_router.py",
    lines: 240,
    primaryAuthor: "Rohit Sharma",
    contributorId: "contrib-001",
    tier: 2,
    lastCommitHash: "8a1e2f3",
    category: "CONTROLLER",
  },
  {
    filePath: "frontend/src/views/Dashboard.tsx",
    lines: 380,
    primaryAuthor: "Rohit Sharma",
    contributorId: "contrib-001",
    tier: 2,
    lastCommitHash: "2b9c4d1",
    category: "CONTROLLER",
  },
  {
    filePath: "frontend/src/components/Header.jsx",
    lines: 110,
    primaryAuthor: "Priya Patel",
    contributorId: "contrib-003",
    tier: 1,
    lastCommitHash: "9e4f5a1",
    category: "UI_LAYOUT",
  },
  {
    filePath: "frontend/src/styles/theme.css",
    lines: 340,
    primaryAuthor: "Priya Patel",
    contributorId: "contrib-003",
    tier: 1,
    lastCommitHash: "7b1c3d4",
    category: "UI_LAYOUT",
  },
  {
    filePath: "package-lock.json",
    lines: 1800,
    primaryAuthor: "Aryan Kumar",
    contributorId: "contrib-002",
    tier: 0,
    lastCommitHash: "3f82a9d",
    category: "BOILERPLATE",
  },
  {
    filePath: "README.md",
    lines: 95,
    primaryAuthor: "Priya Patel",
    contributorId: "contrib-003",
    tier: 0,
    lastCommitHash: "1a2b3c4",
    category: "BOILERPLATE",
  },
];

interface FileHeatmapProps {
  files?: FileItem[];
  contributors?: Contributor[];
  onInspectFile?: (file: FileItem) => void;
}

export function FileHeatmap({
  files = defaultFileMap,
  contributors = [],
  onInspectFile,
}: FileHeatmapProps) {
  const [selectedTier, setSelectedTier] = useState<number | "ALL">("ALL");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("ALL");
  const [hoveredFile, setHoveredFile] = useState<FileItem | null>(null);

  const filteredFiles = files.filter((f) => {
    if (selectedTier !== "ALL" && f.tier !== selectedTier) return false;
    if (selectedAuthor !== "ALL" && f.primaryAuthor !== selectedAuthor) return false;
    return true;
  });

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 3:
        return {
          label: "TIER 3 (3.0x)",
          color: "border-purple-500/40 bg-purple-500/10 text-purple-300",
          cardBorder: "border-purple-500/30 hover:border-purple-500/60 bg-purple-950/15",
        };
      case 2:
        return {
          label: "TIER 2 (1.0x)",
          color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
          cardBorder: "border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-950/15",
        };
      case 1:
        return {
          label: "TIER 1 (0.2x)",
          color: "border-amber-500/40 bg-amber-500/10 text-amber-300",
          cardBorder: "border-amber-500/30 hover:border-amber-500/60 bg-amber-950/15",
        };
      case 0:
      default:
        return {
          label: "TIER 0 (0.0x)",
          color: "border-zinc-700 bg-zinc-800/40 text-zinc-400",
          cardBorder: "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30",
        };
    }
  };

  const getAuthorPillColor = (name: string) => {
    if (name.includes("Rohit")) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    if (name.includes("Aryan")) return "text-rose-400 border-rose-500/30 bg-rose-950/20";
    return "text-amber-400 border-amber-500/30 bg-amber-950/20";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-500/20 bg-purple-950/20 px-2.5 py-0.5 text-[10px] font-mono text-purple-300">
            <span>✦ SEMANTIC AST CODEBASE TREEMAP</span>
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-100 mt-1">
            File Ownership &amp; Complexity Heatmap
          </h3>
          <p className="font-mono text-xs text-zinc-400">
            Visualizing who owns what code, weighted by AST algorithmic depth tiers.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Tier filter */}
          <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-white/5">
            <span className="text-zinc-500 pl-2">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) =>
                setSelectedTier(
                  e.target.value === "ALL" ? "ALL" : Number(e.target.value)
                )
              }
              aria-label="Filter files by AST complexity tier"
              className="bg-transparent px-2 py-1 text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">All Tiers</option>
              <option value="3" className="bg-zinc-900">Tier 3 (Algorithmic)</option>
              <option value="2" className="bg-zinc-900">Tier 2 (Controllers)</option>
              <option value="1" className="bg-zinc-900">Tier 1 (UI / Templates)</option>
              <option value="0" className="bg-zinc-900">Tier 0 (Boilerplate)</option>
            </select>
          </div>

          {/* Author filter */}
          <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-white/5">
            <span className="text-zinc-500 pl-2">Author:</span>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              aria-label="Filter files by primary author"
              className="bg-transparent px-2 py-1 text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">All Contributors</option>
              <option value="Rohit Sharma" className="bg-zinc-900">Rohit Sharma</option>
              <option value="Aryan Kumar" className="bg-zinc-900">Aryan Kumar</option>
              <option value="Priya Patel" className="bg-zinc-900">Priya Patel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of File Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file, idx) => {
          const tierStyle = getTierBadge(file.tier);

          return (
            <motion.div
              key={file.filePath}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredFile(file)}
              onMouseLeave={() => setHoveredFile(null)}
              onClick={() => onInspectFile?.(file)}
              className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 group ${tierStyle.cardBorder}`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tierStyle.color}`}
                >
                  {tierStyle.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {file.lines} lines
                </span>
              </div>

              <div className="mt-3 flex items-start space-x-2">
                <FileCode className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <span className="font-mono text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                  {file.filePath}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-md border text-[10px] ${getAuthorPillColor(
                    file.primaryAuthor
                  )}`}
                >
                  {file.primaryAuthor}
                </span>

                <span className="text-zinc-500 flex items-center space-x-1 group-hover:text-zinc-300 transition">
                  <Eye className="w-3 h-3" />
                  <span>Inspect Diff</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500">
        <div className="flex items-center space-x-4">
          <span className="text-zinc-400 font-semibold">Tiers:</span>
          <span className="text-purple-400">● Tier 3 (3.0x Core Logic)</span>
          <span className="text-cyan-400">● Tier 2 (1.0x Controllers)</span>
          <span className="text-amber-400">● Tier 1 (0.2x UI/Templates)</span>
          <span className="text-zinc-500">● Tier 0 (0.0x Boilerplate)</span>
        </div>
        <div>Total Files: {files.length}</div>
      </div>
    </div>
  );
}
