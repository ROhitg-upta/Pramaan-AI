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
  diffSnippet?: string;
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
  files,
  contributors = [],
  onInspectFile,
}: FileHeatmapProps) {
  const displayFiles = Array.isArray(files) && files.length > 0 ? files : defaultFileMap;
  const isUsingDefault = !Array.isArray(files) || files.length === 0;

  const [selectedTier, setSelectedTier] = useState<number | "ALL">("ALL");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("ALL");
  const [hoveredFile, setHoveredFile] = useState<FileItem | null>(null);

  const filteredFiles = displayFiles.filter((f) => {
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

  const authors = Array.from(new Set(displayFiles.map((f) => f.primaryAuthor)));

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-3 h-3 mr-1" />
              AST COMPLEXITY TREEMAP
            </span>
            <span className="text-zinc-500 text-xs font-mono">• {displayFiles.length} Audited Files</span>
          </div>
          <h2 className="font-display text-lg font-bold text-zinc-100 mt-1">
            File Complexity &amp; Authorship Matrix
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Click any file card to inspect its real commit diff patch.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier Filters */}
          <div className="inline-flex rounded-lg bg-zinc-950 border border-white/5 p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedTier("ALL")}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedTier === "ALL" ? "bg-white/10 text-zinc-100 font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All Tiers
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier(3)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedTier === 3 ? "bg-purple-500/20 text-purple-300 font-semibold" : "text-zinc-500 hover:text-purple-400"
              }`}
            >
              Tier 3
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier(2)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedTier === 2 ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "text-zinc-500 hover:text-cyan-400"
              }`}
            >
              Tier 2
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier(1)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedTier === 1 ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-zinc-500 hover:text-amber-400"
              }`}
            >
              Tier 1
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier(0)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedTier === 0 ? "bg-zinc-800 text-zinc-300 font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Tier 0
            </button>
          </div>

          {/* Author Filter Dropdown */}
          {authors.length > 1 && (
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Authors ({authors.length})</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Grid of Files */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <AnimatePresence>
          {filteredFiles.map((file) => {
            const badge = getTierBadge(file.tier);

            return (
              <motion.div
                key={file.filePath}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredFile(file)}
                onMouseLeave={() => setHoveredFile(null)}
                onClick={() => onInspectFile?.(file)}
                className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${badge.cardBorder}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <FileCode className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-200 transition" />
                    <span className="font-mono text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition">
                      {file.filePath}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                  <div className="flex items-center space-x-1.5">
                    <User className="h-3 w-3 text-zinc-600" />
                    <span className="text-zinc-400">{file.primaryAuthor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-400 font-medium">{file.lines} lines</span>
                    <span className="text-zinc-600">#{file.lastCommitHash.slice(0, 7)}</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  <span className="uppercase text-zinc-600">{file.category}</span>
                  <span className="text-emerald-400/80 group-hover:text-emerald-300 flex items-center space-x-1 transition">
                    <Eye className="h-3 w-3" />
                    <span>Inspect Diff</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredFiles.length === 0 && (
        <div className="mt-8 rounded-xl border border-white/5 bg-zinc-950 p-8 text-center">
          <p className="font-mono text-xs text-zinc-500">
            No files match the selected filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
