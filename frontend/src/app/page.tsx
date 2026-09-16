"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  ArrowRight,
  Sparkles,
  Zap,
  X,
  Play,
  CheckCircle2,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { analyzeRepo } from "@/lib/api";

export default function HoollowStyledLandingPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [isAuditing, setIsAuditing] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);

  const handleAudit = async (targetUrl = repoUrl) => {
    const urlToAnalyze = targetUrl.trim() || "https://github.com/demo/smart-campus-app";
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

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden flex flex-col justify-between">
      {/* 1. Main Hero Container */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Hoollow Ethos Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-4 py-1 text-xs font-mono text-purple-300 shadow-sm mb-6"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
            </motion.div>

            {/* Giant Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
            >
              Truth in <br />
              <span className="text-[#c084fc] drop-shadow-[0_0_35px_rgba(192,132,252,0.25)]">
                Building.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 font-body text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed"
            >
              The autonomous code verification engine for the new generation of builders. Where degrees don&apos;t define your skill — but your <span className="text-zinc-200 font-semibold">Proof of Work</span> does.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              {/* Primary White Button */}
              <button
                type="button"
                onClick={() => setShowInputModal(true)}
                className="group relative inline-flex items-center justify-center space-x-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[10px] font-mono font-bold">
                  P
                </div>
                <span>Audit Repository</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary Dark Outline Button */}
              <button
                type="button"
                onClick={handleExploreDemo}
                className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-zinc-950/60 px-6 py-3.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-white/40 hover:text-white hover:bg-zinc-900 active:scale-[0.98]"
              >
                <Zap className="h-4 w-4 text-[#c084fc]" />
                <span>Explore Live Demo</span>
              </button>
            </motion.div>

            {/* Live Stats Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-14 grid grid-cols-3 gap-6 sm:gap-10 border-t border-white/10 pt-8 w-full max-w-lg"
            >
              <div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  18.4K+
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  Lines Audited
                </div>
              </div>

              <div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  45+
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  Commits Mined
                </div>
              </div>

              <div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#c084fc] tracking-tight">
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
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* The Looping Pixel Art Team Video */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/80 max-w-[540px] w-full">
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
                <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
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
                WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.16)",
                color: "transparent",
                fontFamily: "var(--font-display, sans-serif)",
              }}
            >
              <span className="mx-6">Proof of Work &gt; Degree</span>
              <span className="mx-6 text-purple-500/40">•</span>
              <span className="mx-6">Har Code Ka Pramaan</span>
              <span className="mx-6 text-purple-500/40">•</span>
              <span className="mx-6">Zero AI Fluff</span>
              <span className="mx-6 text-purple-500/40">•</span>
              <span className="mx-6">Real Builders Only</span>
              <span className="mx-6 text-purple-500/40">•</span>
              <span className="mx-6">Autonomous Forensics</span>
              <span className="mx-6 text-purple-500/40">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Input Modal (Linear/Raycast Style Command Drawer) */}
      <AnimatePresence>
        {showInputModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
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
