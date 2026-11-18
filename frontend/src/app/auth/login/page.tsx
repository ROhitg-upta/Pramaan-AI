"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  Github,
  Mail,
  Zap,
  Users,
  AlertOctagon,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Code2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, loginWithGithub, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "EVALUATOR">("STUDENT");

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMagicLinkSent(true);
    setTimeout(() => {
      loginAs(selectedRole === "EVALUATOR" ? "evaluator" : "student");
    }, 800);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-3">
            <Logo size={44} />
          </div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-1 text-xs font-mono text-emerald-400 mb-3">
            <span>✦ CHOOSE YOUR ROLE • ZERO-FRICTION ACCESS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
            Sign In to Pramaan AI
          </h1>
          <p className="mt-2 font-mono text-xs sm:text-sm text-zinc-400">
            Select your workspace portal below to get started immediately.
          </p>
        </div>

        {/* 2 DISTINCT ROLE SELECTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: Student / Candidate */}
          <div
            onClick={() => setSelectedRole("STUDENT")}
            className={`cursor-pointer rounded-2xl border p-7 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between relative group ${
              selectedRole === "STUDENT"
                ? "border-emerald-500 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50"
                : "border-white/10 bg-zinc-900/60 hover:border-emerald-500/40 hover:bg-zinc-900/90"
            }`}
          >
            {selectedRole === "STUDENT" && (
              <div className="absolute top-4 right-4">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    <span>CANDIDATE PORTAL</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-zinc-100">
                    Student / Candidate
                  </h3>
                </div>
              </div>

              <p className="font-body text-xs text-zinc-300 leading-relaxed font-light">
                Defend the code you authored, conquer autonomous line-grounded oral vivas, and generate a tamper-proof cryptographic Proof-of-Work receipt.
              </p>

              {/* Core capabilities list */}
              <ul className="space-y-2 font-mono text-xs text-zinc-400 pt-2 border-t border-white/5">
                <li className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Defend authored commit diffs via Mic or Text</span>
                </li>
                <li className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Instant AI authenticity scoring &amp; radar</span>
                </li>
                <li className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Verifiable cryptographic receipt &amp; public proof link</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loginAs("student");
                }}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3 font-mono text-xs font-bold transition shadow-lg active:scale-95"
              >
                <span>Enter as Student / Candidate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CARD 2: Evaluator / Recruiter */}
          <div
            onClick={() => setSelectedRole("EVALUATOR")}
            className={`cursor-pointer rounded-2xl border p-7 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between relative group ${
              selectedRole === "EVALUATOR"
                ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
                : "border-white/10 bg-zinc-900/60 hover:border-cyan-500/40 hover:bg-zinc-900/90"
            }`}
          >
            {selectedRole === "EVALUATOR" && (
              <div className="absolute top-4 right-4">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-inner">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    <span>INSTITUTIONAL PORTAL</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-zinc-100">
                    Evaluator / Recruiter
                  </h3>
                </div>
              </div>

              <p className="font-body text-xs text-zinc-300 leading-relaxed font-light">
                Compare capstone team members side-by-side, spot Big Bang overnight dumps and ghost coders, read viva transcripts, and run batch CSV class audits.
              </p>

              {/* Core capabilities list */}
              <ul className="space-y-2 font-mono text-xs text-zinc-400 pt-2 border-t border-white/5">
                <li className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Team side-by-side attribution comparison matrix</span>
                </li>
                <li className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Fraud detector: Big Bang, Ghost Coder, Zero Churn</span>
                </li>
                <li className="flex items-center space-x-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Read full student viva defense transcripts &amp; export CSV</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loginAs("evaluator");
                }}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-3 font-mono text-xs font-bold transition shadow-lg active:scale-95"
              >
                <span>Enter as Evaluator / Recruiter</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Alternative Standard Login (GitHub OAuth & Email Magic Link) */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-md max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Or authenticate with your institution:</span>
            <span className="text-zinc-500">Selected: {selectedRole}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => loginWithGithub(selectedRole)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-2 rounded-xl border border-white/10 bg-zinc-950 hover:bg-zinc-800 px-4 py-2.5 font-mono text-xs font-semibold text-zinc-200 transition"
            >
              <Github className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <form onSubmit={handleMagicLink} className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="name@university.edu or name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 font-mono text-xs font-semibold transition shrink-0"
            >
              <span>{magicLinkSent ? "Verifying..." : "Email Link ➔"}</span>
            </button>
          </form>
        </div>

        {/* Non-blocking Notice */}
        <p className="text-center font-mono text-xs text-zinc-500">
          Tip: You do not need an account to audit public repos. Anyone can{" "}
          <Link href="/" className="text-emerald-400 hover:underline">
            paste a GitHub URL on the home page
          </Link>{" "}
          and run instant forensics.
        </p>
      </div>
    </div>
  );
}
