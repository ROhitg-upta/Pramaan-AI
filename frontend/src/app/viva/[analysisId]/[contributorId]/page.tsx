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

  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<VivaEvaluationResponse | null>(
    null
  );

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        // 1. Fetch questions
        const vivaData = await getVivaQuestions(analysisId, contributorId, 3);
        if (isCurrent && vivaData.questions && vivaData.questions.length > 0) {
          setQuestions(vivaData.questions);
        }

        // 2. Fetch contributor info
        const report = await getAnalysisReport(analysisId);
        const match =
          report.contributors.find((c) => c.id === contributorId) ||
          mockFullReport.contributors.find((c) => c.id === contributorId) ||
          mockFullReport.contributors[1]; // fallback Aryan
        if (isCurrent) {
          setContributor(match);
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
    setIsEvaluating(true);
    try {
      const evalRes = await evaluateVivaAnswer(activeQuestion.id, answer);
      setEvaluationResult(evalRes);
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setEvaluationResult(null);
    }
  };

  const handleRetest = () => {
    setEvaluationResult(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-12 backdrop-blur-xl">
          <p className="font-mono text-sm text-zinc-400">
            Synthesizing line-targeted viva defense questions with Gemini Engine...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header & Navigation */}
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
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
              <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
              The Hot Seat: Autonomous Viva Defense
            </h1>
          </div>

          <p className="mt-1 font-mono text-xs text-emerald-400/90">
            &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo;
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
              <span
                className={`font-mono text-xs font-bold ${
                  contributor.pramaan_score && contributor.pramaan_score >= 75
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {contributor.pramaan_score ? `${contributor.pramaan_score}/100` : "IN TEST"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Split-Screen Viva Layout */}
      {activeQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel (6 of 12 cols): Evidence Code Diff Spotlight */}
          <div className="lg:col-span-6 min-h-[520px]">
            <EvidenceCodePanel
              question={activeQuestion}
              contributorName={contributor?.primary_name || "Contributor"}
            />
          </div>

          {/* Right Panel (6 of 12 cols): AI Examiner + Defense Input or Dial */}
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
              />
            ) : (
              <AuthenticityDial
                key={`dial-${evaluationResult.question_id}`}
                evaluation={evaluationResult}
                analysisId={analysisId}
                hasNextQuestion={currentQuestionIndex < questions.length - 1}
                onNextQuestion={handleNextQuestion}
                onRetest={handleRetest}
              />
            )}
          </div>
        </div>
      )}

      {/* 3. Hoollow Watermark Footer */}
      <div className="mt-12 rounded-xl border border-white/5 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-3">
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
  );
}
