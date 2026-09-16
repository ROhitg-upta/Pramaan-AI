"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GitBranch, Github, Radio, Check, ChevronRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { checkBackendHealth } from "@/lib/api";

interface NavbarProps {
  currentRepo?: string;
  activeStep?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRepo, activeStep }) => {
  const [backendState, setBackendState] = useState<{
    live: boolean;
    mode: "LIVE" | "GITHUB_DIRECT" | "MOCK";
    latencyMs?: number;
  }>({
    live: true,
    mode: "LIVE",
  });

  const [activeMode, setActiveMode] = useState<"LIVE" | "GITHUB_DIRECT" | "MOCK">("LIVE");

  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendState({
        live: health.live,
        mode: health.mode,
        latencyMs: health.latencyMs,
      });
      setActiveMode(health.mode);
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Modern Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="group flex items-center">
            <Logo size={26} />
          </Link>

          {/* Minimalist Breadcrumb / Engine State */}
          <div className="hidden items-center space-x-1.5 font-mono text-xs text-zinc-500 sm:flex">
            <span className="text-zinc-600">/</span>
            {currentRepo ? (
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <GitBranch className="h-3.5 w-3.5 text-zinc-400" />
                <span>{currentRepo}</span>
                {activeStep && (
                  <>
                    <ChevronRight className="h-3 w-3 text-zinc-600" />
                    <span className="text-emerald-400">{activeStep}</span>
                  </>
                )}
              </div>
            ) : (
              <span className="text-zinc-400">Audit Engine</span>
            )}
          </div>
        </div>

        {/* Right Tools: Clean Segmented Pill & GitHub Link */}
        <div className="flex items-center space-x-3">
          {/* Real Backend Engine Status Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 rounded-full border border-white/5 bg-zinc-900/60 px-3 py-1 text-[11px] font-mono text-zinc-300">
            <span
              className={`h-2 w-2 rounded-full ${
                backendState.live
                  ? "bg-emerald-400 ring-2 ring-emerald-500/20 animate-pulse"
                  : "bg-cyan-400 ring-2 ring-cyan-500/20"
              }`}
            />
            <span>
              {backendState.live
                ? `FastAPI Engine (${backendState.latencyMs ?? 15}ms)`
                : "Direct GitHub API Engine"}
            </span>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/ROhitg-upta/Pramaan-AI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Star</span>
          </a>
        </div>
      </div>
    </header>
  );
};
