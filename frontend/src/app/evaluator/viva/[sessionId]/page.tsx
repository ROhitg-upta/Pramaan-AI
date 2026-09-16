"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Sliders,
  Lock,
  ArrowRight,
  Clock,
  User,
  GitBranch,
  Play,
  Pause,
  Volume2,
  FileCode,
  Check,
  RotateCcw,
} from "lucide-react";

interface QuestionReviewData {
  id: string;
  title: string;
  filePath: string;
  lines: string;
  snippet: string;
  candidateAnswer: string;
  aiScore: number;
  conceptsCovered: string[];
  conceptsMissed: string[];
  fluffSignals: string[];
  audioDuration: string;
}

const REVIEW_QUESTIONS: QuestionReviewData[] = [
  {
    id: "q-1",
    title: "Question 1: WebSocket Re-authentication Coordination",
    filePath: "frontend/src/hooks/useAuthContext.jsx",
    lines: "18-34",
    snippet: `export function useAuthContext() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Auth State Listener
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);
}`,
    candidateAnswer:
      "When the Firebase token expires, the onIdTokenChanged callback triggers a broadcast to our WebSocket singleton client, forcing a temporary reconnect handshake with the new bearer token before queuing subsequent telemetry packets.",
    aiScore: 94,
    conceptsCovered: ["WebSocket Reconnection", "Token Propagation", "Single-point Refresh"],
    conceptsMissed: ["Stale Closure Mitigation"],
    fluffSignals: [],
    audioDuration: "0:42",
  },
  {
    id: "q-2",
    title: "Question 2: Redis Distributed Mutex Locks & TTL",
    filePath: "backend/app/services/auth_service.py",
    lines: "45-62",
    snippet: `async def rotate_refresh_token(self, user_id: str, old_token: str):
    lock = await self.redis.set(f"lock:refresh:{user_id}", "1", nx=True, ex=5)
    if not lock: raise HTTPException(status_code=429)
    try: await self._revoke_token_family(old_token)`,
    candidateAnswer:
      "I used a 5-second TTL on the Redis SETNX key to guarantee that if the container crashes mid-rotation, the user lock automatically expires and avoids indefinite deadlock. The client retries after 500ms.",
    aiScore: 96,
    conceptsCovered: ["Redis SETNX Mutex", "Deadlock Prevention via TTL", "Idempotency"],
    conceptsMissed: [],
    fluffSignals: [],
    audioDuration: "1:05",
  },
  {
    id: "q-3",
    title: "Question 3: Client Cache Invalidation & Stale State",
    filePath: "frontend/src/pages/Dashboard.jsx",
    lines: "52-70",
    snippet: `useEffect(() => {
  async function loadData() {
    const res = await api.get('/api/courses');
    setCourses(res.data);
  }
  loadData();
}, []);`,
    candidateAnswer:
      "It was an early prototype compromise during sprint 1. In production, we replaced the plain useEffect with TanStack Query and an SWR stale-while-revalidate strategy triggered by our server-sent events.",
    aiScore: 88,
    conceptsCovered: ["Stale State Identification", "TanStack/SWR Replacement", "SSE Trigger"],
    conceptsMissed: ["Optimistic UI Updates"],
    fluffSignals: ["Brief justification of tech debt"],
    audioDuration: "0:36",
  },
];

export default function EvaluatorVivaWorkbench() {
  const params = useParams();
  const router = useRouter();
  const sessionId = (params?.sessionId as string) || "session-001";

  // Active question tab
  const [activeTab, setActiveTab] = useState<number>(0);
  const qData = REVIEW_QUESTIONS[activeTab];

  // Evaluator scoring state
  const [evaluatorScore, setEvaluatorScore] = useState<number>(92);
  const [evaluatorNotes, setEvaluatorNotes] = useState<string>(
    "Candidate Rohit Sharma exhibited deep architectural ownership of distributed locking and WebSocket coordination. Concurrency trade-offs were articulated with clarity."
  );

  // Audio Playback simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(25);

  // Sealing state
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [sealedHash, setSealedHash] = useState<string | null>(null);

  // Audio playback progress simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 4));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  // Combined weighted score: 0.35 * GitForensics (92) + 0.25 * ASTComplexity (88) + 0.40 * EvaluatorVivaScore
  const gitForensics = 92;
  const astComplexity = 88;
  const compositeScore = Math.round(
    0.35 * gitForensics + 0.25 * astComplexity + 0.4 * evaluatorScore
  );

  const handleSealCertificate = () => {
    setIsSealing(true);
    setTimeout(() => {
      setIsSealing(false);
      const hash = "e4f81c9a882d9b136f874211a77489c623d54821";
      setSealedHash(hash);
    }, 1200);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Evaluator Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <Link href="/evaluator/audits" className="hover:text-zinc-300">
              Audits
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Session #{sessionId}</span>
          </div>

          <div className="flex items-center space-x-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
              Live Defense Spectator &amp; Grading Workbench
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DEFENSE RECORDED • READY FOR CERTIFICATION</span>
            </span>
          </div>
        </div>

        {/* Candidate Profile Pill */}
        <div className="flex items-center space-x-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-2 font-mono text-xs shadow-md">
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
            RS
          </div>
          <div>
            <div className="font-bold text-zinc-200">Rohit Sharma</div>
            <div className="text-[10px] text-zinc-500">@rohit-sharma • Audit: A-</div>
          </div>
        </div>
      </div>

      {/* 2. Question Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
        {REVIEW_QUESTIONS.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-xl font-mono text-xs transition flex items-center space-x-2 ${
              activeTab === idx
                ? "bg-zinc-100 text-zinc-950 font-bold shadow-md"
                : "border border-white/5 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Question {idx + 1}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded ${
                activeTab === idx ? "bg-zinc-300 text-zinc-900" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {q.aiScore}/100
            </span>
          </button>
        ))}
      </div>

      {/* 3. Split-Screen Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Evidence Snippet, Transcribed Spoken Answer, Custom Audio Player */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question & File Context Card */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 font-mono text-xs">
              <span className="font-bold text-zinc-200 flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <span>{qData.filePath}</span>
                <span className="text-zinc-500">({qData.lines})</span>
              </span>
              <span className="text-zinc-400">{qData.title}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <pre>{qData.snippet}</pre>
            </div>
          </div>

          {/* Candidate Transcribed Spoken Answer */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 font-mono text-xs">
              <span className="font-bold text-zinc-200 flex items-center space-x-2">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span>Candidate Transcribed Verbal Defense</span>
              </span>
              <span className="text-zinc-500 text-[10px]">Transcribed via Web Speech Dictation</span>
            </div>

            <p className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 font-mono text-xs text-emerald-200 leading-relaxed">
              &ldquo;{qData.candidateAnswer}&rdquo;
            </p>

            {/* Custom Audio Player Widget */}
            <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 flex items-center space-x-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="h-9 w-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition"
              >
                {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Candidate Audio Stream</span>
                  <span>{qData.audioDuration}</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>

              <Volume2 className="h-4 w-4 text-zinc-500" />
            </div>

            {/* AI Concept Analysis Chips */}
            <div className="space-y-2 font-mono text-xs pt-2">
              <div className="text-[11px] text-zinc-400 font-semibold">Architectural Concept Coverage:</div>
              <div className="flex flex-wrap gap-2">
                {qData.conceptsCovered.map((c, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300 text-[11px] flex items-center space-x-1"
                  >
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>+{c}</span>
                  </span>
                ))}
                {qData.conceptsMissed.map((m, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-rose-300 text-[11px]"
                  >
                    -{m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Evaluator Override & Cryptographic Sealing Console */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                Faculty Endorsement &amp; Sealing Suite
              </span>
              <h3 className="font-display text-lg font-bold text-zinc-100 mt-1">
                Final Grade Override
              </h3>
            </div>

            {/* Baseline vs Override Comparison */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 text-center">
                <span className="text-zinc-500 text-[10px] uppercase">AI Baseline Score</span>
                <div className="text-2xl font-bold text-zinc-200 mt-1">{qData.aiScore} / 100</div>
                <span className="text-[10px] text-zinc-500">Autonomous Model</span>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-center">
                <span className="text-cyan-400 text-[10px] uppercase">Certified Viva Score</span>
                <div className="text-2xl font-bold text-cyan-300 mt-1">{evaluatorScore} / 100</div>
                <span className="text-[10px] text-cyan-400/80">Faculty Endorsed</span>
              </div>
            </div>

            {/* Score Slider */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-zinc-300">
                <span className="flex items-center space-x-1.5">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Adjust Certified Mark:</span>
                </span>
                <span className="font-bold text-cyan-300">{evaluatorScore} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={evaluatorScore}
                onChange={(e) => setEvaluatorScore(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>

            {/* Composite Final Grade Matrix */}
            <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 font-mono text-xs space-y-2">
              <div className="text-zinc-400 font-semibold text-[11px]">Composite Final Formula:</div>
              <div className="text-[11px] text-zinc-500">
                35% Git ({gitForensics}) + 25% AST ({astComplexity}) + 40% Viva ({evaluatorScore})
              </div>
              <div className="text-lg font-bold text-emerald-400 pt-1">
                Final Pramaan Score: {compositeScore} / 100 (Grade: A)
              </div>
            </div>

            {/* Remarks Textarea */}
            <div className="space-y-2 font-mono text-xs">
              <label className="block text-zinc-300">Official Faculty Remarks:</label>
              <textarea
                rows={3}
                value={evaluatorNotes}
                onChange={(e) => setEvaluatorNotes(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Sealing Action */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              {!sealedHash ? (
                <button
                  type="button"
                  onClick={handleSealCertificate}
                  disabled={isSealing}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 font-mono text-xs font-bold shadow-xl transition"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {isSealing ? "Hashing & Sealing on Chain..." : "🔏 Seal & Sign Integrity Certificate"}
                  </span>
                </button>
              ) : (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-2 font-mono text-xs">
                  <div className="text-emerald-400 font-bold flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Certificate Cryptographically Sealed!</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 break-all">
                    SHA-256: {sealedHash}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link
                      href="/evaluator/audit/demo-smart-campus/certificate"
                      className="inline-flex items-center space-x-1.5 rounded-lg bg-white px-3 py-1.5 text-zinc-950 hover:bg-zinc-200 text-xs font-medium shadow-sm transition"
                    >
                      <span>Download PDF Diploma 📄</span>
                    </Link>
                    <Link
                      href="/verdict/demo-smart-campus"
                      className="inline-flex items-center space-x-1 text-emerald-400 hover:underline text-xs"
                    >
                      <span>View Thermal Receipt</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
