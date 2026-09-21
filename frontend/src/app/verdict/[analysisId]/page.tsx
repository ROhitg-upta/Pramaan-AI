"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, FastForward, ShieldAlert, CheckCircle, Sparkles } from "lucide-react";
import { getAnalysisReport } from "@/lib/api";
import { type FullReportResponse, mockFullReport } from "@/lib/mock-data";
import { useTypewriter } from "@/hooks/useTypewriter";
import { ScoreRevealCircle } from "@/components/verdict/ScoreRevealCircle";
import { SubScoreBreakdown } from "@/components/verdict/SubScoreBreakdown";
import { ExecutiveSummary } from "@/components/verdict/ExecutiveSummary";
import { fireBuilderConfetti } from "@/components/verdict/ConfettiBurst";
import { ThermalReceipt } from "@/components/receipt/ThermalReceipt";
import { ExportActions } from "@/components/receipt/ExportActions";
import { ForensicGridBg } from "@/components/layout/ForensicGridBg";

export default function VerdictPage() {
  const params = useParams();
  const analysisId = (params?.analysisId as string) || "demo-smart-campus";

  const [report, setReport] = useState<FullReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cinematic sequence phase:
  // 'darkness' -> 'title' -> 'scores' -> 'subscores' -> 'summary' -> 'receipt'
  const [revealPhase, setRevealPhase] = useState<
    "darkness" | "title" | "scores" | "subscores" | "summary" | "receipt"
  >("darkness");

  const [showRedVignette, setShowRedVignette] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Typewriter title for "⚖️ THE VERDICT"
  const { displayedText: titleText } = useTypewriter("⚖️ THE VERDICT", {
    speed: 60,
    delay: 800,
  });

  // Fetch report data on mount
  useEffect(() => {
    async function loadReport() {
      try {
        const data = await getAnalysisReport(analysisId);
        setReport(data);
      } catch (err) {
        console.warn("Failed to fetch report, falling back to mock:", err);
        setReport(mockFullReport);
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [analysisId]);

  // Timed Cinematic Sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealPhase("title"), 700),
      setTimeout(() => setRevealPhase("scores"), 2600),
      setTimeout(() => setRevealPhase("subscores"), 5200),
      setTimeout(() => setRevealPhase("summary"), 7400),
      setTimeout(() => setRevealPhase("receipt"), 10500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Fast forward to show full verdict immediately
  const handleFastForward = () => {
    setRevealPhase("receipt");
    if (!hasTriggeredConfetti) {
      fireBuilderConfetti();
      setHasTriggeredConfetti(true);
    }
  };

  const handleScoreComplete = (score: number) => {
    if (score >= 85 && !hasTriggeredConfetti) {
      fireBuilderConfetti();
      setHasTriggeredConfetti(true);
    }
    if (score < 35) {
      setShowRedVignette(true);
      setTimeout(() => setShowRedVignette(false), 1400);
    }
  };

  const currentReport = report || mockFullReport;

  // Filter primary contributors to compare (e.g., Rohit & Aryan)
  const primaryContributors = currentReport.contributors.slice(0, 2);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white flex flex-col items-center justify-start pt-16 pb-36 px-4 sm:px-6 overflow-x-hidden select-none">
      {/* Background forensic grid */}
      <ForensicGridBg />

      {/* Red Vignette Alarm Flash for anomalous / freeloader scores */}
      <AnimatePresence>
        {showRedVignette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(239, 68, 68, 0.18) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Top Controls Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-20 mb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ACT 5 • FINAL FORENSIC VERDICT</span>
        </div>

        {revealPhase !== "receipt" && (
          <button
            onClick={handleFastForward}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Fast Forward</span>
          </button>
        )}
      </div>

      {/* Phase 2: Title & Briefing */}
      <div className="text-center z-10 max-w-2xl mx-auto min-h-[110px]">
        {revealPhase !== "darkness" && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white flex items-center justify-center gap-3">
              <span>{titleText}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-zinc-400 text-sm sm:text-base font-mono mt-3"
            >
              Auditing Repository:{" "}
              <span className="text-zinc-200 font-semibold underline decoration-zinc-700">
                {currentReport.repo_url.replace("https://github.com/", "")}
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-1.5 text-xs font-mono text-zinc-500"
            >
              ID: PRM-2026-{analysisId.slice(0, 8).toUpperCase()} • {currentReport.total_commits} Commits Mined • {currentReport.total_lines_audited.toLocaleString()} Lines Audited
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Phase 3 & 4: Contributor Score Reveal & Sub-scores */}
      {revealPhase !== "darkness" && revealPhase !== "title" && (
        <div className="w-full max-w-4xl mx-auto mt-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start justify-center">
            {primaryContributors.map((contrib, idx) => {
              const score = contrib.pramaan_score ?? 50;
              const color =
                score >= 70 ? "emerald" : score >= 40 ? "amber" : "crimson";

              return (
                <div
                  key={contrib.id}
                  className="flex flex-col items-center bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl"
                >
                  <ScoreRevealCircle
                    score={score}
                    name={contrib.primary_name}
                    verdict={contrib.verdict}
                    color={color}
                    delay={idx * 0.4}
                    onAnimationComplete={() => handleScoreComplete(score)}
                  />

                  {/* Sub-Score Breakdown (Phase 4) */}
                  {["subscores", "summary", "receipt"].includes(revealPhase) && (
                    <SubScoreBreakdown
                      gitForensics={contrib.sub_scores.git_forensics}
                      astComplexity={contrib.sub_scores.ast_complexity}
                      vivaDefense={contrib.sub_scores.viva_defense ?? (score >= 70 ? 98 : 24)}
                      delay={idx * 0.3}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 5: Executive Forensic Summary */}
      {["summary", "receipt"].includes(revealPhase) && (
        <div className="w-full z-10">
          <ExecutiveSummary
            text={
              currentReport.executive_summary ||
              "Rohit Sharma is the primary architect of this project, authoring 92% of Tier-3 algorithmic logic across 41 atomic commits spanning 14 days of consistent development. Aryan Kumar's sole contribution — a single commit of 4,821 lines at 03:42 AM with zero deletions — exhibits 98% structural similarity to a public tutorial."
            }
            delay={200}
          />
        </div>
      )}

      {/* Phase 6: Torn-Edge Digital Thermal Receipt & Action Buttons */}
      {revealPhase === "receipt" && (
        <div className="w-full z-10 flex flex-col items-center">
          <ThermalReceipt report={currentReport} />
          <ExportActions analysisId={analysisId} />

          {/* Standardized Hoollow Proof of Work Watermark Footer */}
          <div className="mt-12 w-full max-w-xl rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-3">
            <div className="inline-flex items-center space-x-2 rounded-full border border-white/80 bg-black px-3.5 py-1 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-zinc-100 text-[11px] tracking-wider">
                VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
              </span>
            </div>
            <a
              href="https://hoollow.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition inline-flex items-center space-x-1"
            >
              <span>Export to Hoollow Profile</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
