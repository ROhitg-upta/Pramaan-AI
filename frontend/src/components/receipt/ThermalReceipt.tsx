"use client";

import React from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { type FullReportResponse } from "@/lib/mock-data";

export interface ThermalReceiptProps {
  report: FullReportResponse;
}

export function ThermalReceipt({ report }: ThermalReceiptProps) {
  const auditId = report.analysis_id
    ? `PRM-2026-${report.analysis_id.slice(0, 8).toUpperCase()}`
    : "PRM-2026-8FAE491C";

  const auditDate = "Sep 16, 2026  10:42 IST";
  const repoName = report.repo_url.replace("https://github.com/", "") || "team/capstone-project";
  const verificationUrl = `https://pramaan.ai/verify/${auditId}`;
  const sha256Hash = "e4f81c9a882d9b136f874211a77489c623d54821";

  // Helpers to pad with dots for classic receipt look
  const formatReceiptRow = (left: string, right: string, totalWidth = 32) => {
    const spacesNeeded = Math.max(totalWidth - left.length - right.length, 1);
    return `${left}${".".repeat(spacesNeeded)}${right}`;
  };

  return (
    <motion.div
      initial={{ maxHeight: 0, opacity: 0 }}
      animate={{ maxHeight: 2000, opacity: 1 }}
      transition={{
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full max-w-[390px] mx-auto overflow-hidden mt-16"
      id="pramaan-thermal-receipt"
    >
      {/* Torn Edge Thermal Paper Container */}
      <div
        style={{
          clipPath: `polygon(
            0% 1.5%, 4% 0%, 8% 1.8%, 12% 0.5%, 16% 2.2%, 20% 0%, 24% 1.8%,
            28% 0.6%, 32% 2%, 36% 0%, 40% 1.8%, 44% 0.4%, 48% 2%, 52% 0%,
            56% 1.7%, 60% 0.4%, 64% 2.1%, 68% 0%, 72% 1.8%, 76% 0.5%, 80% 2%,
            84% 0%, 88% 1.8%, 92% 0.6%, 96% 2%, 100% 0.8%,
            100% 98.5%, 96% 100%, 92% 98.2%, 88% 99.5%, 84% 97.8%, 80% 100%,
            76% 98.2%, 72% 99.4%, 68% 98%, 64% 100%, 60% 98.2%, 56% 99.6%,
            52% 98%, 48% 100%, 44% 98.3%, 40% 99.6%, 36% 97.9%, 32% 100%,
            28% 98.2%, 24% 99.5%, 20% 97.9%, 16% 100%, 12% 98.2%, 8% 99.4%,
            4% 98%, 0% 99%
          )`,
        }}
        className="relative bg-[#131722] text-zinc-300 font-mono text-[12px] leading-relaxed p-7 pt-9 pb-10 shadow-2xl border-x border-zinc-800 select-none"
      >
        {/* Subtle Thermal Noise Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />

        {/* 1. Header */}
        <div className="text-center space-y-1">
          <div className="text-base font-bold tracking-[0.25em] text-white">
            ⚖️ PRAMAAN AI
          </div>
          <div className="text-[11px] tracking-[0.2em] text-zinc-400">
            PROOF-OF-WORK RECEIPT
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 text-zinc-600 tracking-tighter overflow-hidden">
          ══════════════════════════════════════
        </div>

        {/* 2. Metadata */}
        <div className="space-y-1 text-zinc-400 text-[11px]">
          <div className="flex justify-between">
            <span className="text-zinc-500">AUDIT ID:</span>
            <span className="text-zinc-200 font-bold">{auditId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">DATE:</span>
            <span className="text-zinc-300">{auditDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">REPO:</span>
            <span className="text-zinc-300 truncate max-w-[200px]">
              {repoName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">BRANCH:</span>
            <span className="text-zinc-300">{report.branch || "main"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">COMMITS AUDITED:</span>
            <span className="text-zinc-300">{report.total_commits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">LINES AUDITED:</span>
            <span className="text-zinc-300">
              {report.total_lines_audited.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 text-zinc-600 tracking-tighter overflow-hidden">
          ══════════════════════════════════════
        </div>

        {/* 3. Contributor Breakdown */}
        <div className="space-y-3">
          <div className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold">
            CONTRIBUTOR BREAKDOWN
          </div>

          {report.contributors.map((contrib) => {
            const isVerified = (contrib.pramaan_score ?? 0) >= 70;
            const isFluff = (contrib.pramaan_score ?? 0) < 40;

            const icon = isVerified ? "✅" : isFluff ? "🔴" : "⚠️";
            const scoreStr = `${contrib.pramaan_score ?? 0}/100`;

            return (
              <div key={contrib.id} className="space-y-0.5">
                <div className="flex justify-between items-center text-zinc-200 font-semibold">
                  <span className="truncate max-w-[190px]">
                    {contrib.primary_name}
                  </span>
                  <span className="text-right">
                    {icon} {scoreStr}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 pl-2">
                  Git:{contrib.sub_scores.git_forensics}&nbsp; AST:
                  {contrib.sub_scores.ast_complexity}&nbsp; Viva:
                  {contrib.sub_scores.viva_defense ?? "--"}
                </div>
                <div className="text-[10px] text-zinc-500 pl-2">
                  Status:{" "}
                  <span
                    className={
                      isVerified
                        ? "text-emerald-400 font-medium"
                        : isFluff
                        ? "text-rose-400 font-medium"
                        : "text-amber-400 font-medium"
                    }
                  >
                    {contrib.verdict.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-3 text-zinc-700 tracking-tighter overflow-hidden">
          ──────────────────────────────────────
        </div>

        {/* 4. Integrity Grade & Verdict */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-zinc-500 font-bold">INTEGRITY GRADE:</span>
            <span className="text-lg font-black text-amber-400">
              {report.integrity_grade || "B+"}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">
            VERDICT:{" "}
            <span className="text-zinc-200">
              {report.contributors.filter((c) => (c.pramaan_score ?? 0) >= 70).length}{" "}
              of {report.contributors.length} contributors verified as authentic.
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 text-zinc-600 tracking-tighter overflow-hidden">
          ══════════════════════════════════════
        </div>

        {/* 5. Dynamic QR Code */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <div className="p-2.5 bg-white rounded-lg shadow-inner">
            <QRCodeSVG
              value={verificationUrl}
              size={116}
              bgColor="#ffffff"
              fgColor="#09090b"
              level="M"
            />
          </div>
          <div className="text-[10px] text-zinc-500 tracking-wider">
            Scan to verify cryptographic proof
          </div>
        </div>

        {/* 6. Verification Hash */}
        <div className="mt-3 text-center space-y-0.5">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            PROOF-OF-WORK HASH
          </div>
          <div className="text-[10px] font-mono text-zinc-400 break-all select-all">
            sha256:{sha256Hash}
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 text-zinc-700 tracking-tighter overflow-hidden">
          ──────────────────────────────────────
        </div>

        {/* 7. Footer */}
        <div className="text-center space-y-1 pt-1 text-[10px] text-zinc-500 leading-normal">
          <div className="font-semibold text-zinc-400 italic">
            &ldquo;Har Code Ka Pramaan.&rdquo;
          </div>
          <div className="tracking-widest uppercase text-[9px] text-zinc-600">
            VERIFIED UNDER HOOLLOW
          </div>
          <div className="tracking-widest uppercase text-[9px] text-zinc-600">
            PROOF-OF-WORK PROTOCOL
          </div>
          <div className="text-zinc-500 pt-1 text-[9px]">
            pramaanai.vercel.app
          </div>
        </div>
      </div>
    </motion.div>
  );
}
