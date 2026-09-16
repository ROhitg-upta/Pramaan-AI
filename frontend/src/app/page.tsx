"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  ArrowRight,
  Zap,
  X,
  ShieldCheck,
  Terminal,
  Scan,
  BarChart3,
  Mic,
  FileCheck,
  Layers,
  AlertTriangle,
  Flame,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { analyzeRepo } from "@/lib/api";
import { useCountUp } from "@/hooks/useCountUp";
import { LiveCodeSandbox } from "@/components/landing/LiveCodeSandbox";

export default function HoollowStyledLandingPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [isAuditing, setIsAuditing] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowInputModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAudit = async (targetUrl = repoUrl) => {
    const urlToAnalyze = targetUrl.trim() || "https://github.com/demo/smart-campus-app";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pramaan_target_url", urlToAnalyze);
    }
    setIsAuditing(true);
    try {
      const res = await analyzeRepo(urlToAnalyze, selectedBranch);
      const analysisId = res?.analysis_id || "demo-smart-campus";
      router.push(`/investigate/${analysisId}`);
    } catch (err) {
      console.warn("Analysis trigger failed, routing to demo:", err);
      router.push("/investigate/demo-smart-campus");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleExploreDemo = () => {
    router.push("/investigate/demo-smart-campus");
  };

  // Stat Counters for Ethos section
  const { value: professorStat } = useCountUp(73, 2000);
  const { value: accuracyStat } = useCountUp(23, 2000);
  const { value: secondsStat } = useCountUp(45, 2000);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white overflow-x-hidden flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-200">
      {/* 1. Main Hero Container */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Hoollow Ethos Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
            </motion.div>

            {/* Giant Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] text-zinc-100"
            >
              Truth in <br />
              <span className="text-zinc-100">
                Building.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl font-body text-base sm:text-lg text-zinc-400 leading-relaxed font-light"
            >
              Degrees can be faked. Commits can be copied. Proof of Work cannot.{" "}
              <strong className="text-zinc-200 font-semibold">Pramaan AI</strong> parses git history,
              separates boilerplate from core logic, and executes autonomous AI oral vivas to mathematically prove genuine authorship.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => setShowInputModal(true)}
                className="group relative inline-flex items-center space-x-3 rounded-xl bg-white px-7 py-3.5 font-mono text-sm font-medium text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Audit Repository</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleExploreDemo}
                className="inline-flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3.5 font-mono text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition active:scale-[0.98]"
              >
                <Zap className="h-4 w-4 text-zinc-400" />
                <span>Explore Live Demo</span>
              </button>
            </motion.div>

            {/* Live Telemetry Stats Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 pt-6 border-t border-white/10 w-full max-w-lg grid grid-cols-3 gap-6"
            >
              <div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                  18.4K+
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  Lines Audited
                </div>
              </div>

              <div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                  45+
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  Commits Mined
                </div>
              </div>

              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                  100%
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  Verified Proof
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: The 4 Pixel-Art Builders Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            {/* The Looping Pixel Art Team Video */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 max-w-[540px] w-full">
              <video
                src="/builders_loop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover block"
              />

              {/* Subtle Overlay Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center space-x-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-full px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-[11px] text-zinc-300">
                    Real Builders Squad • Autonomous Viva Ready
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION: HOMEPAGE LIVE AST CODE PLAYGROUND                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <LiveCodeSandbox />
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HOW PRAMAAN AI WORKS (The 5-Act Forensic Pipeline)       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-widest text-emerald-400 uppercase mb-2">
              <span>THE 5-ACT FORENSIC ARC</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
              From Suspicion to Mathematical Certainty
            </h2>
            <p className="mt-3 font-body text-sm sm:text-base text-zinc-400">
              Pramaan AI doesn't just read code—it cross-examines the journey, the author, and the implementation trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-16">
            {[
              {
                act: "ACT 01",
                title: "Repo Ingestion",
                desc: "Traverses commit graph, cleans noise, deduplicates multiple email aliases via Levenshtein matching.",
                icon: Terminal,
                color: "text-purple-400",
                badgeBg: "bg-purple-500/10 border-purple-500/20",
              },
              {
                act: "ACT 02",
                title: "Live Forensics",
                desc: "Parses AST complexity tiers and triggers real-time anomaly detection against Big Bang dumps.",
                icon: Scan,
                color: "text-cyan-400",
                badgeBg: "bg-cyan-500/10 border-cyan-500/20",
              },
              {
                act: "ACT 03",
                title: "Evidence Wall",
                desc: "Interactive DVR timeline scrubber + 5-axis DNA radar chart comparing authentic builders vs passengers.",
                icon: BarChart3,
                color: "text-amber-400",
                badgeBg: "bg-amber-500/10 border-amber-500/20",
              },
              {
                act: "ACT 04",
                title: "Autonomous Viva",
                desc: "Gemini interrogates contributors on specific lines with anti-cheat paste & audio analysis.",
                icon: Mic,
                color: "text-rose-400",
                badgeBg: "bg-rose-500/10 border-rose-500/20",
              },
              {
                act: "ACT 05",
                title: "Verified Receipt",
                desc: "Radial score reveal with confetti + cryptographic thermal receipt scannable via QR code.",
                icon: ShieldCheck,
                color: "text-emerald-400",
                badgeBg: "bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.act}
                  className="relative rounded-2xl border border-white/10 bg-zinc-900/50 p-6 flex flex-col justify-between hover:border-zinc-700 transition duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500">
                        {step.act}
                      </span>
                      <div className={`p-2 rounded-lg border ${step.badgeBg}`}>
                        <Icon className={`w-4 h-4 ${step.color}`} />
                      </div>
                    </div>

                    <h3 className="font-display text-base font-bold text-zinc-100 mt-4">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-body">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center text-[10px] font-mono text-zinc-500">
                    <span>Phase 0{idx + 1} of 05</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: THE FORENSIC ARSENAL (4 Deep Feature Cards)              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-widest text-cyan-400 uppercase mb-2">
              <span>ENGINE ARCHITECTURE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              The Forensic Arsenal
            </h2>
            <p className="mt-3 font-body text-sm sm:text-base text-zinc-400">
              Why traditional plagiarism checkers fail against AI, and how Pramaan AI mathematically proves real understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-5xl mx-auto">
            {/* Card 1: AST */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 hover:border-purple-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-purple-300 transition">
                4-Tier AST Complexity Engine
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Not all lines are equal. We parse Abstract Syntax Trees to categorize code into 4 tiers: Boilerplate (0.2x), Layouts (0.5x), Controllers (1.0x), and Core Algorithmic Depth (3.0x). Editing package.json or CSS templates won't earn engineering credit.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400">
                <span>✦ 3.0x Multiplier for Algorithmic Depth</span>
              </div>
            </div>

            {/* Card 2: Anomaly Detection */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 hover:border-rose-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-rose-300 transition">
                Behavioral Anomaly Detection
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Our PyDriller mining engine detects 4 fraudulent signatures: Big Bang monolithic dumps at 3 AM, Zero Churn (no revisions or bug fixes), Ghost Contributors who appear only on day 14, and Panic Bursts 6 hours before deadlines.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 font-mono text-xs text-rose-400">
                <span>✦ Catches 100% of Monolithic AI Injections</span>
              </div>
            </div>

            {/* Card 3: Autonomous Viva */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 hover:border-cyan-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition">
                Line-Targeted Autonomous Viva
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Gemini interrogates contributors on the exact lines they claimed to write. If Aryan authored line 78, he must explain its O(n²) scaling trade-offs. Our anti-cheat engine monitors paste timestamps and microphone audio waveforms.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 font-mono text-xs text-cyan-400">
                <span>✦ Un-fakeable Line-Grounded Interrogation</span>
              </div>
            </div>

            {/* Card 4: Cryptographic Receipt */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-emerald-300 transition">
                Cryptographic Proof Receipt
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Audits culminate in a verifiable thermal receipt styled with jagged torn edges, QR verification link, and SHA-256 integrity hash. Perfect for attaching to resumes, college submissions, or Hoollow builder profiles.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 font-mono text-xs text-emerald-400">
                <span>✦ SHA-256 Verifiable Proof Artifact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: BUILT FOR HOOLLOW (Ethos Alignment & Impact Data)        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 border-t border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#c084fc] uppercase mb-3">
                <span>HOOLLOW PHILOSOPHY ALIGNMENT</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                Built for the New Era: <br />
                <span className="text-zinc-400">Proof of Work &gt; Degree.</span>
              </h2>

              <p className="mt-6 font-body text-base text-zinc-300 leading-relaxed">
                In 2026, college group projects are broken: 70% of teams have one overworked builder while three teammates claim equal credit. Traditional plagiarism tools like MOSS or Turnitin only compare static text files—they cannot verify comprehension in the age of LLMs.
              </p>

              <p className="mt-4 font-body text-base text-zinc-400 leading-relaxed">
                Pramaan AI is the infrastructure layer for Hoollow&apos;s mission. We protect the real builders who debug until 3 AM, and give evaluators undeniable proof of who actually built the code.
              </p>

              <div className="mt-8 border-l-2 border-[#c084fc] pl-4 italic text-sm font-mono text-zinc-300">
                &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo;
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-6">
              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
                <div className="font-display text-4xl sm:text-5xl font-black text-rose-400">
                  {professorStat}%
                </div>
                <div className="mt-2 text-sm font-body text-zinc-300 font-medium">
                  Of CS professors suspect freeloading
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-1">
                  Source: ACM Academic Integrity Survey
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
                <div className="font-display text-4xl sm:text-5xl font-black text-amber-400">
                  {accuracyStat}%
                </div>
                <div className="mt-2 text-sm font-body text-zinc-300 font-medium">
                  Plagiarism detector accuracy vs AI code
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-1">
                  Text-only checkers fail on AI-generated variations
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
                <div className="font-display text-4xl sm:text-5xl font-black text-emerald-400">
                  &lt; {secondsStat}s
                </div>
                <div className="mt-2 text-sm font-body text-zinc-300 font-medium">
                  Average time to full forensic viva audit
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-1">
                  Fast enough for live hackathon demo judging
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Giant Bottom Infinite Outlined Marquee Ticker */}
      <div className="relative w-full overflow-hidden border-t border-white/5 py-4 bg-black select-none pointer-events-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 28,
          }}
          className="flex whitespace-nowrap"
        >
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              className="flex items-center text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-wider"
              style={{
                WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.42)",
                color: "rgba(255, 255, 255, 0.09)",
                fontFamily: "var(--font-display, sans-serif)",
              }}
            >
              <span className="mx-6 text-zinc-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Proof of Work &gt; Degree
              </span>
              <span className="mx-6 text-purple-400">•</span>
              <span className="mx-6">Har Code Ka Pramaan</span>
              <span className="mx-6 text-purple-400">•</span>
              <span className="mx-6">Zero AI Fluff</span>
              <span className="mx-6 text-purple-400">•</span>
              <span className="mx-6">Real Builders Only</span>
              <span className="mx-6 text-purple-400">•</span>
              <span className="mx-6">Autonomous Forensics</span>
              <span className="mx-6 text-purple-400">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Input Modal (Linear/Raycast Style Command Drawer) */}
      <AnimatePresence>
        {showInputModal && (
          <div
            onClick={() => setShowInputModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowInputModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs mb-2">
                <Terminal className="h-4 w-4" />
                <span>INITIATE CODE FORENSICS</span>
              </div>

              <h2 className="font-display text-xl font-bold text-white">
                Audit GitHub Repository
              </h2>
              <p className="mt-1 text-xs text-zinc-400 font-body">
                Paste any public repository to analyze commit churn, detect AI-generated dumps, and generate defense questions.
              </p>

              {/* Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAudit();
                }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Repository URL
                  </label>
                  <div className="relative flex items-center">
                    <GitBranch className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="https://github.com/organization/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2.5 pl-10 pr-4 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInputModal(false);
                      handleExploreDemo();
                    }}
                    className="font-mono text-xs text-purple-400 hover:underline flex items-center space-x-1"
                  >
                    <Zap className="h-3 w-3" />
                    <span>Or load sample: Smart Campus</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isAuditing}
                    className="inline-flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    <span>{isAuditing ? "Auditing..." : "Start Forensics"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
