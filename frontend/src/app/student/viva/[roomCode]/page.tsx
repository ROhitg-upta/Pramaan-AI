"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";
import { useTypewriter } from "@/hooks/useTypewriter";
import { ThermalReceipt } from "@/components/receipt/ThermalReceipt";
import { mockFullReport, type VivaQuestion } from "@/lib/mock-data";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Layers,
  FileCode,
  Check,
  RefreshCw,
  Send,
  Zap,
} from "lucide-react";

// 3 Curated Viva Questions for the Real-time Defense
const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: "q-1",
    commit_hash: "4a82e1f",
    file_path: "frontend/src/hooks/useAuthContext.jsx",
    line_range: "18-34",
    code_snippet: `export function useAuthContext() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Line 18: Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  return { user, loading, login };
}`,
    referenced_lines: [18, 22, 23],
    category: "FAILURE_EDGE_CASE",
    difficulty: "Hard",
    question_text:
      "Candidate Rohit, in your useAuthContext hook at line 18, you invoke onAuthStateChanged to track user sessions. If the access token expires while the user maintains an open WebSocket connection on the dashboard, how does your hook coordinate token refresh with the active socket layer without race conditions?",
    expected_key_concepts: ["token refresh propagation", "websocket reconnection", "stale closure"],
    trap_signals: ["Says it handles it automatically", "Cannot explain socket lifecycle"],
  },
  {
    id: "q-2",
    commit_hash: "b7c8d9e",
    file_path: "backend/app/services/auth_service.py",
    line_range: "45-62",
    code_snippet: `async def rotate_refresh_token(self, user_id: str, old_token: str) -> dict:
    # Line 45: Distributed mutex lock with TTL
    lock = await self.redis.set(f"lock:refresh:{user_id}", "1", nx=True, ex=5)
    if not lock:
        raise HTTPException(status_code=429, detail="Concurrent token rotation detected")
    try:
        await self._revoke_token_family(old_token)
        new_access = self.create_access_token(user_id)
        new_refresh = self.create_refresh_token(user_id)
        return {"access_token": new_access, "refresh_token": new_refresh}
    finally:
        await self.redis.delete(f"lock:refresh:{user_id}")`,
    referenced_lines: [45, 48, 55],
    category: "SCALABILITY",
    difficulty: "Hard",
    question_text:
      "Looking at line 45 of auth_service.py, you set a 5-second TTL on the Redis lock. If Redis experiences a momentary network partition right after _revoke_token_family succeeds, how does your architecture prevent a user lockout?",
    expected_key_concepts: ["redis lock TTL expiration", "idempotency replay", "revocation audit log"],
    trap_signals: ["Claims database handles redis failure", "Ignores network partitions"],
  },
  {
    id: "q-3",
    commit_hash: "4a82e1f",
    file_path: "frontend/src/pages/Dashboard.jsx",
    line_range: "52-70",
    code_snippet: `export default function Dashboard() {
  const [courses, setCourses] = useState([]);

  // Line 52: Data Fetching with empty dependency array
  useEffect(() => {
    async function loadData() {
      const res = await api.get('/api/courses');
      setCourses(res.data);
    }
    loadData();
  }, []);

  return <CourseList courses={courses} />;
}`,
    referenced_lines: [52, 58],
    category: "IMPLEMENTATION_TRADEOFF",
    difficulty: "Medium",
    question_text:
      "On line 52 of Dashboard.jsx, you load courses with a single useEffect. If a professor adds a new course while a student has the dashboard open, the student never sees the update until a hard page reload. Why didn't you implement cache invalidation or SWR?",
    expected_key_concepts: ["stale data problem", "polling vs websockets", "React Query/SWR cache invalidation"],
    trap_signals: ["Claims useEffect auto-updates", "Does not understand stale closures"],
  },
];

const FILLER_WORDS = ["basically", "like", "you know", "actually", "literally", "sort of"];

export default function StudentRealtimeVivaRoom() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const roomCode = (params?.roomCode as string) || "ROOM-4A82";

  // Navigation / Phase state: "preflight" | "defense" | "receipt"
  const [phase, setPhase] = useState<"preflight" | "defense" | "receipt">("preflight");

  // Pre-flight video stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(true);

  // Audio Analyser for mic check in pre-flight phase
  const { isListening, frequencies, toggleListening, stopListening } = useAudioAnalyser(32);

  // Active question index
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const currentQuestion = VIVA_QUESTIONS[questionIndex];

  // Speech Synthesis (Text-to-Speech)
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Answer text & dictation
  const [answerText, setAnswerText] = useState<string>("");
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Anti-cheat telemetry
  const [pastePenaltyTriggered, setPastePenaltyTriggered] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Cadence analysis
  const [wpm, setWpm] = useState<number>(0);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);

  // Start Camera on pre-flight mount
  useEffect(() => {
    async function setupCamera() {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera preview unavailable or denied:", err);
      }
    }

    if (phase === "preflight" || phase === "defense") {
      setupCamera();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [phase]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stable TTS callback on typewriter completion
  const handleTypewriterComplete = React.useCallback(() => {
    if (audioMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => {
        setIsSpeakingQuestion(false);
        activeUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeakingQuestion(false);
        activeUtteranceRef.current = null;
      };
      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("TTS synthesis error:", err);
      setIsSpeakingQuestion(false);
    }
  }, [audioMuted, currentQuestion.question_text]);

  // Web Speech API: Typewriter text streaming with stable callback
  const { displayedText, isComplete } = useTypewriter(currentQuestion.question_text, {
    speed: 16,
    delay: 200,
    onComplete: handleTypewriterComplete,
  });

  // Calculate Cadence (WPM & Fillers)
  useEffect(() => {
    const words = answerText.trim().split(/\s+/).filter(Boolean);
    const count = words.length;
    setWpm(Math.round(count * 2.2)); // approximation for active response window

    const foundFillers: string[] = [];
    FILLER_WORDS.forEach((fw) => {
      if (answerText.toLowerCase().includes(fw)) {
        foundFillers.push(fw);
      }
    });
    setDetectedFillers(foundFillers);
  }, [answerText]);

  // Speech-to-Text Dictation (Web Speech API)
  const toggleDictation = () => {
    if (isDictating) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsDictating(false);
      return;
    }

    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Please type your defense.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => `${prev} ${transcript}`.trim());
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsDictating(true);
    } catch (err) {
      console.warn("Dictation start failed:", err);
      setIsDictating(false);
    }
  };

  // Anti-Cheat: Handle onPaste
  const handlePaste = () => {
    setPastePenaltyTriggered(true);
  };

  // Sound Effect Chime on completion using Web Audio API oscillator
  const playCompletionChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext unavailable
    }
  };

  // Submit Answer & advance or show receipt
  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    setIsEvaluating(true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      setIsEvaluating(false);
      if (questionIndex < VIVA_QUESTIONS.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        setAnswerText("");
        setPastePenaltyTriggered(false);
      } else {
        // Complete! Handout digital receipt
        playCompletionChime();
        setPhase("receipt");
      }
    }, 1100);
  };

  // ════════════════════ SCREEN 1: PRE-FLIGHT SYSTEM VERIFICATION ════════════════════
  if (phase === "preflight") {
    return (
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/20 bg-amber-950/20 px-3 py-0.5 text-[11px] font-mono text-amber-400 mb-1">
            <span>✦ VIVA EXAMINATION ROOM: #{roomCode}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100">
            Real-Time Oral Defense Pre-Flight Check
          </h1>
          <p className="font-mono text-xs text-zinc-400 max-w-lg mx-auto">
            Verify your camera feed, microphone input, and anti-cheating agreement before entering the hot seat.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 font-mono text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-400">Authenticated Candidate:</span>
              <span className="text-zinc-100 font-bold">{user?.fullName || "Rohit Sharma"}</span>
              <span className="text-zinc-500">(@{user?.githubUsername || "rohit-sharma"})</span>
            </div>
            <div className="text-zinc-400">
              Evaluator: <span className="text-zinc-200 font-semibold">Prof. Alok Sharma</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Camera Feed */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-950 p-5 text-center space-y-3 min-h-[240px]">
              <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-emerald-500/40 bg-zinc-900 shadow-xl flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                {!videoStream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-500 font-mono text-[10px]">
                    Preview Mode
                  </div>
                )}
              </div>
              <div className="font-mono text-xs font-semibold text-zinc-200">
                Camera Feed Active
              </div>
              <p className="font-mono text-[10px] text-zinc-500">
                Encrypted WebRTC Spectator Feed ready for Faculty Oversight
              </p>
            </div>

            {/* Real Microphone Spectrum Test */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-950 p-5 text-center space-y-3 min-h-[240px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-emerald-400">
                <Mic className="h-6 w-6" />
              </div>

              <div className="font-mono text-xs font-semibold text-zinc-200">
                {isListening ? "Microphone Active (Speak to Test)" : "Microphone Idle"}
              </div>

              {/* Bouncing Frequency Bars */}
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
                className={`px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition ${
                  isListening
                    ? "bg-rose-500 text-white"
                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {isListening ? "Stop Audio Test" : "🎙️ Test Microphone"}
              </button>
            </div>
          </div>

          {/* Integrity Seal Agreement */}
          <div className="rounded-xl border border-white/5 bg-zinc-950/80 p-4 font-mono text-xs text-zinc-400 space-y-1.5">
            <div className="text-zinc-200 font-semibold flex items-center space-x-2">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Anti-Cheating Integrity Seal:</span>
            </div>
            <div>• Tab switches, external clipboard copy-pasting, and AI assistant extensions are actively monitored.</div>
            <div>• Live speech transcription will analyze candidate cadence, latency, and filler word frequency.</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              href="/student/dashboard"
              className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              ← Back to Student Dashboard
            </Link>

            <button
              type="button"
              onClick={() => {
                stopListening();
                setPhase("defense");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-8 py-3 font-mono text-xs font-bold shadow-xl transition active:scale-95"
            >
              <span>Enter Examination Room (Launch Defense) ➔</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════ SCREEN 3: IMMEDIATE POST-VIVA HANDOUT (RECEIPT) ════════════════════
  if (phase === "receipt") {
    return (
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-1 text-xs font-mono text-emerald-400 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>VIVA EXAMINATION CONCLUDED • PROOF CRYPTOGRAPHICALLY SEALED</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100">
            Defense Successfully Sealed
          </h1>
          <p className="font-mono text-xs text-zinc-400 max-w-lg mx-auto">
            Your technical oral defense has been evaluated, timestamped, and bound to your commit tree.
          </p>
        </div>

        {/* Digital Thermal Receipt */}
        <div className="max-w-md mx-auto">
          <ThermalReceipt report={mockFullReport} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href={`/u/${user?.githubUsername || "rohit-sharma"}`}
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 font-mono text-xs font-bold shadow-lg transition"
          >
            <span>View Your Public Proof-of-Work Profile (/u/{user?.githubUsername || "rohit-sharma"})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/student/dashboard"
            className="rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 font-mono text-xs text-zinc-300 hover:bg-zinc-800 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ════════════════════ SCREEN 2: LIVE SPLIT-SCREEN ORAL DEFENSE INTERFACE ════════════════════
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 font-mono text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 rounded-full border border-rose-500/30 bg-rose-950/20 px-2.5 py-0.5 text-rose-400 font-bold text-[10px]">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>EXAMINATION IN PROGRESS</span>
          </div>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300">Room: {roomCode}</span>
          <span className="text-zinc-500">|</span>
          <span className="text-emerald-400 font-bold">
            Question {questionIndex + 1} of {VIVA_QUESTIONS.length}
          </span>
        </div>

        {/* Picture-in-Picture Webcam */}
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-emerald-500/40 bg-zinc-900 shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-zinc-200 text-[11px]">{user?.fullName || "Rohit Sharma"}</div>
            <div className="text-[10px] text-zinc-500">Rec: 720p HD Active</div>
          </div>
        </div>
      </div>

      {/* Split Screen Grid (12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Spotlight (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-950 p-5 font-mono text-xs shadow-2xl min-h-[500px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <div className="flex items-center space-x-2 text-zinc-300">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <span className="font-bold">{currentQuestion.file_path}</span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400">
                  #{currentQuestion.commit_hash}
                </span>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                Tier 3 Core Logic (3.0x Weight)
              </span>
            </div>

            {/* Spotlight Code Area */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4 font-mono text-xs text-cyan-100 overflow-x-auto leading-relaxed border-l-4 border-l-cyan-400 shadow-inner">
              <pre className="text-zinc-300">{currentQuestion.code_snippet}</pre>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Challenged Lines: {currentQuestion.line_range}</span>
            <span className="text-cyan-400">PyDriller AST Verified</span>
          </div>
        </div>

        {/* Right: AI Examiner + Speech-to-Text Input (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Upper: AI Examiner Terminal with TTS Voice */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 font-mono text-xs">
              <span className="text-zinc-300 font-bold flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Pramaan AI Examiner Engine</span>
                {isSpeakingQuestion && (
                  <span className="text-emerald-400 text-[10px] animate-pulse">(Speaking...)</span>
                )}
              </span>

              {/* TTS Mute Toggle */}
              <button
                type="button"
                onClick={() => {
                  setAudioMuted(!audioMuted);
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="p-1 rounded-lg border border-white/10 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                title={audioMuted ? "Unmute AI Voice" : "Mute AI Voice"}
              >
                {audioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
              </button>
            </div>

            <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100 min-h-[72px]">
              &ldquo;{displayedText || currentQuestion.question_text}&rdquo;
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
              <span className="text-zinc-500">Rubric:</span>
              {currentQuestion.expected_key_concepts.map((c, i) => (
                <span key={i} className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                  #{c}
                </span>
              ))}
            </div>
          </div>

          {/* Lower: Speech-to-Text & Typed Defense Box */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 backdrop-blur-xl shadow-2xl space-y-4">
            {/* Anti-Cheat Paste Warning Alert Banner */}
            {pastePenaltyTriggered && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 font-mono text-xs text-rose-300 flex items-start space-x-2 animate-pulse">
                <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-200">⚠️ CLIPBOARD PASTE DETECTED: </span>
                  External clipboard insertion flagged in telemetry. 15% penalty recorded in forensic dossier.
                </div>
              </div>
            )}

            {/* Dictation & Demo Shortcuts Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              {/* Pulsating Red Mic Dictation Button */}
              <button
                type="button"
                onClick={toggleDictation}
                className={`inline-flex items-center space-x-2 rounded-xl px-3.5 py-1.5 font-semibold transition ${
                  isDictating
                    ? "bg-rose-600 text-white animate-pulse"
                    : "border border-white/10 bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Mic className={`h-3.5 w-3.5 ${isDictating ? "text-white" : "text-emerald-400"}`} />
                <span>{isDictating ? "Listening (Stop)" : "🎙️ Speak Defense (Dictate)"}</span>
              </button>

              {/* Demo Shortcuts */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePaste();
                    setAnswerText(
                      "The useAuthContext hook automatically handles token refresh in the background using Firebase standard architecture."
                    );
                  }}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] text-rose-300 hover:bg-rose-500/20"
                >
                  ⚡ Aryan Fluff (Paste)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswerText(
                      "I had to implement a Redis mutex lock with a 5-second TTL on line 45 because concurrent tab refreshes were causing race conditions and invalidating valid sessions."
                    );
                  }}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300 hover:bg-emerald-500/20"
                >
                  ⚡ Rohit Builder
                </button>
              </div>
            </div>

            {/* Defense Textarea with onPaste monitor */}
            <textarea
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Explain your architectural reasoning, concurrency handling, or recovery flow. Or use the dictation button above..."
              className="w-full rounded-xl border border-white/10 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />

            {/* Cadence Telemetry Strip */}
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 border-t border-white/5 pt-2">
              <div className="flex items-center space-x-3">
                <span>WPM: <strong className="text-zinc-300">{wpm}</strong></span>
                {detectedFillers.length > 0 && (
                  <span className="text-amber-400">
                    Fillers: {detectedFillers.join(", ")}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim() || isEvaluating}
                className="inline-flex items-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2 font-bold shadow-md transition disabled:opacity-30"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Evaluating Defense...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Technical Defense</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
