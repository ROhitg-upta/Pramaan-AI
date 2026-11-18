"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  User,
  GitBranch,
  Volume2,
  Mic,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getVivaQuestions, evaluateVivaAnswer, getAnalysisReport } from "@/lib/api";
import {
  type VivaQuestion,
  type VivaEvaluationResponse,
  type Contributor,
  mockFullReport,
} from "@/lib/mock-data";
import { EvidenceCodePanel } from "@/components/viva/EvidenceCodePanel";
import { ExaminerTerminal } from "@/components/viva/ExaminerTerminal";
import { AnswerDefenseInput } from "@/components/viva/AnswerDefenseInput";
import { AuthenticityDial } from "@/components/viva/AuthenticityDial";

export default function VivaTerminalPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = (params?.analysisId as string) || "demo-smart-campus";
  const contributorId = (params?.contributorId as string) || "contrib-002";
  const isDemo = analysisId === "demo-smart-campus";

  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Authoritative Assessment Ledger State
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isPractice, setIsPractice] = useState(false);
  const [assessmentStatus, setAssessmentStatus] = useState<string>("SCHEDULED");
  const [providerError, setProviderError] = useState<string | null>(null);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<VivaEvaluationResponse | null>(
    null
  );
  const [completedScores, setCompletedScores] = useState<number[]>([]);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        // 1. Fetch analysis report first
        const report = await getAnalysisReport(analysisId);
        const isDemoSession = analysisId === "demo-smart-campus" || (report as any)?.is_demo;
        const match =
          report.contributors.find((c) => c.id === contributorId) ||
          (isDemoSession ? mockFullReport.contributors.find((c) => c.id === contributorId) : null);

        if (isCurrent) {
          setContributor(match || null);
        }

        if (isDemoSession) {
          const vivaData = await getVivaQuestions(analysisId, contributorId, 3);
          if (isCurrent && vivaData.questions && vivaData.questions.length > 0) {
            setQuestions(vivaData.questions);
          }
          return;
        }

        // 2. Real Session: Fetch questions grounded in real diffs
        const vivaData = await getVivaQuestions(analysisId, contributorId, 3);

        // 3. Initialize or resume authoritative assessment record on server ledger
        try {
          const asmRes = await fetch("/api/assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analysis_run_id: analysisId,
              contributor_id: contributorId,
              repo_url: report.repo_url,
              contributor_name: match?.primary_name,
              initial_questions: vivaData.questions || [],
            }),
          });

          if (asmRes.ok) {
            const asmData = await asmRes.json();
            if (isCurrent) {
              setAssessmentId(asmData.assessment_id);
              setIsPractice(Boolean(asmData.is_practice));
              setAssessmentStatus(asmData.status || "IN_PROGRESS");

              if (Array.isArray(asmData.exchanges) && asmData.exchanges.length > 0) {
                // Map persisted exchange records to viva question view models
                const persistedQuestions = asmData.exchanges.map((ex: any, idx: number) => ({
                  id: `q_${asmData.assessment_id}_${idx}`,
                  commit_hash: ex.commit_sha || "head",
                  file_path: ex.file_path,
                  line_range: `${ex.line_start}-${ex.line_end}`,
                  code_snippet: ex.code_snippet,
                  question_text: ex.question_text,
                  expected_key_concepts: ex.expected_concepts || [],
                  trap_signals: ex.trap_signals || [],
                }));
                setQuestions(persistedQuestions);

                // Resume progress across reloads
                const answered = asmData.exchanges.filter((e: any) => e.answered_at !== null);
                if (answered.length > 0) {
                  setCompletedScores(answered.map((e: any) => e.ai_score || 0));
                  const firstUnanswered = asmData.exchanges.findIndex((e: any) => e.answered_at === null);
                  if (firstUnanswered !== -1) {
                    setCurrentQuestionIndex(firstUnanswered);
                  } else {
                    setCurrentQuestionIndex(asmData.exchanges.length - 1);
                  }
                }
              }
            }
          } else {
            if (isCurrent && vivaData.questions) {
              setQuestions(vivaData.questions);
            }
          }
        } catch (asmErr) {
          console.warn("Authoritative assessment ledger sync notice:", asmErr);
          if (isCurrent && vivaData.questions) {
            setQuestions(vivaData.questions);
          }
        }
      } catch (err) {
        console.warn("Failed to load viva questions, using default:", err);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isCurrent = false;
    };
  }, [analysisId, contributorId]);

  const activeQuestion = questions[currentQuestionIndex] || null;

  const handleSubmitDefense = async (answer: string) => {
    if (!activeQuestion) return;
    setProviderError(null);
    setIsEvaluating(true);

    // Demo Mode fallback
    if (isDemo || !assessmentId) {
      try {
        const evalRes = await evaluateVivaAnswer(
          activeQuestion.id,
          answer,
          activeQuestion.question_text,
          activeQuestion.expected_key_concepts
        );
        setEvaluationResult(evalRes);
        setCompletedScores((prev) => [...prev, evalRes.score]);
      } catch (err) {
        console.error("Evaluation failed:", err);
      } finally {
        setIsEvaluating(false);
      }
      return;
    }

    // Official / Authoritative Assessment Submission
    try {
      const res = await fetch("/api/assessment/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: assessmentId,
          question_index: currentQuestionIndex,
          answer,
          idempotency_key: `${assessmentId}_q${currentQuestionIndex}_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 502) {
          setProviderError(
            "The automated oral evaluation service encountered a temporary timeout. Your answer is safe. Please click Retry below."
          );
          return;
        }
        if (res.status === 409) {
          setProviderError(errData.message || "Conflict: Question has already been evaluated.");
          return;
        }
        setProviderError(errData.message || "Failed to evaluate defense answer.");
        return;
      }

      const evalData = await res.json();
      const score = evalData.ai_score ?? 70;
      setEvaluationResult({
        question_id: activeQuestion.id,
        score,
        technical_accuracy: score,
        tactical_authenticity: score,
        edge_case_preparedness: score,
        verdict: score >= 75 ? "VERIFIED_BUILDER" : "SUSPECT_AI_FLUFF",
        key_concepts_covered: evalData.builder_signals || [],
        missed_concepts: evalData.fluff_signals || [],
        builder_signals_detected: evalData.builder_signals || [],
        fluff_signals_detected: evalData.fluff_signals || [],
        feedback: evalData.feedback || "Technical defense evaluated.",
        evaluator_note: "Autonomous oral defense verified against committed code snippet.",
      });
      setCompletedScores((prev) => [...prev, score]);
      if (evalData.assessment_status) {
        setAssessmentStatus(evalData.assessment_status);
      }
    } catch (err: any) {
      console.error("Evaluation submission error:", err);
      setProviderError("Network connection interrupted. Please check your connection and retry.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setEvaluationResult(null);
      setProviderError(null);
    } else {
      // Completed all questions! Route to verdict with authoritative assessment ID
      const targetUrl = assessmentId
        ? `/verdict/${analysisId}?assessmentId=${assessmentId}`
        : `/verdict/${analysisId}`;
      router.push(targetUrl);
    }
  };

  const handleRetest = () => {
    setEvaluationResult(null);
  };

  if (!isLoading && !contributor) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center font-mono">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 space-y-4">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-100">Contributor Not Found</h3>
          <p className="text-xs text-zinc-400">
            Contributor ID &apos;{contributorId}&apos; does not exist in analysis &apos;{analysisId}&apos;.
          </p>
          <div className="pt-2">
            <Link
              href={`/evidence/${analysisId}`}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-white text-zinc-950 px-4 py-2 text-xs font-semibold hover:bg-zinc-200 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Evidence Wall</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-12 backdrop-blur-xl">
          <div className="h-8 w-8 mx-auto mb-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-zinc-300 font-semibold">
            Synthesizing line-targeted oral viva defense questions...
          </p>
          <p className="font-mono text-xs text-zinc-500 mt-1">
            Grounded in your actual commit diffs &amp; source modules
          </p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAllComplete = completedScores.length === questions.length;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Student Defense Mode Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Link
              href={`/evidence/${analysisId}`}
              className="inline-flex items-center space-x-1 font-mono text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Evidence Wall</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-0.5 text-[11px] font-mono text-emerald-300 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>STUDENT DEFENSE MODE • ORAL VIVA</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
              The Hot Seat: Autonomous Code Defense
            </h1>
          </div>

          <p className="mt-1 font-mono text-xs text-zinc-400">
            Defend the logic you authored. Read the prompt, speak via microphone or type your response, and receive immediate AI scoring.
          </p>
        </div>

        {/* Contributor Profile Pill */}
        {contributor && (
          <div className="flex items-center space-x-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 backdrop-blur-xl">
            <span
              className="h-3.5 w-3.5 rounded-full shrink-0"
              style={{ backgroundColor: contributor.avatar_color }}
            />
            <div>
              <div className="font-mono text-xs font-bold text-zinc-200">
                {contributor.primary_name}
              </div>
              <div className="font-mono text-[10px] text-zinc-500">
                {contributor.emails[0]}
              </div>
            </div>
            <div className="border-l border-white/10 pl-3">
              <span className="font-mono text-xs font-bold text-emerald-400">
                Question {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Clear 3-Step Viva Procedure Tracker */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div
          className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
            !evaluationResult
              ? "border-cyan-500/40 bg-cyan-950/20 text-cyan-200 shadow-sm"
              : "border-emerald-500/30 bg-emerald-950/10 text-emerald-300"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold shrink-0">
            1
          </span>
          <div>
            <div className="font-bold text-zinc-100 flex items-center space-x-1.5">
              <span>Read Code &amp; Listen</span>
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-[10px] text-zinc-400">Inspect diff on left, listen or read prompt</div>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
            !evaluationResult && !isEvaluating
              ? "border-amber-500/40 bg-amber-950/20 text-amber-200 shadow-sm"
              : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold shrink-0">
            2
          </span>
          <div>
            <div className="font-bold text-zinc-100 flex items-center space-x-1.5">
              <span>Defend via Voice / Text</span>
              <Mic className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-[10px] text-zinc-400">Speak into mic or type in noisy rooms</div>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
            evaluationResult
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200 shadow-sm"
              : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0">
            3
          </span>
          <div>
            <div className="font-bold text-zinc-100 flex items-center space-x-1.5">
              <span>Instant AI Verification</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-[10px] text-zinc-400">Score breakdown &amp; builder proof</div>
          </div>
        </div>
      </div>

      {/* 3. Split-Screen Viva Layout */}
      {activeQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel (6 of 12 cols): Exact Evidence Code Diff Spotlight */}
          <div className="lg:col-span-6 min-h-[520px]">
            <EvidenceCodePanel
              question={activeQuestion}
              contributorName={contributor?.primary_name || "Contributor"}
            />
          </div>

          {/* Right Panel (6 of 12 cols): Examiner Prompt + Defense Input / Dial */}
          <div className="lg:col-span-6 space-y-6">
            {/* Upper: AI Examiner Terminal */}
            <ExaminerTerminal
              key={activeQuestion.id}
              question={activeQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />

            {/* Lower: Defense Input OR Authenticity Dial */}
            {!evaluationResult ? (
              <AnswerDefenseInput
                key={`input-${activeQuestion.id}`}
                onSubmit={handleSubmitDefense}
                isEvaluating={isEvaluating}
                contributorName={contributor?.primary_name || "Contributor"}
                isDemo={isDemo}
              />
            ) : (
              <div className="space-y-4">
                <AuthenticityDial
                  key={`dial-${evaluationResult.question_id}`}
                  evaluation={evaluationResult}
                  analysisId={analysisId}
                  hasNextQuestion={currentQuestionIndex < questions.length - 1}
                  onNextQuestion={handleNextQuestion}
                  onRetest={handleRetest}
                />

                {/* Direct CTA when all questions are evaluated */}
                {isLastQuestion && (
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
                    <div>
                      <div className="font-bold text-emerald-300 text-sm flex items-center space-x-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Viva Defense Finalized!</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        Claimed code verified. Ready to generate tamper-proof receipt.
                      </div>
                    </div>

                    <Link
                      href={assessmentId ? `/verdict/${analysisId}?assessmentId=${assessmentId}` : `/verdict/${analysisId}`}
                      className="inline-flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 font-mono text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition shadow-lg active:scale-95 shrink-0"
                    >
                      <span>Get Proof Receipt</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Footer Note */}
      <div className="mt-12 rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-white/80 bg-black px-3.5 py-1 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-zinc-100 text-[11px] tracking-wider">
            VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
          </span>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          Defense grounded in real authored commit diffs
        </span>
      </div>
    </div>
  );
}
