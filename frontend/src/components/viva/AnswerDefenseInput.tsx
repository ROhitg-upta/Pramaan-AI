"use client";

import React, { useState } from "react";
import { Mic, MicOff, Send, Zap, Volume2, Sparkles, RefreshCw } from "lucide-react";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";

interface AnswerDefenseInputProps {
  onSubmit: (answer: string) => void;
  isEvaluating: boolean;
  contributorName: string;
}

const ARYAN_FLUFF_RESPONSE =
  "The useAuthContext hook automatically handles token refresh in the background using Firebase standard architecture.";

const ROHIT_BUILDER_RESPONSE =
  "I had to implement a Redis mutex lock with a 5-second TTL on line 45 because concurrent tab refreshes were causing race conditions and invalidating valid sessions.";

export function AnswerDefenseInput({
  onSubmit,
  isEvaluating,
  contributorName,
}: AnswerDefenseInputProps) {
  const [answerText, setAnswerText] = useState("");
  const { isListening, volume, frequencies, toggleListening, errorMessage: audioError } =
    useAudioAnalyser(32);

  const handlePreFill = (text: string) => {
    setAnswerText(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || isEvaluating) return;
    onSubmit(answerText.trim());
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* 1. Header & Live Demo Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h4 className="font-display text-sm font-bold text-zinc-100 flex items-center space-x-2">
            <span>Defend Implementation Logic</span>
          </h4>
          <p className="font-mono text-xs text-zinc-400">
            Candidate: <span className="text-zinc-200 font-semibold">{contributorName}</span>
          </p>
        </div>

        {/* ⚡ Judge Stage Demo Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePreFill(ARYAN_FLUFF_RESPONSE)}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition active:scale-95"
            title="Pre-fill Aryan's evasive response"
          >
            <Zap className="h-3 w-3 text-rose-400" />
            <span>⚡ Paste Aryan Fluff</span>
          </button>

          <button
            type="button"
            onClick={() => handlePreFill(ROHIT_BUILDER_RESPONSE)}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
            title="Pre-fill Rohit's authentic builder response"
          >
            <Zap className="h-3 w-3 text-emerald-400" />
            <span>⚡ Paste Rohit Builder</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* 2. Audio Soundwave Mode Bar */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/70 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={toggleListening}
              className={`inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-3.5 w-3.5" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="h-3.5 w-3.5 text-emerald-400" />
                  <span>🎙️ Speak Answer</span>
                </>
              )}
            </button>

            {audioError && (
              <span className="font-mono text-[11px] text-amber-400">
                {audioError}
              </span>
            )}
          </div>

          {/* SVG Real-time Soundwave Spectrum */}
          <div className="flex items-center space-x-1 h-6 w-full sm:w-48 justify-center sm:justify-end">
            {frequencies.slice(0, 24).map((f, i) => {
              const height = isListening
                ? Math.max(3, Math.round(f * 24))
                : 3;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isListening
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                      : "bg-zinc-800"
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* 3. Textarea Defense Input */}
        <div className="relative">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Explain your architectural reasoning, concurrency constraints, or failure handling for the highlighted code lines..."
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        {/* 4. Submission Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-zinc-500">
            Pramaan evaluates technical accuracy, tactical authenticity, and edge-case preparedness.
          </span>

          <button
            type="submit"
            disabled={!answerText.trim() || isEvaluating}
            className="inline-flex items-center space-x-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white px-5 py-2.5 font-mono text-xs font-semibold disabled:opacity-40 transition shadow-lg active:scale-95"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-950" />
                <span>Evaluating Defense...</span>
              </>
            ) : (
              <>
                <span>Submit Viva Defense</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
