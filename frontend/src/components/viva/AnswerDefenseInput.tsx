"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Zap, Volume2, Sparkles, Keyboard, Check, AlertCircle } from "lucide-react";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";

interface AnswerDefenseInputProps {
  onSubmit: (answer: string) => void;
  isEvaluating: boolean;
  contributorName: string;
}

const ARYAN_FLUFF_RESPONSE =
  "We followed standard industry design patterns and used best practices so the code is modular, reliable, and clean.";

const ROHIT_BUILDER_RESPONSE =
  "I added custom retry handling with exponential backoff for GitHub 202 status codes because contributor stats compute asynchronously, and passed the auth token header to guarantee 5,000 req/hr.";

export function AnswerDefenseInput({
  onSubmit,
  isEvaluating,
  contributorName,
}: AnswerDefenseInputProps) {
  const [answerText, setAnswerText] = useState("");
  const [inputMode, setInputMode] = useState<"both" | "mic" | "text">("both");
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);

  const { isListening, volume, frequencies, toggleListening, errorMessage: audioError } =
    useAudioAnalyser(32);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition API if supported by browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setAnswerText((prev) => {
              const cleaned = prev.trim();
              if (cleaned.endsWith(currentTranscript.trim())) return prev;
              return cleaned ? `${cleaned} ${currentTranscript.trim()}` : currentTranscript.trim();
            });
            setSpeechStatus("Transcribing voice input...");
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition notice:", e.error);
          if (e.error === "no-speech") {
            setSpeechStatus("No voice detected. You can type directly below.");
          } else if (e.error === "not-allowed") {
            setSpeechStatus("Microphone access blocked. Please type your defense below.");
          }
        };

        recognition.onend = () => {
          setSpeechStatus(null);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore
      }
    };
  }, []);

  const handleToggleVoice = () => {
    toggleListening();
    if (!isListening) {
      try {
        recognitionRef.current?.start();
        setSpeechStatus("Listening... speak your defense answer now.");
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
      }
    } else {
      try {
        recognitionRef.current?.stop();
        setSpeechStatus(null);
      } catch {
        // Ignore
      }
    }
  };

  const handlePreFill = (text: string) => {
    setAnswerText(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || isEvaluating) return;
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore
    }
    onSubmit(answerText.trim());
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl">
      {/* 1. Header & Live Demo Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h4 className="font-display text-sm font-bold text-zinc-100 flex items-center space-x-2">
            <span>Step 2: Submit Defense Answer</span>
          </h4>
          <p className="font-mono text-xs text-zinc-400">
            Candidate: <span className="text-zinc-200 font-semibold">{contributorName}</span>
          </p>
        </div>

        {/* ⚡ Quick Testing Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePreFill(ROHIT_BUILDER_RESPONSE)}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
            title="Pre-fill authentic builder answer with concrete code specifics"
          >
            <Zap className="h-3 w-3 text-emerald-400" />
            <span>⚡ Try Builder Answer</span>
          </button>

          <button
            type="button"
            onClick={() => handlePreFill(ARYAN_FLUFF_RESPONSE)}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition active:scale-95"
            title="Pre-fill generic AI fluff answer"
          >
            <Zap className="h-3 w-3 text-rose-400" />
            <span>⚡ Try Fluff Answer</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* 2. Hybrid Voice Bar (Mic + Soundwave spectrum) */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/70 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition shadow-sm ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-900/30"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-3.5 w-3.5" />
                  <span>Stop Dictation</span>
                </>
              ) : (
                <>
                  <Mic className="h-3.5 w-3.5 text-emerald-400" />
                  <span>🎙️ Speak via Mic</span>
                </>
              )}
            </button>

            <span className="font-mono text-[11px] text-zinc-500 flex items-center space-x-1">
              <Keyboard className="h-3 w-3 text-zinc-400" />
              <span>or type directly in noisy rooms</span>
            </span>
          </div>

          {/* Real-time Spectrum Indicator */}
          <div className="flex items-center space-x-1 h-6 w-full sm:w-40 justify-center sm:justify-end">
            {frequencies.slice(0, 20).map((f, i) => {
              const height = isListening ? Math.max(3, Math.round(f * 24)) : 3;
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

        {/* Status / Speech feedback banner */}
        {(speechStatus || audioError) && (
          <div className="px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-950/20 font-mono text-[11px] text-amber-300 flex items-center space-x-2">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>{speechStatus || audioError}</span>
          </div>
        )}

        {/* 3. Textarea Defense Input (Voice transcription + manual typing seamless integration) */}
        <div className="relative">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Explain your architectural reasoning, concurrency constraints, or error handling for the highlighted code lines (Voice transcribes here, or type directly)..."
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        {/* 4. Submission Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-zinc-500">
            {answerText.length} characters • Minimum ~30 characters recommended
          </span>

          <button
            type="submit"
            disabled={!answerText.trim() || isEvaluating}
            className="inline-flex items-center space-x-2 rounded-xl bg-white px-6 py-2.5 font-mono text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-40 disabled:hover:bg-white shadow-lg active:scale-95"
          >
            {isEvaluating ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
                <span>AI Scoring Defense...</span>
              </>
            ) : (
              <>
                <span>Submit Defense Answer</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
