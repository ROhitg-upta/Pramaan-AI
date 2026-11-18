"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, FastForward, ShieldAlert, CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
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

function VerdictPageContent() {
  const params = useParams();
  const analysisId = (params?.analysisId as string) || "demo-smart-campus";
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const [report, setReport] = useState<FullReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cinematic sequence phase:
  // 'darkness' -> 'title' -> 'scores' -> 'subscores' -> 'summary' -> 'receipt'
  const [revealPhase, setRevealPhase] = useState<
    "darkness" | "title" | "scores" | "subscores" | "summary" | "receipt"
  >("darkness");

  const [showRedVignette, setShowRedVignette] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Typewriter title for "⚖️ THE VERDICT"
  const { displayedText: titleText } = useTypewriter("⚖️ THE VERDICT", {
    speed: 40,
    delay: 200,
  });

  // Fetch report data on mount
  useEffect(() => {
    async function loadReport() {
      try {
        const data = await getAnalysisReport(analysisId);

        // If an authoritative assessment was completed, merge persisted ledger scores
        if (assessmentId) {
          try {
            const asmRes = await fetch(`/api/assessment?id=${encodeURIComponent(assessmentId)}`);
            if (asmRes.ok) {
              const asmData = await asmRes.json();
              if (asmData?.scores) {
                data.contributors = data.contributors.map((c) => {
                  if (c.id === asmData.contributor_id || data.contributors.length === 1) {
                    const isCompleted = asmData.status === "COMPLETED";
                    const finalScore = isCompleted ? asmData.scores.final_pramaan : null;
                    return {
                      ...c,
                      sub_scores: {
                        git_forensics: asmData.scores.git_forensics ?? c.sub_scores.git_forensics,
                        ast_complexity: asmData.scores.complexity ?? c.sub_scores.ast_complexity,
                        viva_defense: isCompleted ? asmData.scores.viva_defense : null,
                      },
                      pramaan_score: finalScore,
                      verdict: isCompleted
                        ? (finalScore >= 75 ? "VERIFIED_BUILDER" : "SUSPECT_FREELOADER")
                        : "PENDING_ASSESSMENT",
                    };
                  }
                  return c;
                });
              }
            }
          } catch (asmErr) {
            console.warn("Authoritative assessment score fetch notice:", asmErr);
          }
        }

        setReport(data);
      } catch (err: any) {
        console.error("Failed to fetch report for verdict:", err);
        setError(err.message || "Failed to load audit report.");
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [analysisId]);

  // Timed Cinematic Sequence (Fast, responsive timing)
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealPhase("title"), 300),
      setTimeout(() => setRevealPhase("scores"), 1000),
      setTimeout(() => setRevealPhase("subscores"), 1800),
      setTimeout(() => setRevealPhase("summary"), 2400),
      setTimeout(() => setRevealPhase("receipt"), 3000),
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
    if (score >= 80 && !hasTriggeredConfetti) {
      fireBuilderConfetti();
      setHasTriggeredConfetti(true);
    }
    if (score < 35) {
      setShowRedVignette(true);
      setTimeout(() => setShowRedVignette(false), 1400);
    }
  };

  if (!isLoading && !report) {
    return (
      <div className="relative min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-4 font-mono">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 max-w-md text-center space-y-4">
          <ShieldAlert className="h-8 w-8 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-100">Report Unavailable</h3>
          <p className="text-xs text-zinc-400">
            {error || `Unable to load forensic report for analysis '${analysisId}'.`}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 rounded-xl bg-white text-zinc-950 px-4 py-2 text-xs font-semibold hover:bg-zinc-200 transition"
            >
              <span>Audit Another Repository</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentReport = report!;
  const isDemo = analysisId === "demo-smart-campus" || (currentReport as any).is_demo;

  // Render primary contributors (up to 4 in grid)
  const displayContributors = currentReport.contributors.slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white flex flex-col items-center justify-start pt-12 pb-36 px-4 sm:px-6 overflow-x-hidden select-none">
      {/* Background forensic grid */}
      <ForensicGridBg />

      {/* Red Vignette Alarm Flash for anomalous scores */}
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
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 z-20 mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3 text-xs font-mono">
          <Link
            href={`/evidence/${analysisId}`}
            className="inline-flex items-center space-x-1.5 text-zinc-400 hover:text-zinc-200 transition border border-white/10 bg-zinc-900/60 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Evidence Wall</span>
          </Link>
          <span className="text-zinc-600">/</span>
          {isDemo ? (
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-[11px] font-mono font-bold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO DATA • SMART CAMPUS SAMPLE</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 text-[11px] font-mono font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>VERIFIED AUDIT • REAL REPOSITORY</span>
            </div>
          )}
        </div>

        {revealPhase !== "receipt" && (
          <button
            onClick={handleFastForward}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition shadow-sm"
          >
            <FastForward className="w-3.5 h-3.5 text-emerald-400" />
            <span>Show Full Receipt Instantly</span>
          </button>
        )}
      </div>

      {/* Title & Briefing */}
      <div className="text-center z-10 max-w-2xl mx-auto min-h-[90px]">
        {revealPhase !== "darkness" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white flex items-center justify-center gap-3">
              <span>{titleText}</span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-2">
              Audited Repository:{" "}
              <span className="text-zinc-200 font-semibold underline decoration-zinc-700">
                {currentReport.repo_url.replace("https://github.com/", "")}
              </span>
            </p>

            <div className="mt-1 text-[11px] font-mono text-zinc-500">
              ID: PRM-{analysisId.slice(0, 10).toUpperCase()} • {currentReport.total_commits} Commits Mined • {currentReport.total_lines_audited.toLocaleString()} Lines Audited
            </div>
          </motion.div>
        )}
      </div>

      {/* Contributor Score Reveal & Sub-scores */}
      {revealPhase !== "darkness" && revealPhase !== "title" && (
        <div className="w-full max-w-5xl mx-auto mt-6 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start justify-center">
            {displayContributors.map((contrib, idx) => {
              const score = contrib.pramaan_score ?? 50;
              const color =
                score >= 70 ? "emerald" : score >= 45 ? "amber" : "crimson";

              return (
                <div
                  key={contrib.id}
                  className="flex flex-col items-center bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
                >
                  <ScoreRevealCircle
                    score={score}
                    name={contrib.primary_name}
                    verdict={contrib.verdict}
                    color={color}
                    delay={idx * 0.2}
                    onAnimationComplete={() => handleScoreComplete(score)}
                  />

                  {/* Sub-Score Breakdown */}
                  {["subscores", "summary", "receipt"].includes(revealPhase) && (
                    <SubScoreBreakdown
                      gitForensics={contrib.sub_scores.git_forensics}
                      astComplexity={contrib.sub_scores.ast_complexity}
                      vivaDefense={contrib.sub_scores.viva_defense ?? null}
                      delay={idx * 0.2}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Executive Forensic Summary */}
      {["summary", "receipt"].includes(revealPhase) && (
        <div className="w-full z-10 mt-6 max-w-4xl mx-auto">
          <ExecutiveSummary
            text={
              currentReport.executive_summary ||
              "Audit verification completed. Contributor attribution derived from chronological commit graph analysis and AST complexity weighting."
            }
            delay={100}
          />
        </div>
      )}

      {/* Digital Thermal Receipt & Action Buttons */}
      {revealPhase === "receipt" && (
        <div className="w-full z-10 flex flex-col items-center mt-6">
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
            <span className="text-zinc-500 text-xs">
              {isDemo ? "Demonstration Case Receipt" : "Authenticated Ledger Verification Record"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerdictPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center font-mono text-xs text-zinc-400">
        Loading verdict ledger...
      </div>
    }>
      <VerdictPageContent />
    </React.Suspense>
  );
}
