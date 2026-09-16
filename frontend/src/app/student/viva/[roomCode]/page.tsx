"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";

export default function StudentVivaRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const roomCode = (params?.roomCode as string) || "ROOM-4A82";

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micReady, setMicReady] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Real-time audio analyser for mic check
  const { isListening, volume, frequencies, toggleListening } = useAudioAnalyser(32);

  const handleEnterDefense = () => {
    setIsEntering(true);
    const contributorId =
      user?.githubUsername === "aryan-k" ? "contrib-002" : "contrib-001";

    setTimeout(() => {
      router.push(`/viva/demo-smart-campus/${contributorId}`);
    }, 600);
  };

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/20 bg-amber-950/20 px-3 py-0.5 text-[11px] font-mono text-amber-400 mb-1">
          <span>✦ VIVA EXAMINATION ROOM: #{roomCode}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
          Candidate Pre-Flight Hardware Check
        </h1>
        <p className="font-mono text-xs text-zinc-400 max-w-lg mx-auto">
          Ensure your microphone and camera feed are operational before entering the autonomous oral defense hot seat.
        </p>
      </div>

      {/* Main Pre-flight Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Identity Confirmation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 font-mono text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">Authenticated Candidate:</span>
            <span className="text-zinc-100 font-bold">{user?.fullName || "Rohit Sharma"}</span>
            <span className="text-zinc-500">(@{user?.githubUsername || "rohit-sharma"})</span>
          </div>

          <div className="text-zinc-400">
            Assigned Evaluator: <span className="text-zinc-200 font-semibold">Prof. Alok Sharma</span>
          </div>
        </div>

        {/* 2-Column Hardware Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera Box */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-950 p-6 text-center space-y-3 min-h-[220px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-cyan-400">
              {cameraEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6 text-zinc-600" />}
            </div>
            <div className="font-mono text-xs font-semibold text-zinc-200">
              {cameraEnabled ? "Virtual Camera Feed Active" : "Camera Muted"}
            </div>
            <p className="font-mono text-[11px] text-zinc-500">
              HD Video Stream ready for evaluator oversight
            </p>
            <button
              type="button"
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className="px-3 py-1 rounded-lg border border-white/10 bg-zinc-900 font-mono text-[11px] text-zinc-400 hover:text-zinc-200 transition"
            >
              Toggle Camera
            </button>
          </div>

          {/* Microphone Audio Spectrum Box */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-950 p-6 text-center space-y-3 min-h-[220px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-emerald-400">
              <Mic className="h-6 w-6" />
            </div>

            <div className="font-mono text-xs font-semibold text-zinc-200">
              {isListening ? "Microphone Test Running (Speak Now)" : "Microphone Idle"}
            </div>

            {/* Live Audio Spectrum */}
            <div className="flex items-center space-x-1 h-8 w-40 justify-center">
              {frequencies.slice(0, 16).map((f, idx) => {
                const height = isListening ? Math.max(3, Math.round(f * 28)) : 3;
                return (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isListening ? "bg-emerald-400" : "bg-zinc-800"
                    }`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={toggleListening}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition ${
                isListening
                  ? "bg-rose-500 text-white"
                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {isListening ? "Stop Test" : "🎙️ Test Microphone"}
            </button>
          </div>
        </div>

        {/* Anti-Cheating & AI Guidelines */}
        <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4 font-mono text-xs text-zinc-400 space-y-1.5">
          <div className="text-zinc-200 font-semibold flex items-center space-x-2">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Pramaan Defense Protocol Active:</span>
          </div>
          <div>• Line-targeted questions will be streamed character-by-character based on your git diff.</div>
          <div>• Latency tracking &amp; clipboard paste detection enabled to prevent external LLM copy-paste.</div>
        </div>

        {/* Enter Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/student/dashboard"
            className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            ← Back to Student Dashboard
          </Link>

          <button
            type="button"
            onClick={handleEnterDefense}
            disabled={isEntering}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3 font-mono text-xs font-bold shadow-xl transition active:scale-95"
          >
            <span>{isEntering ? "Entering Hot Seat..." : "Enter Oral Defense Hot Seat ➔"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
