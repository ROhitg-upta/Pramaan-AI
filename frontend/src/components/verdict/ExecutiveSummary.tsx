"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, ShieldAlert } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

export interface ExecutiveSummaryProps {
  text: string;
  delay?: number; // ms
}

export function ExecutiveSummary({ text, delay = 300 }: ExecutiveSummaryProps) {
  const { displayedText, isComplete, cursorVisible } = useTypewriter(text, {
    speed: 14,
    delay,
    cursorBlink: true,
  });

  // Highlight key terms in displayed text
  const renderFormattedText = (raw: string) => {
    // Replace names and key numbers with styled spans
    const parts = raw.split(/(Rohit Sharma|Aryan Kumar|Priya Patel|Tier-3|38% churn ratio|4,821 lines|03:42 AM|zero deletions)/g);

    return parts.map((part, idx) => {
      if (part === "Rohit Sharma") {
        return (
          <span key={idx} className="text-emerald-400 font-semibold underline decoration-emerald-500/30">
            {part}
          </span>
        );
      }
      if (part === "Aryan Kumar") {
        return (
          <span key={idx} className="text-rose-400 font-semibold underline decoration-rose-500/30">
            {part}
          </span>
        );
      }
      if (part === "Priya Patel") {
        return (
          <span key={idx} className="text-amber-400 font-semibold">
            {part}
          </span>
        );
      }
      if (part === "Tier-3" || part === "38% churn ratio") {
        return (
          <span key={idx} className="text-cyan-300 font-mono font-medium">
            {part}
          </span>
        );
      }
      if (part === "4,821 lines" || part === "03:42 AM" || part === "zero deletions") {
        return (
          <span key={idx} className="text-rose-300 font-mono font-medium">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mt-14"
    >
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top edge subtle gradient glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1.5 pl-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              EXECUTIVE FORENSIC VERDICT
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI AUDIT SYNTHESIS</span>
          </div>
        </div>

        {/* Streaming Content */}
        <div className="font-mono text-sm leading-relaxed text-zinc-300">
          {renderFormattedText(displayedText)}
          {!isComplete && cursorVisible && (
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 translate-y-0.5 animate-pulse" />
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>SOURCE: AST Classifier v2.0 • GitForensics • VivaInterrogator</span>
          <span className="text-zinc-600">CONFIDENTIAL ACADEMIC REPORT</span>
        </div>
      </div>
    </motion.div>
  );
}
