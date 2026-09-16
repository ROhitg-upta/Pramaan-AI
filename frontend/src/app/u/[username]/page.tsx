"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Github,
  GitBranch,
  Copy,
  Check,
  Award,
  Lock,
  ExternalLink,
  Sparkles,
  Layers,
  Code2,
  Calendar,
} from "lucide-react";

export default function PublicProofProfile() {
  const params = useParams();
  const username = (params?.username as string) || "rohit-sharma";
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const isAryan = username.toLowerCase().includes("aryan");

  const badgeMarkdown = `[![Pramaan Proof](https://pramaan.ai/api/badge/${username})](https://pramaan.ai/u/${username})`;
  const badgeHtml = `<a href="https://pramaan.ai/u/${username}"><img src="https://pramaan.ai/api/badge/${username}" alt="Pramaan Proof of Work" /></a>`;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(badgeHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Profile Header Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div
              className={`h-16 w-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold text-white shadow-xl ${
                !isAryan ? "bg-emerald-600" : "bg-rose-600"
              }`}
            >
              {!isAryan ? "RS" : "AK"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-zinc-100">
                  {!isAryan ? "Rohit Sharma" : "Aryan Kumar"}
                </h1>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 font-mono text-xs text-zinc-400 hover:text-zinc-200"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>@{username}</span>
                </a>
              </div>

              <div className="mt-1 font-mono text-xs text-zinc-400">
                Pramaan Certified Contributor • Stanford Forensics Network
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div>
            {!isAryan ? (
              <div className="inline-flex items-center space-x-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-bold text-emerald-400 shadow-md">
                <CheckCircle2 className="h-4 w-4" />
                <span>✓ HOOLLOW VERIFIED BUILDER</span>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-mono text-xs font-bold text-rose-400 shadow-md">
                <XCircle className="h-4 w-4" />
                <span>✕ FAILS PROOF-OF-WORK STANDARD</span>
              </div>
            )}
          </div>
        </div>

        {/* Tagline Banner */}
        <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-emerald-400/90">
            &ldquo;Degrees can be faked. Commits can be copied. Proof of Work cannot.&rdquo;
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Trust Hash: <span className="text-zinc-400">0x8f7e...2b91</span>
          </span>
        </div>

        {/* Cumulative Builder Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 text-center">
            <div className="text-zinc-500 text-[10px] uppercase">Verified Commits</div>
            <div className="text-2xl font-bold mt-1 text-zinc-200">
              {!isAryan ? "142" : "2"}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">PyDriller Mined</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 text-center">
            <div className="text-zinc-500 text-[10px] uppercase">Iterative Churn</div>
            <div className={`text-2xl font-bold mt-1 ${!isAryan ? "text-emerald-400" : "text-rose-400"}`}>
              {!isAryan ? "38.2%" : "0.0%"}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">{!isAryan ? "Refactor Proof" : "Monolithic Dump"}</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 text-center">
            <div className="text-zinc-500 text-[10px] uppercase">Tier 3 Core Logic</div>
            <div className={`text-2xl font-bold mt-1 ${!isAryan ? "text-emerald-400" : "text-zinc-400"}`}>
              {!isAryan ? "7,217 Lines" : "89 Lines"}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">AST Tree Complexity</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-950 p-3.5 text-center">
            <div className="text-zinc-500 text-[10px] uppercase">Viva Authenticity</div>
            <div className={`text-2xl font-bold mt-1 ${!isAryan ? "text-emerald-400" : "text-rose-400"}`}>
              {!isAryan ? "98 / 100" : "24 / 100"}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">{!isAryan ? "Zero Fluff" : "Evasive Flags"}</div>
          </div>
        </div>
      </div>

      {/* 2. Audited Repositories Evidence Grid */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <h3 className="font-display text-base font-bold text-zinc-100 border-b border-white/5 pb-3">
          Audited Repository Evidence &amp; Proof Receipts
        </h3>

        <div className="rounded-xl border border-white/5 bg-zinc-950 p-5 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-sm text-zinc-200">smart-campus-app</span>
              <span className="text-zinc-500 text-[11px]">(Role: Primary Architect)</span>
            </div>
            <Link
              href="/verdict/demo-smart-campus"
              className="text-emerald-400 hover:underline inline-flex items-center space-x-1 text-[11px]"
            >
              <span>View Cryptographic Thermal Proof Receipt</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <p className="text-zinc-400 text-[11px] leading-relaxed">
            {!isAryan
              ? "38 atomic commits across 14 active days. Successfully defended JWT refresh rotation and concurrency mutex locks in autonomous oral defense with Prof. Alok Sharma."
              : "1 single monolithic commit of +4,821 lines at 03:42 AM within 8 hours of deadline. Oral defense revealed generic documentation regurgitation without architectural comprehension."}
          </p>
        </div>
      </div>

      {/* 3. Embeddable Dynamic SVG Badge Generator */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur-xl shadow-2xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h4 className="font-display text-sm font-bold text-zinc-100">
              Embeddable GitHub README SVG Badge
            </h4>
            <p className="text-zinc-500 text-[11px]">
              Dynamic Shields.io-compatible vector badge served directly from Pramaan API.
            </p>
          </div>

          {/* Live Badge Preview */}
          <div className="bg-zinc-950 p-1.5 rounded-lg border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/badge/${username}`}
              alt="Pramaan Proof of Work Badge"
              className="h-7 w-auto"
            />
          </div>
        </div>

        {/* Markdown Embed Snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Markdown (GitHub README.md):</span>
            <button
              type="button"
              onClick={copyMarkdown}
              className="text-emerald-400 hover:underline flex items-center space-x-1"
            >
              {copiedMd ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copiedMd ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <div className="rounded-xl bg-zinc-950 p-3 text-zinc-300 border border-white/5 select-all overflow-x-auto text-[11px]">
            {badgeMarkdown}
          </div>
        </div>

        {/* HTML Embed Snippet */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>HTML (Personal Portfolio / Resume):</span>
            <button
              type="button"
              onClick={copyHtml}
              className="text-emerald-400 hover:underline flex items-center space-x-1"
            >
              {copiedHtml ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copiedHtml ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <div className="rounded-xl bg-zinc-950 p-3 text-zinc-300 border border-white/5 select-all overflow-x-auto text-[11px]">
            {badgeHtml}
          </div>
        </div>
      </div>
    </div>
  );
}
