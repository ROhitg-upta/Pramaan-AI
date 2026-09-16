"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  Award,
  Lock,
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export interface CertificateData {
  candidateName: string;
  githubUsername: string;
  repoName: string;
  branch: string;
  auditId: string;
  issueDate: string;
  commitsCount: number;
  tier3Lines: number;
  tier3Percentage: number;
  churnRatio: number;
  vivaScore: number;
  pramaanScore: number;
  grade: string;
  evaluatorName: string;
  evaluatorTitle: string;
  institution: string;
  sha256Hash: string;
}

const DEFAULT_CERT_DATA: CertificateData = {
  candidateName: "Rohit Sharma",
  githubUsername: "rohit-sharma",
  repoName: "demo/smart-campus-app",
  branch: "main",
  auditId: "PRM-2026-8FAE491C",
  issueDate: "September 16, 2026",
  commitsCount: 42,
  tier3Lines: 5420,
  tier3Percentage: 53.4,
  churnRatio: 38.2,
  vivaScore: 98,
  pramaanScore: 94,
  grade: "A",
  evaluatorName: "Prof. Alok Sharma",
  evaluatorTitle: "Faculty Lead & Principal Evaluator",
  institution: "Stanford Cyber-Forensics Lab & Hoollow Protocol",
  sha256Hash: "e4f81c9a882d9b136f874211a77489c623d548218fae491c77214f11b51c8e42",
};

export function ProofCertificatePDF({
  data = DEFAULT_CERT_DATA,
}: {
  data?: CertificateData;
}) {
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // 300 DPI equivalent
        useCORS: true,
        backgroundColor: "#0c0d12",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`Pramaan_Certificate_${data.githubUsername}_${data.auditId}.pdf`);
    } catch (err) {
      console.warn("jsPDF export failed, falling back to window.print():", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const verificationUrl = `https://pramaan.ai/u/${data.githubUsername}`;

  return (
    <div className="space-y-6">
      {/* Action Controls Bar (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center space-x-3 font-mono text-xs text-zinc-400">
          <Link
            href={`/u/${data.githubUsername}`}
            className="inline-flex items-center space-x-1.5 hover:text-zinc-100 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Candidate Profile</span>
          </Link>
          <span className="text-zinc-700">•</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Official 300 DPI Vector Diploma</span>
          </span>
        </div>

        <div className="flex items-center space-x-2.5 font-mono text-xs">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 px-4 py-2 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Layout</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center space-x-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2 font-medium shadow-sm transition disabled:opacity-50"
          >
            <Download className={`h-4 w-4 ${isGeneratingPdf ? "animate-bounce" : ""}`} />
            <span>{isGeneratingPdf ? "Generating Vector PDF..." : "Download Official PDF Certificate"}</span>
          </button>
        </div>
      </div>

      {/* Diploma Certificate Surface (A4 Landscape Canvas) */}
      <div
        ref={certificateRef}
        id="diploma-certificate"
        className="print-area relative mx-auto w-full max-w-[960px] bg-[#0c0d12] text-zinc-100 rounded-2xl border-2 border-[#27272a] shadow-2xl p-10 sm:p-14 overflow-hidden select-none"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Double Border Luxury Inlay */}
        <div className="absolute inset-3.5 border border-white/10 rounded-xl pointer-events-none" />
        <div className="absolute inset-5 border border-emerald-500/20 rounded-lg pointer-events-none" />

        {/* 1. Header: Emblem & Institution */}
        <div className="relative text-center space-y-2 mb-8">
          <div className="flex justify-center mb-3">
            {/* Geometric Proof Diamond Emblem */}
            <div className="h-14 w-14 rounded-2xl border border-emerald-500/40 bg-zinc-900/90 flex items-center justify-center shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L21 12L12 22L3 12L12 2Z"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" fill="#10b981" />
              </svg>
            </div>
          </div>

          <div className="font-mono text-[11px] tracking-[0.25em] text-emerald-400 font-bold uppercase">
            PRAMAAN AI • HOOLLOW PROTOCOL HORIZON
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100 uppercase">
            CERTIFICATE OF AUTHENTIC ENGINEERING PROOF
          </h1>

          <p className="font-mono text-xs text-zinc-400">
            Issued under the Hoollow Proof-of-Work Protocol • Academic Integrity Verification
          </p>
        </div>

        {/* 2. Recipient Attribution Statement */}
        <div className="relative text-center max-w-2xl mx-auto space-y-3 mb-8">
          <p className="font-body text-xs sm:text-sm text-zinc-400 italic">
            This certifies that the following candidate has successfully demonstrated genuine code authorship, iterative debugging cadence, and architectural comprehension under autonomous AI telemetry:
          </p>

          <div className="py-2">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 border-b border-emerald-500/40 pb-1.5 px-6">
              {data.candidateName}
            </span>
          </div>

          <p className="font-mono text-xs text-emerald-400 font-semibold">
            GitHub Identity: @{data.githubUsername} • Audit #{data.auditId}
          </p>
        </div>

        {/* 3. Forensic Evidence Verification Matrix */}
        <div className="relative rounded-xl border border-white/10 bg-zinc-950/80 p-5 mb-8 font-mono text-xs">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold border-b border-white/5 pb-2 mb-3">
            Forensic Telemetry Breakdown (PyDriller &amp; AST Analysis)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Audited Repository</div>
              <div className="font-bold text-zinc-200 mt-1 truncate">{data.repoName}</div>
              <div className="text-[10px] text-zinc-500">Branch: {data.branch}</div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Tier 3 Core Logic</div>
              <div className="font-bold text-emerald-400 mt-1">
                {data.tier3Lines.toLocaleString()} lines ({data.tier3Percentage}%)
              </div>
              <div className="text-[10px] text-zinc-500">High Cyclomatic Weight</div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Iterative Churn</div>
              <div className="font-bold text-emerald-400 mt-1">{data.churnRatio}%</div>
              <div className="text-[10px] text-zinc-500">Debugging Proven</div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Oral Defense Authenticity</div>
              <div className="font-bold text-emerald-400 mt-1">{data.vivaScore} / 100</div>
              <div className="text-[10px] text-zinc-500">Zero AI Fluff Detected</div>
            </div>
          </div>
        </div>

        {/* 4. Signatures, Dynamic QR Code, and Hash */}
        <div className="relative pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
          {/* Faculty Signature Block */}
          <div className="text-center sm:text-left space-y-1">
            <div className="font-serif italic text-lg text-zinc-200 border-b border-zinc-700 pb-1 inline-block">
              Alok Sharma
            </div>
            <div className="font-bold text-zinc-100">{data.evaluatorName}</div>
            <div className="text-[10px] text-zinc-400">{data.evaluatorTitle}</div>
            <div className="text-[10px] text-zinc-500">{data.institution}</div>
          </div>

          {/* Center: High-Res Dynamic QR Verification Code */}
          <div className="flex flex-col items-center space-y-1 text-center">
            <div className="p-2 rounded-xl bg-white shadow-md">
              <QRCodeSVG value={verificationUrl} size={64} level="H" />
            </div>
            <span className="text-[9px] text-zinc-500 tracking-wider">SCAN TO VERIFY</span>
          </div>

          {/* Right: Cryptographic Hash & Date */}
          <div className="text-center sm:text-right space-y-1 max-w-[240px]">
            <div className="text-[10px] text-zinc-400">Date Issued: {data.issueDate}</div>
            <div className="text-[9px] text-zinc-500 break-all leading-tight">
              SHA-256: {data.sha256Hash}
            </div>
            <div className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Pramaan Trust Grade: {data.grade} ({data.pramaanScore}/100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
