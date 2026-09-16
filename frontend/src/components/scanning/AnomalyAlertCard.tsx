"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertOctagon, X, GitCommit, User, Clock, AlertTriangle } from "lucide-react";
import { slamFromRight, slamTransition } from "@/lib/animations";

export interface AnomalyAlert {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  author: string;
  commitHash?: string;
  timestamp: string;
  deltaLines: string; // e.g. "+4,821 / -0 lines"
  description: string;
  explanation: string;
}

interface AnomalyAlertCardProps {
  alert: AnomalyAlert;
  onDismiss?: (id: string) => void;
}

export const AnomalyAlertCard: React.FC<AnomalyAlertCardProps> = ({
  alert,
  onDismiss,
}) => {
  const isCritical = alert.severity === "CRITICAL";

  return (
    <motion.div
      variants={slamFromRight}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={slamTransition}
      className={`rounded-xl border p-4 sm:p-5 shadow-2xl backdrop-blur-md transition-all ${
        isCritical
          ? "border-rose-500/30 bg-rose-950/20 text-rose-200"
          : "border-amber-500/30 bg-amber-950/20 text-amber-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              isCritical
                ? "border-rose-500/40 bg-rose-500/20 text-rose-400"
                : "border-amber-500/40 bg-amber-500/20 text-amber-400"
            }`}
          >
            {isCritical ? (
              <AlertOctagon className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold tracking-wider uppercase">
                {alert.type}
              </span>
              <span
                className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold uppercase tracking-wider ${
                  isCritical
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {alert.severity}
              </span>
            </div>
            <p className="font-body text-xs text-zinc-300 mt-0.5 font-medium">
              {alert.description}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="rounded p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Commit Meta Grid */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-zinc-950/60 p-2.5 font-mono text-[11px] border border-white/5">
        <div className="flex items-center space-x-1.5 text-zinc-400">
          <User className="h-3 w-3 text-zinc-500" />
          <span className="truncate text-zinc-200 font-medium">{alert.author}</span>
        </div>
        {alert.commitHash && (
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <GitCommit className="h-3 w-3 text-zinc-500" />
            <span className="text-zinc-300">{alert.commitHash}</span>
          </div>
        )}
        <div className="flex items-center space-x-1.5 text-zinc-400">
          <Clock className="h-3 w-3 text-zinc-500" />
          <span className="text-zinc-300">{alert.timestamp}</span>
        </div>
        <div className="text-right sm:text-left font-semibold text-rose-400">
          {alert.deltaLines}
        </div>
      </div>

      {/* Forensic Diagnostic Note */}
      <p className="mt-2.5 font-mono text-[11px] text-zinc-400 leading-normal">
        <span className="text-zinc-500 font-semibold">DIAGNOSIS:</span> {alert.explanation}
      </p>
    </motion.div>
  );
};
