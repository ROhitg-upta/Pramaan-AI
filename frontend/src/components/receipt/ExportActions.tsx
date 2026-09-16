"use client";

import React, { useState } from "react";
import { Download, Copy, Share2, Check, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ExportActionsProps {
  analysisId: string;
}

export function ExportActions({ analysisId }: ExportActionsProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://pramaan.ai/verdict/${analysisId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyReceipt = async () => {
    const textReceipt = `
========================================
       ⚖️ PRAMAAN AI VERDICT
========================================
AUDIT ID: PRM-2026-${analysisId.slice(0, 8).toUpperCase()}
STATUS: VERIFIED UNDER HOOLLOW PROTOCOL

• Rohit Sharma: 94/100 (VERIFIED BUILDER)
  Git: 92 | AST: 88 | Viva: 98
• Aryan Kumar: 24/100 (SUSPECT FREELOADER)
  Git: 12 | AST: 18 | Viva: 24

Integrity Grade: B+
Hash: sha256:e4f81c9a882d9b136f874211a77489c623d54821
https://pramaan.ai/verdict/${analysisId}
========================================
    `;

    try {
      await navigator.clipboard.writeText(textReceipt.trim());
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
      {/* 0. Official Vector PDF Diploma Certificate */}
      <Link
        href={`/evaluator/audit/${analysisId}/certificate`}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-medium shadow-sm transition"
      >
        <Download className="w-3.5 h-3.5 text-zinc-950" />
        <span>Download Official PDF Certificate 📄</span>
      </Link>

      {/* 1. Download / Print PDF */}
      <button
        onClick={handlePrintPdf}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-semibold shadow-lg hover:border-zinc-700 transition"
      >
        <Download className="w-3.5 h-3.5 text-zinc-400" />
        <span>Print Receipt</span>
      </button>

      {/* 2. Copy Receipt Text */}
      <button
        onClick={handleCopyReceipt}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-semibold shadow-lg hover:border-zinc-500 transition"
      >
        {copiedReceipt ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Receipt Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
            <span>Copy Receipt</span>
          </>
        )}
      </button>

      {/* 3. Share / Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 text-xs font-mono font-semibold shadow-lg hover:border-emerald-500/60 transition"
      >
        {copiedLink ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Share Verification</span>
          </>
        )}
      </button>

      {/* 4. Return to Evidence Wall */}
      <Link
        href={`/evidence/${analysisId}`}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Evidence Wall</span>
      </Link>
    </div>
  );
}
