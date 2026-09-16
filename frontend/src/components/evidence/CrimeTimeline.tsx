"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { type TimelineCommit, type Contributor } from "@/lib/mock-data";

interface CrimeTimelineProps {
  commits: TimelineCommit[];
  contributors?: Contributor[];
  analysisId?: string;
  onCommitSelect?: (commit: TimelineCommit) => void;
  onStartViva?: (contributorId: string) => void;
}

export function CrimeTimeline({
  commits,
  contributors = [],
  analysisId = "demo-smart-campus",
  onCommitSelect,
  onStartViva,
}: CrimeTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeCommit = commits[currentIndex] || commits[0];
  const displayedCommit = hoveredIndex !== null ? commits[hoveredIndex] : activeCommit;

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = playbackSpeed === 1 ? 1400 : 700;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= commits.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, commits.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setCurrentIndex(idx);
    if (commits[idx] && onCommitSelect) {
      onCommitSelect(commits[idx]);
    }
  };

  const handleStepBack = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setCurrentIndex((prev) => Math.min(commits.length - 1, prev + 1));
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const getAuthorColor = (authorName: string) => {
    const match = contributors.find(
      (c) => c.primary_name.toLowerCase() === authorName.toLowerCase()
    );
    return match?.avatar_color || "#71717a";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* Header & DVR Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DVR PLAYBACK ACTIVE
            </span>
            <span className="font-mono text-xs text-zinc-500">
              Commit {currentIndex + 1} of {commits.length}
            </span>
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-100 mt-1">
            Git Evolution &amp; Churn Scrubber
          </h3>
          <p className="font-mono text-xs text-zinc-400">
            Scrub chronological commit evolution to pinpoint monolithic code dumps and anomalous bursts.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2 bg-zinc-950/80 p-1.5 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={handleStepBack}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 disabled:opacity-30 transition"
            title="Previous Commit"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 font-mono text-xs font-semibold hover:bg-zinc-200 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-zinc-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-zinc-950" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentIndex === commits.length - 1}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 disabled:opacity-30 transition"
            title="Next Commit"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
            className="px-2 py-1 rounded text-[11px] font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-white/5 transition"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="mt-8 mb-4 px-3">
        {/* Day / Time markers */}
        <div className="flex justify-between font-mono text-[11px] text-zinc-500 mb-2">
          <span>Day 1 (Kickoff)</span>
          <span>Midpoint Sprint</span>
          <span className="text-rose-400 font-semibold">Day 14 (03:42 AM Deadline Dump)</span>
        </div>

        {/* Track Line */}
        <div className="relative py-4">
          {/* Base gray line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-zinc-800" />

          {/* Active progress colored bar */}
          <div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-zinc-200 transition-all duration-300"
            style={{
              width: `${(currentIndex / Math.max(1, commits.length - 1)) * 100}%`,
            }}
          />

          {/* Plotted Commit Nodes */}
          <div className="relative flex justify-between items-center z-10">
            {commits.map((commit, idx) => {
              const isSelected = idx === currentIndex;
              const isAnomalous = commit.is_anomalous;

              return (
                <div
                  key={commit.commit_hash || idx}
                  className="relative flex flex-col items-center cursor-pointer group"
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (onCommitSelect) onCommitSelect(commit);
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* The Node Dot */}
                  <div
                    className={`relative transition-all duration-200 rounded-full flex items-center justify-center ${
                      isAnomalous
                        ? "h-6 w-6 bg-rose-500 ring-4 ring-rose-500/30 ring-offset-2 ring-offset-zinc-950 animate-pulse scale-125"
                        : isSelected
                        ? "h-5 w-5 bg-emerald-400 ring-4 ring-emerald-500/20 ring-offset-2 ring-offset-zinc-950"
                        : "h-3.5 w-3.5 bg-zinc-700 hover:bg-zinc-400 group-hover:scale-125"
                    }`}
                  >
                    {isAnomalous ? (
                      <span className="text-[10px] text-white font-bold leading-none">!</span>
                    ) : isSelected ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                    ) : null}
                  </div>

                  {/* Commit hash & day label */}
                  <div className="absolute -bottom-6 flex flex-col items-center">
                    <span
                      className={`font-mono text-[10px] whitespace-nowrap transition-colors ${
                        isAnomalous
                          ? "text-rose-400 font-bold"
                          : isSelected
                          ? "text-emerald-400 font-semibold"
                          : "text-zinc-600 group-hover:text-zinc-400"
                      }`}
                    >
                      #{commit.commit_hash.slice(0, 6)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Range Slider for Smooth Scrubbing */}
        <div className="mt-8">
          <input
            type="range"
            min={0}
            max={commits.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Selected / Hovered Commit Inspector Card */}
      <AnimatePresence mode="wait">
        {displayedCommit && (
          <motion.div
            key={displayedCommit.commit_hash}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`mt-6 rounded-xl border p-5 transition-all ${
              displayedCommit.is_anomalous
                ? "border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/30"
                : "border-white/10 bg-zinc-950/70"
            }`}
          >
            {/* Top Bar: Author, Hash, Timestamp */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center space-x-3">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: getAuthorColor(displayedCommit.author) }}
                />
                <span className="font-mono text-sm font-semibold text-zinc-200">
                  {displayedCommit.author}
                </span>
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                  commit #{displayedCommit.commit_hash}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  Day {displayedCommit.day_index}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 font-mono text-xs text-zinc-400">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                <span>{formatTimestamp(displayedCommit.timestamp)}</span>
              </div>
            </div>

            {/* Commit Message */}
            <div className="mt-3">
              <p className="font-mono text-sm text-zinc-100 font-medium">
                &ldquo;{displayedCommit.message}&rdquo;
              </p>
            </div>

            {/* Metrics & Anomaly Warnings */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 font-semibold">
                  +{displayedCommit.lines_added.toLocaleString()} lines
                </span>
                <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-zinc-400">
                  -{displayedCommit.lines_deleted.toLocaleString()} lines
                </span>
                <span className="rounded-md border border-white/5 bg-zinc-900 px-2.5 py-1 text-zinc-400">
                  {displayedCommit.files_changed} files changed
                </span>
              </div>

              {/* Anomaly Detection Status */}
              {displayedCommit.is_anomalous ? (
                <div className="flex items-center space-x-2">
                  <div className="inline-flex items-center space-x-1.5 rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-1 font-mono text-xs font-semibold text-rose-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>FLAG_BIG_BANG: Monolithic Dump Detected</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onStartViva) {
                        onStartViva(displayedCommit.contributor_id);
                      } else {
                        window.location.href = `/viva/${analysisId}/${displayedCommit.contributor_id}`;
                      }
                    }}
                    className="inline-flex items-center space-x-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1 font-mono text-xs font-semibold text-white shadow-md transition"
                  >
                    <span>Put in Hot Seat Viva</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1 font-mono text-xs text-emerald-400/80">
                  <span>✓ Standard Iterative Cadence</span>
                </div>
              )}
            </div>

            {/* If anomalous: Forensic Details Alert */}
            {displayedCommit.is_anomalous && (
              <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-950/30 p-3 font-mono text-xs text-rose-300">
                <span className="font-bold text-rose-200 uppercase tracking-wider">Forensic Audit: </span>
                Single massive code injection (+4,821 lines, 0 deletions) at 03:42 AM within 8 hours of submission. Zero iterative refactors or debugging history detected in git tree. Violates Hoollow Proof-of-Work Standard.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
