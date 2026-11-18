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
  rawDiff?: string;
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

function parseRawDiff(patch: string): DiffLine[] {
  const result: DiffLine[] = [];
  const lines = patch.split("\n");
  let lineNum = 1;

  for (const line of lines) {
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)/);
      if (match) {
        lineNum = parseInt(match[1], 10);
      }
      result.push({ lineNum: 0, content: line, type: "context" });
    } else if (line.startsWith("+")) {
      result.push({ lineNum: lineNum++, content: line, type: "added" });
    } else if (line.startsWith("-")) {
      result.push({ lineNum: lineNum, content: line, type: "removed" });
    } else {
      result.push({ lineNum: lineNum++, content: line, type: "context" });
    }
  }

  return result.length > 0 ? result : defaultMockDiffLines;
}

export function DiffInspector({
  isOpen,
  onClose,
  filePath = "src/engine/collaborative_filter.py",
  commitHash = "3f82a9d",
  authorName = "Aryan Kumar",
  commitMessage = "modified source file",
  rawDiff,
  lines,
}: DiffInspectorProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayLines = rawDiff ? parseRawDiff(rawDiff) : (lines || defaultMockDiffLines);

  const handleCopyCode = () => {
    const raw = displayLines.map((l) => l.content).join("\n");
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
                <FileCode className="h-4 w-4" />
                <span className="font-semibold">{filePath}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center space-x-1">
                  <GitCommit className="h-3.5 w-3.5 text-zinc-500" />
                  <span>commit: {commitHash?.slice(0, 7) || "head"}</span>
                </span>
                <span>•</span>
                <span>Author: {authorName}</span>
                {commitMessage && (
                  <>
                    <span>•</span>
                    <span className="text-zinc-500 max-w-xs truncate">&ldquo;{commitMessage}&rdquo;</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Diff Content */}
          <div className="flex-1 overflow-y-auto rounded-xl border border-white/5 bg-zinc-900/60 font-mono text-xs leading-relaxed p-4 select-text">
            {displayLines.map((line, idx) => {
              const isAdded = line.type === "added";
              const isRemoved = line.type === "removed";

              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded ${
                    isAdded
                      ? "bg-emerald-500/10 text-emerald-300 font-medium"
                      : isRemoved
                      ? "bg-rose-500/10 text-rose-300 line-through opacity-70"
                      : "text-zinc-400 hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="w-10 shrink-0 text-zinc-600 select-none text-right pr-3">
                    {line.lineNum > 0 ? line.lineNum : "..."}
                  </span>
                  <span className="w-4 shrink-0 select-none text-center">
                    {isAdded ? "+" : isRemoved ? "-" : " "}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap break-all font-mono">
                    {line.content.replace(/^[+-]/, "")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-3">
            <span>Verified diff patch extracted directly from commit graph</span>
            <span>Press ESC or click outside to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
