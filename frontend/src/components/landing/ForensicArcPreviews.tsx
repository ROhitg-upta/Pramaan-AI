"use client";

import React from "react";
import { GitBranch, Terminal, Scan, BarChart3, Mic, ShieldCheck, CheckCircle2, AlertTriangle, Cpu, QrCode } from "lucide-react";
import { InteractiveListItem } from "@/components/ui/interactive-list-preview";

export function RepoIngestionPreview() {
  return (
    <div className="h-full w-full flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-purple-400">
          <GitBranch className="h-4 w-4" />
          <span className="font-bold tracking-wider">GIT MINING GRAPH</span>
        </div>
        <span className="text-[10px] text-zinc-500">PyDriller v2.4</span>
      </div>

      <div className="space-y-2 py-1">
        {/* Branch visualization */}
        <div className="rounded-lg bg-black/60 border border-white/10 p-2.5">
          <div className="flex items-center gap-2 mb-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-semibold">commit c8f1e92</span>
            <span className="text-zinc-600">•</span>
            <span className="text-purple-300">feat(auth): add state lock</span>
          </div>
          <div className="text-[10px] text-zinc-400 pl-4 border-l-2 border-purple-500/40">
            Author: <span className="text-zinc-200">aryan.dev@gmail.com</span> (142 commits)
          </div>
        </div>

        {/* Levenshtein alias deduplication badge */}
        <div className="rounded-lg bg-purple-950/40 border border-purple-500/30 p-2 text-[10px]">
          <div className="flex items-center justify-between text-purple-300">
            <span>Levenshtein Alias Match:</span>
            <span className="font-bold text-emerald-400">0.96 Certainty</span>
          </div>
          <div className="text-zinc-400 mt-0.5 truncate">
            &ldquo;Aryan S.&rdquo; ⟷ &ldquo;aryan_sharma&rdquo; merged
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500">
        <span>0 noise commits pruned</span>
        <span className="text-emerald-400 font-semibold">Ready for AST Parse ✓</span>
      </div>
    </div>
  );
}

export function LiveForensicsPreview() {
  return (
    <div className="h-full w-full flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Scan className="h-4 w-4" />
          <span className="font-bold tracking-wider">4-TIER AST COMPLEXITY</span>
        </div>
        <span className="text-[10px] text-zinc-500">Tree-sitter</span>
      </div>

      {/* 4-tier complexity bars */}
      <div className="space-y-2 py-1">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-cyan-300">Tier 4: Algorithmic Depth (3.0x)</span>
            <span className="text-zinc-300 font-bold">42%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-[42%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-zinc-400">Tier 3: Business Logic (1.0x)</span>
            <span className="text-zinc-400">38%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-600/60 w-[38%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-zinc-500">Tier 1 & 2: Boilerplate (0.2x)</span>
            <span className="text-zinc-500">20%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-700 w-[20%]" />
          </div>
        </div>

        {/* Big bang anomaly alert */}
        <div className="rounded-lg bg-rose-950/40 border border-rose-500/30 p-1.5 flex items-center gap-2 text-[10px] text-rose-300">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
          <span className="truncate">Big Bang Spike: 3,400 LoC @ 03:14 AM</span>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500">
        <span>AST Nodes: 28,490</span>
        <span className="text-cyan-400 font-semibold">Flagged for Viva 🎯</span>
      </div>
    </div>
  );
}

export function EvidenceWallPreview() {
  return (
    <div className="h-full w-full flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-amber-400">
          <BarChart3 className="h-4 w-4" />
          <span className="font-bold tracking-wider">EVIDENCE WALL & DNA</span>
        </div>
        <span className="text-[10px] text-zinc-500">DVR Scrubber</span>
      </div>

      <div className="flex items-center justify-between gap-3 py-1">
        {/* Mini 5-Axis Radar Chart Visual */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background radar grid circles */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Spokes */}
            <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="50" y1="50" x2="88" y2="38" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="50" y1="50" x2="74" y2="82" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="50" y1="50" x2="26" y2="82" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="50" y1="50" x2="12" y2="38" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            {/* Authentic Builder DNA Polygon */}
            <polygon
              points="50,16 82,42 68,76 34,74 20,40"
              fill="rgba(245, 158, 11, 0.25)"
              stroke="#F59E0B"
              strokeWidth="1.8"
            />
          </svg>
          <span className="absolute text-[9px] font-bold text-amber-400">92%</span>
        </div>

        {/* Timeline DVR Scrubber */}
        <div className="flex-1 space-y-1.5">
          <div className="text-[10px] text-zinc-400">5-Axis Builder DNA</div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-200">
            <span className="text-amber-400 font-bold">Authentic Builder</span>
            <span className="text-[9px] text-zinc-500">(vs Passenger)</span>
          </div>

          <div className="rounded bg-black/60 border border-white/10 p-1.5">
            <div className="flex justify-between text-[9px] text-zinc-400 mb-1">
              <span>Day 01</span>
              <span className="text-amber-400 font-bold">DVR: Day 07</span>
              <span>Day 14</span>
            </div>
            <div className="relative h-1.5 w-full bg-zinc-800 rounded-full">
              <div className="h-full bg-amber-400 rounded-full w-[60%]" />
              <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Git Churn: Continuous</span>
        <span className="text-amber-400 font-semibold">Zero Passenger Signs ✓</span>
      </div>
    </div>
  );
}

export function AutonomousVivaPreview() {
  return (
    <div className="h-full w-full flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-rose-400">
          <Mic className="h-4 w-4" />
          <span className="font-bold tracking-wider">ORAL VIVA INTERROGATION</span>
        </div>
        <span className="text-[10px] text-rose-400 animate-pulse font-bold">● LIVE MIC</span>
      </div>

      <div className="space-y-2 py-1">
        {/* Code Snippet Targeted */}
        <div className="rounded bg-black/80 border border-white/10 p-2 text-[10px]">
          <div className="text-zinc-500 mb-1 flex justify-between">
            <span>src/cache/lru.ts:78</span>
            <span className="text-rose-400 font-semibold">TARGETED LINE</span>
          </div>
          <code className="text-emerald-300 block truncate">
            78: if (this.nodeCount &gt; this.capacity) this.evictTail();
          </code>
        </div>

        {/* Gemini Question */}
        <div className="rounded bg-rose-950/30 border border-rose-500/30 p-2 text-[10px]">
          <div className="text-rose-300 font-semibold mb-0.5">Gemini Interrogator:</div>
          <div className="text-zinc-300 text-[10px] italic">
            &ldquo;Why evict at the tail instead of head? Explain concurrency trade-offs.&rdquo;
          </div>
        </div>

        {/* Audio Waveform & Anti-Cheat */}
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="h-3 w-0.5 bg-emerald-400 animate-pulse" />
            <span className="h-4 w-0.5 bg-emerald-400 animate-pulse" style={{ animationDelay: "0.15s" }} />
            <span className="h-2 w-0.5 bg-emerald-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
            <span className="h-5 w-0.5 bg-emerald-400 animate-pulse" style={{ animationDelay: "0.1s" }} />
            <span className="h-3 w-0.5 bg-emerald-400 animate-pulse" style={{ animationDelay: "0.25s" }} />
            <span className="text-[9px] text-zinc-400 ml-1">Voice active</span>
          </div>
          <span className="text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            Paste: 0 events (Clean)
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Question 2 of 4</span>
        <span className="text-rose-400 font-semibold">Confidence: 96%</span>
      </div>
    </div>
  );
}

export function VerifiedReceiptPreview() {
  return (
    <div className="h-full w-full flex flex-col justify-between font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-bold tracking-wider">CRYPTOGRAPHIC RECEIPT</span>
        </div>
        <span className="text-[10px] text-zinc-500">SHA-256</span>
      </div>

      <div className="flex items-center gap-4 py-1">
        {/* Radial Score Gauge */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-zinc-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              strokeDasharray="94, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-lg font-black text-white">94</span>
            <span className="text-[8px] text-emerald-400 block -mt-1 font-bold">SCORE</span>
          </div>
        </div>

        {/* Thermal Receipt Details */}
        <div className="flex-1 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
            <CheckCircle2 className="h-3 w-3" />
            <span>VERIFIED BUILDER</span>
          </div>
          <div className="text-[9px] text-zinc-400">
            Protocol: <strong className="text-zinc-200">Hoollow v1.4</strong>
          </div>
          <div className="text-[8px] text-zinc-500 font-mono truncate">
            Hash: e3b0c44298fc1c149afbf4c8...
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
            <QrCode className="h-3.5 w-3.5 text-zinc-300" />
            <span>QR Scannable Diploma</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Torn-Edge Thermal Receipt</span>
        <span className="text-emerald-400 font-semibold">Proof of Work Locked 🛡️</span>
      </div>
    </div>
  );
}

export const FORENSIC_ARC_ITEMS: InteractiveListItem[] = [
  {
    client: "ACT 01 — Repo Ingestion",
    platform: "PHASE 01/05",
    services: "Commit graph traversal, noise cleaning, Levenshtein alias deduplication",
    preview: <RepoIngestionPreview />,
  },
  {
    client: "ACT 02 — Live Forensics",
    platform: "PHASE 02/05",
    services: "4-Tier AST complexity parsing & real-time Big Bang anomaly detection",
    preview: <LiveForensicsPreview />,
  },
  {
    client: "ACT 03 — Evidence Wall",
    platform: "PHASE 03/05",
    services: "Interactive DVR timeline scrubber + 5-axis Builder DNA radar chart",
    preview: <EvidenceWallPreview />,
  },
  {
    client: "ACT 04 — Autonomous Viva",
    platform: "PHASE 04/05",
    services: "Line-targeted Gemini interrogation with anti-cheat paste & audio analysis",
    preview: <AutonomousVivaPreview />,
  },
  {
    client: "ACT 05 — Verified Receipt",
    platform: "PHASE 05/05",
    services: "Radial score reveal + cryptographic thermal receipt scannable via QR",
    preview: <VerifiedReceiptPreview />,
  },
];
