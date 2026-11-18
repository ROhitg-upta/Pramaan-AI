navbar_content = '''"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Github,
  ChevronDown,
  Menu,
  X,
  ArrowLeftRight,
  LogOut,
  LayoutDashboard,
  FileSpreadsheet,
  Award,
  UserCheck,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  Settings,
  Users,
  Mic,
} from "lucide-react";
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
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendState({
        live: health.live,
        mode: health.mode,
        latencyMs: health.latencyMs,
      });
    });
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "PA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Check if current route is part of secondary evaluator / student portal
  const isToolsActive =
    pathname?.startsWith("/evaluator") ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/u/");

  // Primary Linear Flow links for first-time users
  const isPipelineActive =
    pathname?.startsWith("/investigate") ||
    pathname?.startsWith("/evidence") ||
    pathname?.startsWith("/viva") ||
    pathname?.startsWith("/verdict");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo + Primary Flow Navigation */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center hover:opacity-90 transition">
            <Logo size={26} />
          </Link>

          <div className="h-4 w-px bg-zinc-800 hidden md:block mx-4" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 text-xs">
            {/* 1. Main Linear Flow: Audit Repository */}
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center space-x-1.5 ${
                pathname === "/"
                  ? "bg-zinc-900/90 text-zinc-100 shadow-sm border border-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              }`}
            >
              <FolderGit2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Audit Repo</span>
            </Link>

            {/* 2. Main Linear Flow: Active Pipeline / Demo Explorer */}
            <Link
              href="/investigate/demo-smart-campus"
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center space-x-1.5 ${
                isPipelineActive
                  ? "bg-zinc-900/90 text-zinc-100 shadow-sm border border-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Forensics Flow</span>
            </Link>

            {/* 3. Secondary Navigation Dropdown: Evaluator Portal & Advanced Tools */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center space-x-1.5 ${
                  isToolsActive || isToolsMenuOpen
                    ? "bg-zinc-900/90 text-zinc-100 border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>Evaluator Portal</span>
                <ChevronDown
                  className={`h-3 w-3 text-zinc-400 transition-transform ${
                    isToolsMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Secondary Tools Dropdown Modal */}
              {isToolsMenuOpen && (
                <div className="absolute left-0 mt-2 w-[480px] rounded-2xl border border-zinc-800 bg-[#09090b]/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-4">
                  {/* Column A: Institutional Evaluator Tools */}
                  <div className="space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center space-x-1">
                      <LayoutDashboard className="h-3 w-3 text-purple-400" />
                      <span>Evaluator Operations</span>
                    </div>

                    <Link
                      href="/evaluator/dashboard"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <LayoutDashboard className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Evaluator Dashboard
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Class telemetry, anomaly flags & viva reviews
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/evaluator/audits"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Batch CSV Audits
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Upload class rosters & bulk repository scans
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/evaluator/cohorts"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <Users className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Cohort Management
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Organize academic batches & student teams
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/evaluator/settings"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <Settings className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Settings & API Keys
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Webhooks, tokens & institutional policies
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Column B: Student & Verification Artifacts */}
                  <div className="space-y-1 border-l border-zinc-800/80 pl-4">
                    <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center space-x-1">
                      <UserCheck className="h-3 w-3 text-emerald-400" />
                      <span>Student &amp; Proofs</span>
                    </div>

                    <Link
                      href="/student/dashboard"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <UserCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Student Dashboard
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Personal score cards & verified submissions
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/student/portfolio"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Verified Portfolio
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Proof of work, skill badges & code radar
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/evaluator/audit/demo-smart-campus/certificate"
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <Award className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Verifiable Certificate
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Printable thermal receipt & QR proof
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/u/${user?.githubUsername || "rohit-sharma"}`}
                      className="flex items-start space-x-2.5 p-2 rounded-xl hover:bg-zinc-900/80 transition group"
                    >
                      <ExternalLink className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          Public Proof Link
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Tamper-proof URL for job applications
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Pricing */}
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                pathname === "/pricing"
                  ? "bg-zinc-900/90 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              }`}
            >
              Pricing
            </Link>

            {/* 5. Judge Showcase Pill */}
            <Link
              href="/pitch"
              className={`ml-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                pathname === "/pitch"
                  ? "border-emerald-500/50 bg-emerald-950/50 text-emerald-300"
                  : "border-emerald-500/30 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/30"
              }`}
            >
              Judge Showcase ✦
            </Link>
          </nav>
        </div>

        {/* Right: Tools & Micro-Interactions */}
        <div className="flex items-center space-x-2.5">
          {/* System Health Pill (Render FastAPI / GitHub Direct) */}
          <div className="hidden lg:flex items-center space-x-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-[11px] text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {backendState.live ? `FastAPI Render ${backendState.latencyMs ?? 18}ms` : "GitHub Direct Engine"}
            </span>
          </div>

          {/* User Account / Role Pill */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1 pr-2 hover:border-zinc-700 transition"
              >
                <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-200 flex items-center justify-center">
                  {getInitials(user.fullName)}
                </div>

                <span className="border border-zinc-700/80 bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                  {isEvaluator ? "EVALUATOR" : "STUDENT"}
                </span>

                <span className="hidden sm:inline text-xs font-medium text-zinc-200 max-w-[100px] truncate">
                  {user.fullName}
                </span>

                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-800/80">
                    <div className="font-semibold text-zinc-200 text-xs truncate">
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
                      className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white transition text-left"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Switch to {isEvaluator ? "Student" : "Evaluator"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 transition text-left"
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
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:bg-white hover:text-zinc-950 transition font-medium text-xs"
            >
              Sign In
            </Link>
          )}

          {/* GitHub Minimal Button */}
          <a
            href="https://github.com/ROhitg-upta/Pramaan-AI"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white p-2 rounded-lg text-zinc-400 transition"
          >
            <Github className="h-4 w-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 p-2 rounded-lg text-zinc-400 hover:text-white transition"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-2xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold px-2">
            Main Flow
          </div>

          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-900"
          >
            Audit Repository
          </Link>

          <Link
            href="/investigate/demo-smart-campus"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-900"
          >
            Forensic Investigation Flow
          </Link>

          <Link
            href="/pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-900"
          >
            Pricing
          </Link>

          {/* Secondary Collapsible Section in Mobile Drawer */}
          <div className="pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => setMobileToolsExpanded(!mobileToolsExpanded)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold"
            >
              <span>Evaluator &amp; Student Tools</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${mobileToolsExpanded ? "rotate-180" : ""}`} />
            </button>

            {mobileToolsExpanded && (
              <div className="mt-1 space-y-1 pl-2">
                <Link
                  href="/evaluator/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                >
                  Evaluator Dashboard
                </Link>
                <Link
                  href="/evaluator/audits"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                >
                  Batch CSV Audits
                </Link>
                <Link
                  href="/evaluator/cohorts"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                >
                  Cohort Management
                </Link>
                <Link
                  href="/student/portfolio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                >
                  Student Portfolio
                </Link>
                <Link
                  href="/evaluator/audit/demo-smart-campus/certificate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                >
                  Verifiable Certificate
                </Link>
                <Link
                  href={`/u/${user?.githubUsername || "rohit-sharma"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                >
                  Public Proof Dossier
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/pitch"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 mt-2 text-center"
          >
            Judge Showcase ✦
          </Link>
        </div>
      )}
    </header>
  );
};
'''

with open('frontend/src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(navbar_content)

print("Navbar.tsx updated successfully!")
