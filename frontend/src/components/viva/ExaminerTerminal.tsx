"use client";

import React, { useState } from "react";
import { Terminal, Sparkles, AlertCircle, HelpCircle, ShieldAlert, Volume2, VolumeX } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { type VivaQuestion } from "@/lib/mock-data";

interface ExaminerTerminalProps {
  question: VivaQuestion;
  questionIndex: number;
  totalQuestions: number;
  onTypewriterComplete?: () => void;
}

export function ExaminerTerminal({
  question,
  questionIndex,
  totalQuestions,
  onTypewriterComplete,
}: ExaminerTerminalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Cinematic typewriter streaming of question
  const { displayedText, isComplete, cursorVisible } = useTypewriter(
    question.question_text,
    {
      speed: 16,
      delay: 150,
      onComplete: onTypewriterComplete,
    }
  );

  const handleSpeakQuestion = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.question_text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Hard":
        return (
          <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-rose-400">
            DIFFICULTY: HARD
          </span>
        );
      case "Medium":
        return (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
            DIFFICULTY: MEDIUM
          </span>
        );
      default:
        return (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            DIFFICULTY: STANDARD
          </span>
        );
    }
  };

  const getCategoryBadge = (cat: string) => {
    return (
      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-400">
        CATEGORY: {cat.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* 1. Terminal Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 border border-white/10 text-emerald-400">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Pramaan AI Examiner Terminal
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="font-mono text-[10px] text-zinc-500">
              Autonomous Viva Interrogation Engine
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="rounded-lg bg-zinc-950 border border-white/5 px-2.5 py-1 text-zinc-400">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          {getDifficultyBadge(question.difficulty)}
          {getCategoryBadge(question.category)}
        </div>
      </div>

      {/* 2. Streaming Question Prompt */}
      <div className="mt-5 rounded-xl border border-white/5 bg-zinc-950/80 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3 flex-1">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="font-mono text-sm leading-relaxed text-zinc-100">
              <span>{displayedText}</span>
              {(!isComplete || cursorVisible) && (
                <span className="inline-block w-2 h-4 ml-1 align-middle bg-emerald-400 animate-pulse" />
              )}
            </div>
          </div>

          {/* Audio Listen Aloud Toggle */}
          <button
            type="button"
            onClick={handleSpeakQuestion}
            className="shrink-0 inline-flex items-center space-x-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-xs font-mono text-emerald-400 hover:bg-emerald-900/40 transition active:scale-95 shadow-sm"
            title="Listen to question spoken aloud"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                <span className="text-rose-300">Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Listen Aloud</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Expected Rubric Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 font-mono text-[11px]">
        <span className="text-zinc-500">Targeted Concepts:</span>
        {question.expected_key_concepts?.map((concept, idx) => (
          <span
            key={idx}
            className="rounded-md border border-white/10 bg-zinc-900/90 px-2 py-0.5 text-zinc-300"
          >
            #{concept}
          </span>
        ))}
      </div>
    </div>
  );
}
