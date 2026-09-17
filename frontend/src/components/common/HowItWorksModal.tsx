"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Layers,
  Mic,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Terminal,
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAudit?: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartAudit,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      step: "01",
      title: "Ingestion & Deep Git Mining",
      subtitle: "PyDriller Chronological Extraction & Levenshtein Identity Resolution",
      icon: GitBranch,
      color: "text-emerald-400",
      badge: "DATA PIPELINE",
      description:
        "Pramaan clones shallow commit trees without storing student source code permanently. PyDriller parses file diffs line-by-line, computing deletions versus additions. Levenshtein fuzzy clustering unifies multiple git emails to prevent single contributors from posing as entire teams.",
      points: [
        "Traverses chronological commit lineage up to 50 deep commits",
        "Calculates file-level additions, deletions, and iterative churn ratio",
        "Clusters commit aliases into a unified author cryptographic identity",
      ],
      diagram: (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-2 text-zinc-300">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1">
            <span>GIT TRAVERSAL ENGINE</span>
            <span className="text-emerald-400">STATUS: READY</span>
          </div>
          <div className="text-zinc-400">git clone --depth 50 &lt;repo&gt;</div>
          <div className="text-emerald-300">✓ 42 commits mined across 3 active branches</div>
          <div className="text-indigo-300">✓ Author deduplicated: 'rohit-sharma' &lt;rohit@stanford.edu&gt;</div>
          <div className="text-zinc-400">✓ Iterative Churn Ratio: 34.2% (Atomic Cadence)</div>
        </div>
      ),
    },
    {
      step: "02",
      title: "4-Tier AST Complexity Engine",
      subtitle: "Separating Boilerplate UI from Algorithmic Core Logic",
      icon: Layers,
      color: "text-cyan-400",
      badge: "SYNTAX FORENSICS",
      description:
        "Raw line counts lie. A student who copies 2,000 lines of Tailwind JSX or CSS variables did not build an algorithm. Pramaan's Abstract Syntax Tree (AST) engine parses code structures into 4 hierarchical tiers, applying 3.0x multiplier to state machines, concurrency locks, and algorithmic data structures.",
      points: [
        "Tier 0: Pure boilerplate, comments, imports & formatting (0.0x weight)",
        "Tier 1: Declarative markup, HTML templates & static UI (0.2x weight)",
        "Tier 2: Controllers, API routes, handlers & service glue (1.0x weight)",
        "Tier 3 & 4: Distributed locks, mutexes, tree algorithms & state machines (3.0x weight)",
      ],
      diagram: (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-2 text-zinc-300">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1">
            <span>AST COMPLEXITY BREAKDOWN</span>
            <span className="text-cyan-400">TIER-3 ISOLATION</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>Tier 3 (Algorithmic Logic):</span>
            <strong className="text-emerald-400">89.4% (3.0x Multiplier)</strong>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>Tier 1 (UI / Declarative):</span>
            <span className="text-zinc-400">10.6% (0.2x Multiplier)</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[89%]" />
          </div>
        </div>
      ),
    },
    {
      step: "03",
      title: "Autonomous Oral Viva Defense",
      subtitle: "Line-Targeted LLM Interrogation with Real-Time Anti-Cheat",
      icon: Mic,
      color: "text-rose-400",
      badge: "LIVE DEFENSE",
      description:
        "When an anomalous commit or high-complexity block is detected, Pramaan extracts the exact lines and prompts Gemini 2.5 Flash to formulate targeted architectural questions. The candidate defends their logic via live voice dictation or text while anti-cheat monitors tab switches and clipboard injections.",
      points: [
        "Questions cite exact commit hashes, file paths, and lines of code",
        "Browser Web Speech API enables real-time acoustic voice transcription",
        "Cadence telemetry flags copy-pasted ChatGPT answers and robot latencies",
        "Evaluator workbench enables real-time observation and remote grading",
      ],
      diagram: (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-2 text-zinc-300">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1">
            <span>EXAMINER TERMINAL • ROOM #ROOM-4A82</span>
            <span className="text-rose-400 animate-pulse">● LIVE MIC</span>
          </div>
          <div className="text-zinc-400 italic">
            "Candidate Rohit, looking at line 45 of auth_service.py, you set a 5-second TTL on the Redis lock. Why didn't you use a persistent semaphore?"
          </div>
          <div className="text-emerald-400 text-[11px]">
            ✓ Live Voice Transcribing: 142 WPM • 0 Paste Violations
          </div>
        </div>
      ),
    },
    {
      step: "04",
      title: "Cryptographic Verdict & Proof Receipt",
      subtitle: "300 DPI Vector PDF Diplomas & Verifiable QR Evidence Wall",
      icon: Award,
      color: "text-emerald-400",
      badge: "CERTIFICATION",
      description:
        "Upon completing oral defense, the candidate receives a sealed cryptographic Proof-of-Work receipt. Evaluators can issue formal 300 DPI vector PDF diplomas signed with SHA-256 hashes, permanent verification QR codes, and automated sticky audit summaries posted directly to GitHub Pull Requests.",
      points: [
        "Hoollow Verified Builder standard: Score ≥ 75 required for endorsement",
        "Tamper-proof SHA-256 integrity hash bound to git commit tree",
        "Official printable A4 vector PDF diploma with gold/emerald hairline inlays",
        "Sticky GitHub PR bot comment automatically blocks unverified merges",
      ],
      diagram: (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-2 text-zinc-300">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1">
            <span>HOOLLOW PROTOCOL SEAL</span>
            <span className="text-emerald-400">VERIFIED BUILDER</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>Integrity Index:</span>
            <strong className="text-emerald-400">94.2 / 100 (Tier 1)</strong>
          </div>
          <div className="text-zinc-500 text-[10px]">
            SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649...
          </div>
          <div className="text-emerald-400/90 text-[10px]">
            ✓ PR Merge Approved • Vector Diploma Issued
          </div>
        </div>
      ),
    },
  ];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, slides.length]);

  if (!isOpen) return null;

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-zinc-100 flex flex-col justify-between min-h-[580px]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header Pill & Slide Step */}
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                <Sparkles className="h-3 w-3" />
                <span>PLATFORM TOUR • STEP {current.step} OF 04</span>
              </span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                {current.badge}
              </span>
            </div>

            {/* Slide Dots */}
            <div className="flex items-center space-x-1.5 mr-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx
                      ? "w-6 bg-emerald-400"
                      : "w-2 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Slide Body */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className={`p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 ${current.color}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-100">
                  {current.title}
                </h2>
                <p className="font-mono text-xs text-zinc-400 mt-0.5">
                  {current.subtitle}
                </p>
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
              {current.description}
            </p>

            {/* Feature Points */}
            <ul className="space-y-1.5 font-mono text-xs text-zinc-400 pt-1">
              {current.points.map((pt, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Visual Diagram Block */}
            <div className="pt-2">{current.diagram}</div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-6">
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 font-mono text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="font-mono text-[11px] text-zinc-500 hidden sm:block">
            Use ← → keys to navigate
          </div>

          {currentSlide < slides.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 font-mono text-xs font-bold hover:bg-zinc-200 transition"
            >
              <span>Next Stage</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onStartAudit) onStartAudit();
              }}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-mono text-xs font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition"
            >
              <span>Launch Quick Audit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
