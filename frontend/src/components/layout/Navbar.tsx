"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch, Github, Radio, Check, ChevronRight, GraduationCap, ShieldCheck, User, LogOut, ArrowLeftRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { checkBackendHealth } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  currentRepo?: string;
  activeStep?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRepo, activeStep }) => {
  const pathname = usePathname();
  const { user, role, switchRole, logout } = useAuth();
  const isEvaluator = role === "EVALUATOR";

  const [backendState, setBackendState] = useState<{
    live: boolean;
    mode: "LIVE" | "GITHUB_DIRECT" | "MOCK";
    latencyMs?: number;
  }>({
    live: true,
    mode: "LIVE",
  });

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendState({
        live: health.live,
        mode: health.mode,
        latencyMs: health.latencyMs,
      });
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Modern Logo & Dynamic Portal Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="group flex items-center">
            <Logo size={26} />
          </Link>

          {/* Role Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
            {isEvaluator ? (
              <>
                <Link
                  href="/evaluator/dashboard"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname === "/evaluator/dashboard"
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/evaluator/audits"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname === "/evaluator/audits"
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Audits Directory
                </Link>
                <Link
                  href="/evaluator/cohorts"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname?.startsWith("/evaluator/cohorts")
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Cohorts
                </Link>
                <Link
                  href="/evaluator/settings"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname?.startsWith("/evaluator/settings")
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Settings
                </Link>
                <Link
                  href="/pricing"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname === "/pricing"
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Pricing
                </Link>
                <Link
                  href="/pitch"
                  className={`px-2.5 py-1 rounded-lg transition font-semibold ${
                    pathname === "/pitch"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      : "text-emerald-400 hover:text-emerald-300"
                  }`}
                >
                  Judge Showcase ✦
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/student/dashboard"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname === "/student/dashboard"
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  My Dashboard
                </Link>
                <Link
                  href="/student/viva/ROOM-4A82"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname?.startsWith("/student/viva")
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Viva Room
                </Link>
                <Link
                  href="/student/portfolio"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname === "/student/portfolio"
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Portfolio
                </Link>
                <Link
                  href={`/u/${user?.githubUsername || "rohit-sharma"}`}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname?.startsWith("/u/")
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Public Proof
                </Link>
                <Link
                  href="/pricing"
                  className={`px-2.5 py-1 rounded-lg transition ${
                    pathname === "/pricing"
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Pricing
                </Link>
                <Link
                  href="/pitch"
                  className={`px-2.5 py-1 rounded-lg transition font-semibold ${
                    pathname === "/pitch"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      : "text-emerald-400 hover:text-emerald-300"
                  }`}
                >
                  Judge Showcase ✦
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Tools: Backend State, Role Pill, User Dropdown, GitHub */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          {/* Backend Engine Status Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 rounded-full border border-white/5 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-300">
            <span
              className={`h-2 w-2 rounded-full ${
                backendState.live
                  ? "bg-emerald-400 ring-2 ring-emerald-500/20 animate-pulse"
                  : "bg-cyan-400 ring-2 ring-cyan-500/20"
              }`}
            />
            <span>
              {backendState.live
                ? `FastAPI (${backendState.latencyMs ?? 15}ms)`
                : "GitHub API"}
            </span>
          </div>

          {/* User Account & Role Badge */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 rounded-xl border border-white/10 bg-zinc-900/80 px-2.5 py-1 hover:border-white/20 transition"
              >
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    isEvaluator
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {isEvaluator ? "EVALUATOR" : "STUDENT"}
                </span>

                <span className="hidden sm:inline font-semibold text-zinc-200 max-w-[120px] truncate text-[11px]">
                  {user.fullName}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-white/5">
                    <div className="font-bold text-zinc-200 text-xs truncate">
                      {user.fullName}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">{user.email}</div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        switchRole(isEvaluator ? "STUDENT" : "EVALUATOR");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 p-2 rounded-lg text-[11px] text-zinc-300 hover:bg-zinc-900 transition text-left"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Switch to {isEvaluator ? "Student Portal" : "Evaluator Portal"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 p-2 rounded-lg text-[11px] text-rose-400 hover:bg-rose-950/30 transition text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:bg-white hover:text-zinc-950 transition font-semibold text-xs"
            >
              Sign In
            </Link>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/ROhitg-upta/Pramaan-AI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
