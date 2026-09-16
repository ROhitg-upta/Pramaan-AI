"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitCommit, Layers, Mic } from "lucide-react";

export interface SubScoreBreakdownProps {
  gitForensics: number;
  astComplexity: number;
  vivaDefense: number;
  delay?: number;
}

export function SubScoreBreakdown({
  gitForensics,
  astComplexity,
  vivaDefense,
  delay = 0,
}: SubScoreBreakdownProps) {
  const items = [
    {
      id: "git",
      label: "Git Forensics",
      weight: "35%",
      score: gitForensics,
      icon: GitCommit,
      color:
        gitForensics >= 70
          ? "bg-emerald-500"
          : gitForensics >= 40
          ? "bg-amber-500"
          : "bg-rose-500",
      textColor:
        gitForensics >= 70
          ? "text-emerald-400"
          : gitForensics >= 40
          ? "text-amber-400"
          : "text-rose-400",
    },
    {
      id: "ast",
      label: "AST Complexity",
      weight: "25%",
      score: astComplexity,
      icon: Layers,
      color:
        astComplexity >= 70
          ? "bg-emerald-500"
          : astComplexity >= 40
          ? "bg-amber-500"
          : "bg-rose-500",
      textColor:
        astComplexity >= 70
          ? "text-emerald-400"
          : astComplexity >= 40
          ? "text-amber-400"
          : "text-rose-400",
    },
    {
      id: "viva",
      label: "Viva Defense",
      weight: "40%",
      score: vivaDefense,
      icon: Mic,
      color:
        vivaDefense >= 70
          ? "bg-emerald-500"
          : vivaDefense >= 40
          ? "bg-amber-500"
          : "bg-rose-500",
      textColor:
        vivaDefense >= 70
          ? "text-emerald-400"
          : vivaDefense >= 40
          ? "text-amber-400"
          : "text-rose-400",
    },
  ];

  return (
    <div className="w-full max-w-xs mt-6 space-y-3 px-2">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + idx * 0.12,
              ease: "easeOut",
            }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-zinc-400">
                <Icon className="w-3.5 h-3.5 text-zinc-500" />
                <span>{item.label}</span>
                <span className="text-[10px] text-zinc-600 font-normal">
                  ({item.weight})
                </span>
              </div>
              <span className={`font-bold ${item.textColor}`}>
                {item.score}
                <span className="text-zinc-600 font-normal">/100</span>
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(Math.max(item.score, 0), 100)}%` }}
                transition={{
                  duration: 0.8,
                  delay: delay + idx * 0.12 + 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
