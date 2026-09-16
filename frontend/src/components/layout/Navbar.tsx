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
    mode: "LIVE" | "MOCK";
    latencyMs?: number;
  }>({
    live: true,
    mode: "MOCK",
  });

  const [activeMode, setActiveMode] = useState<"LIVE" | "MOCK">("MOCK");

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
          {/* Status Dot Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 rounded-full border border-white/5 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20 animate-pulse" />
            <span>System Ready</span>
          </div>

          {/* Mode Segmented Toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-zinc-900/80 p-0.5 font-mono text-[11px]">
            <button
              onClick={() => setActiveMode("MOCK")}
              className={`flex items-center space-x-1 rounded-md px-2.5 py-1 transition-colors ${
                activeMode === "MOCK"
                  ? "bg-zinc-800 text-zinc-100 font-medium shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span>Mock</span>
            </button>
            <button
              onClick={() => setActiveMode("LIVE")}
              className={`flex items-center space-x-1 rounded-md px-2.5 py-1 transition-colors ${
                activeMode === "LIVE"
                  ? "bg-zinc-800 text-emerald-400 font-medium shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  backendState.live ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>Live API</span>
            </button>
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
