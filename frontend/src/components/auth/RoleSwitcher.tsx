"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserCheck, GraduationCap, ShieldCheck, ArrowLeftRight, ChevronUp, ChevronDown, Check } from "lucide-react";

export function RoleSwitcher() {
  const { user, role, switchRole, loginAs } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isEvaluator = role === "EVALUATOR";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-mono text-xs select-none">
      {/* Expanded Quick Switcher Popover */}
      {isOpen && (
        <div className="mb-2 w-72 rounded-2xl border border-white/10 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
              Demo Persona Switcher
            </span>
            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400">
              Dev Mode
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Option 1: Evaluator */}
            <button
              type="button"
              onClick={() => {
                loginAs("evaluator");
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left ${
                isEvaluator
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-200"
                  : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-200">Prof. Alok Sharma</div>
                  <div className="text-[10px] text-zinc-500">Evaluator / Lead Professor</div>
                </div>
              </div>
              {isEvaluator && <Check className="h-3.5 w-3.5 text-cyan-400" />}
            </button>

            {/* Option 2: Student (Builder) */}
            <button
              type="button"
              onClick={() => {
                loginAs("student");
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left ${
                !isEvaluator && user?.githubUsername === "rohit-sharma"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-200"
                  : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-200">Rohit Sharma</div>
                  <div className="text-[10px] text-emerald-400/90">Student • Verified Builder</div>
                </div>
              </div>
              {!isEvaluator && user?.githubUsername === "rohit-sharma" && (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              )}
            </button>

            {/* Option 3: Student (Suspect Dumper) */}
            <button
              type="button"
              onClick={() => {
                loginAs("studentSuspect");
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left ${
                !isEvaluator && user?.githubUsername === "aryan-k"
                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-200"
                  : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-400">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-200">Aryan Kumar</div>
                  <div className="text-[10px] text-rose-400/90">Student • Flagged Suspect</div>
                </div>
              </div>
              {!isEvaluator && user?.githubUsername === "aryan-k" && (
                <Check className="h-3.5 w-3.5 text-rose-400" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating Collapsed Pill */}
      <div className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => switchRole(isEvaluator ? "STUDENT" : "EVALUATOR")}
          className="flex items-center space-x-2 rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold text-zinc-200 hover:bg-zinc-800 transition"
        >
          {isEvaluator ? (
            <>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300">Evaluator Portal</span>
              <ArrowLeftRight className="h-3 w-3 text-zinc-500" />
              <span className="text-zinc-400">Switch to Student</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300">Student Portal</span>
              <ArrowLeftRight className="h-3 w-3 text-zinc-500" />
              <span className="text-zinc-400">Switch to Evaluator</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          title="Choose demo persona"
        >
          {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
