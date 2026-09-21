"use client";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendState({
        live: health.live,
        mode: health.mode,
        latencyMs: health.latencyMs,
      });
    });
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "PA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navLinks = isEvaluator
    ? [
        { label: "Dashboard", href: "/evaluator/dashboard", active: pathname === "/evaluator/dashboard" },
        { label: "Audits", href: "/evaluator/audits", active: pathname === "/evaluator/audits" },
        { label: "Cohorts", href: "/evaluator/cohorts", active: pathname?.startsWith("/evaluator/cohorts") },
        { label: "Settings", href: "/evaluator/settings", active: pathname?.startsWith("/evaluator/settings") },
        { label: "Pricing", href: "/pricing", active: pathname === "/pricing" },
      ]
    : [
        { label: "My Dashboard", href: "/student/dashboard", active: pathname === "/student/dashboard" },
        { label: "Viva Room", href: "/student/viva/ROOM-4A82", active: pathname?.startsWith("/student/viva") },
        { label: "Portfolio", href: "/student/portfolio", active: pathname === "/student/portfolio" },
        { label: "Public Proof", href: `/u/${user?.githubUsername || "rohit-sharma"}`, active: pathname?.startsWith("/u/") },
        { label: "Pricing", href: "/pricing", active: pathname === "/pricing" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Vertical Divider + Nav Links */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center hover:opacity-90 transition">
            <Logo size={26} />
          </Link>

          <div className="h-4 w-px bg-zinc-800 hidden md:block mx-4" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  link.active
                    ? "bg-zinc-900/90 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Judge Showcase Pill */}
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
          {/* System Health Pill */}
          <div className="hidden lg:flex items-center space-x-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-[11px] text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{backendState.live ? `FastAPI ${backendState.latencyMs ?? 15}ms` : "GitHub Direct"}</span>
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
        <div className="md:hidden border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                link.active
                  ? "bg-zinc-900 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/pitch"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 mt-1"
          >
            Judge Showcase ✦
          </Link>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Role: {isEvaluator ? "Evaluator" : "Student"}</span>
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{backendState.live ? "FastAPI Live" : "Direct Mode"}</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
