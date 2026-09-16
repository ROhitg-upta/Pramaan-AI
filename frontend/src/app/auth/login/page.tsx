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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, loginWithGithub, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMagicLinkSent(true);
    setTimeout(() => {
      // Default magic link defaults to Evaluator
      loginAs("evaluator");
    }, 900);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Logo size={42} />
          </div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-0.5 text-[10px] font-mono text-emerald-400 mb-3">
            <span>✦ HOOLLOW PROTOCOL • ENTERPRISE SAAS</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Sign in to Pramaan AI
          </h2>
          <p className="mt-1.5 font-mono text-xs text-zinc-400">
            Autonomous Code Forensics &amp; Viva Defense Engine
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* GitHub OAuth Button */}
          <div>
            <button
              type="button"
              onClick={() => loginWithGithub("STUDENT")}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2.5 rounded-xl border border-white/10 bg-zinc-950 hover:bg-zinc-800/80 px-4 py-3 font-mono text-xs font-semibold text-zinc-100 transition shadow-sm"
            >
              <Github className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/5" />
            <span className="bg-zinc-900 px-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              or email magic link
            </span>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="name@university.edu or name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2.5 font-mono text-xs font-semibold transition"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{magicLinkSent ? "Verifying..." : "Send Magic Link ➔"}</span>
            </button>
          </form>

          {/* 1-Click Instant Demo Passports */}
          <div className="border-t border-white/5 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center space-x-1.5">
                <Zap className="h-3 w-3 text-emerald-400" />
                <span>Instant Demo Passports</span>
              </span>
              <span className="font-mono text-[10px] text-zinc-600">Zero Signup Needed</span>
            </div>

            {/* Evaluator Demo Pass */}
            <button
              type="button"
              onClick={() => loginAs("evaluator")}
              className="w-full group flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-950/40 p-3 text-left transition"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-900/40 border border-cyan-500/30 text-cyan-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-cyan-200">
                    Enter as Evaluator / Professor
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400">
                    Prof. Alok Sharma • Stanford Forensics Lab
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Student Builder Demo Pass */}
            <button
              type="button"
              onClick={() => loginAs("student")}
              className="w-full group flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 p-3 text-left transition"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-emerald-200">
                    Enter as Student / Builder
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400">
                    Rohit Sharma (@rohit-sharma) • Hoollow Verified
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Footer Subtext */}
        <p className="text-center font-mono text-[11px] text-zinc-500">
          By signing in, you agree to the Hoollow Proof-of-Work Standard &amp; Anti-Cheating Charter.
        </p>
      </div>
    </div>
  );
}
