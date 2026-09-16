"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProofCertificatePDF } from "@/components/certificate/ProofCertificatePDF";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function CertificatePage() {
  const params = useParams();
  const auditId = (params?.id as string) || "demo-smart-campus";

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

      <ProofCertificatePDF />
    </div>
  );
}
