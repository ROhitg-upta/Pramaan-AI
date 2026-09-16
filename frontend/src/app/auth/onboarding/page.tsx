"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Github,
  Building,
  CheckCircle2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { loginAs, loginWithGithub } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"EVALUATOR" | "STUDENT">("EVALUATOR");
  const [orgName, setOrgName] = useState("");
  const [githubUser, setGithubUser] = useState("");

  const handleComplete = () => {
    if (selectedRole === "EVALUATOR") {
      loginAs("evaluator");
    } else {
      loginAs("student");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Logo size={42} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Select Your Role in the Network
          </h2>
          <p className="mt-1.5 font-mono text-xs text-zinc-400">
            Tailor your Pramaan AI experience for institutional evaluation or builder defense.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Evaluator */}
          <div
            onClick={() => setSelectedRole("EVALUATOR")}
            className={`cursor-pointer rounded-2xl border p-6 backdrop-blur-xl transition-all ${
              selectedRole === "EVALUATOR"
                ? "border-cyan-500/50 bg-cyan-950/20 ring-2 ring-cyan-500/20"
                : "border-white/10 bg-zinc-900/60 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              {selectedRole === "EVALUATOR" && (
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
              )}
            </div>

            <h3 className="font-mono text-sm font-bold text-zinc-100 mb-2">
              Evaluator / Professor
            </h3>
            <p className="font-mono text-xs text-zinc-400 leading-relaxed mb-4">
              Conduct repository audits, batch-inspect student cohorts, spot monolithic AI dumps, and sign cryptographic grade certificates.
            </p>

            <div className="space-y-1.5 border-t border-white/5 pt-3 font-mono text-[11px] text-zinc-400">
              <div>✓ Cohort Batch CSV Scans</div>
              <div>✓ Live Viva Interrogation Control</div>
              <div>✓ Grade &amp; Anomaly Overrides</div>
            </div>
          </div>

          {/* Card 2: Student */}
          <div
            onClick={() => setSelectedRole("STUDENT")}
            className={`cursor-pointer rounded-2xl border p-6 backdrop-blur-xl transition-all ${
              selectedRole === "STUDENT"
                ? "border-emerald-500/50 bg-emerald-950/20 ring-2 ring-emerald-500/20"
                : "border-white/10 bg-zinc-900/60 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              {selectedRole === "STUDENT" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
            </div>

            <h3 className="font-mono text-sm font-bold text-zinc-100 mb-2">
              Student / Candidate / Builder
            </h3>
            <p className="font-mono text-xs text-zinc-400 leading-relaxed mb-4">
              Verify your GitHub identity, defend your architecture in targeted viva rooms, and earn your immutable Hoollow Proof-of-Work badge.
            </p>

            <div className="space-y-1.5 border-t border-white/5 pt-3 font-mono text-[11px] text-zinc-400">
              <div>✓ GitHub Identity Anti-Impersonation</div>
              <div>✓ Scheduled Viva Defense Rooms</div>
              <div>✓ Verifiable README Embed Badge</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleComplete}
            className="inline-flex items-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-3 font-mono text-xs font-semibold shadow-lg transition"
          >
            <span>Proceed to {selectedRole === "EVALUATOR" ? "Evaluator Portal" : "Student Portal"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
