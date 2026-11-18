"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProofCertificatePDF } from "@/components/certificate/ProofCertificatePDF";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function CertificatePage() {
  const params = useParams();
  const auditId = (params?.id as string) || "demo-smart-campus";
  const isDemo = auditId === "demo-smart-campus";

  const certData = isDemo
    ? {
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
        isDemo: true,
      }
    : null; // Non-demo has no completed persisted assessment by default

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="no-print flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500">
          <Link href="/evaluator/audits" className="hover:text-zinc-300">
            Audits
          </Link>
          <span>/</span>
          <Link href={`/evidence/${auditId}`} className="hover:text-zinc-300">
            Evidence Wall
          </Link>
          <span>/</span>
          <span className="text-zinc-200">Official Diploma Certificate</span>
        </div>

        <Link
          href={`/evidence/${auditId}`}
          className="inline-flex items-center space-x-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Evidence Wall</span>
        </Link>
      </div>

      <ProofCertificatePDF data={certData} />
    </div>
  );
}
