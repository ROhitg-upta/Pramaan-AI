"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCommit, FileCode, ShieldAlert, Check, Copy } from "lucide-react";

export interface DiffLine {
  lineNum: number;
  content: string;
  type: "added" | "removed" | "context";
}

export interface DiffInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  filePath?: string;
  commitHash?: string;
  authorName?: string;
  commitMessage?: string;
  lines?: DiffLine[];
}

export const defaultMockDiffLines: DiffLine[] = [
  { lineNum: 71, content: "class CollaborativeRecommender:", type: "context" },
  { lineNum: 72, content: "    def __init__(self, k_neighbors=10):", type: "context" },
  { lineNum: 73, content: "        self.k = k_neighbors", type: "context" },
  { lineNum: 74, content: "        self.similarity_matrix = None", type: "context" },
  { lineNum: 75, content: "", type: "context" },
  { lineNum: 76, content: "+   # [ANOMALY_TRIGGER]: Monolithic dump pasted at 03:42 AM", type: "added" },
  { lineNum: 77, content: "+   def train_matrix(self, user_item_matrix):", type: "added" },
  { lineNum: 78, content: "+       # Compute cosine similarity across all users O(n^2)", type: "added" },
  { lineNum: 79, content: "+       self.similarity_matrix = cosine_similarity(user_item_matrix)", type: "added" },
  { lineNum: 80, content: "+       return self.similarity_matrix", type: "added" },
  { lineNum: 81, content: "+", type: "added" },
  { lineNum: 82, content: "+   def get_top_recommendations(self, user_id, n=5):", type: "added" },
  { lineNum: 83, content: "+       scores = self.similarity_matrix[user_id]", type: "added" },
  { lineNum: 84, content: "+       return np.argsort(scores)[::-1][:n]", type: "added" },
  { lineNum: 85, content: "-   # Deprecated: single user heuristics", type: "removed" },
  { lineNum: 86, content: "    def evaluate_precision(self, ground_truth):", type: "context" },
  { lineNum: 87, content: "        pass", type: "context" },
];

export function DiffInspector({
  isOpen,
  onClose,
  filePath = "src/engine/collaborative_filter.py",
  commitHash = "3f82a9d",
  authorName = "Aryan Kumar",
  commitMessage = "added recommender engine [03:42 AM dump]",
  lines = defaultMockDiffLines,
}: DiffInspectorProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    const raw = lines.map((l) => l.content).join("\n");
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-zinc-800 border border-white/10 text-cyan-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-zinc-100">
                    {filePath}
                  </span>
                  <span className="font-mono text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    #{commitHash}
                  </span>
                </div>
                <div className="font-mono text-xs text-zinc-400 mt-0.5">
                  Author: <span className="text-zinc-200">{authorName}</span> • &ldquo;{commitMessage}&rdquo;
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Diff</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Diff Viewer Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-6 bg-[#090d16] select-text">
            {lines.map((line, idx) => {
              const isAdded = line.type === "added";
              const isRemoved = line.type === "removed";

              const rowBg = isAdded
                ? "bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500"
                : isRemoved
                ? "bg-rose-950/30 text-rose-300 border-l-2 border-rose-500"
                : "text-zinc-400 hover:bg-zinc-900/40";

              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 px-3 py-0.5 rounded ${rowBg}`}
                >
                  <span className="w-8 text-right text-zinc-600 select-none text-[11px]">
                    {line.lineNum}
                  </span>
                  <span className="w-3 select-none text-zinc-500 font-bold">
                    {isAdded ? "+" : isRemoved ? "-" : " "}
                  </span>
                  <span className="flex-1 whitespace-pre">{line.content}</span>
                </div>
              );
            })}
          </div>

          {/* Footer Warning Notice */}
          <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center space-x-2 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>FLAG_BIG_BANG Evidence: 4,821 lines added in 1 commit with 0 deletions.</span>
            </div>
            <span className="text-[11px] text-zinc-500">AST TIER 3 INSPECTION</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
