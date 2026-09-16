"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertOctagon, HelpCircle, ShieldCheck } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

export interface ScoreRevealCircleProps {
  score: number;
  name: string;
  verdict: string;
  color: "emerald" | "amber" | "crimson";
  delay?: number; // seconds
  onAnimationComplete?: () => void;
}

export function ScoreRevealCircle({
  score,
  name,
  verdict,
  color,
  delay = 0,
  onAnimationComplete,
}: ScoreRevealCircleProps) {
  const radius = 68;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  // Numerical count-up hook
  const { value: animatedScore, isComplete } = useCountUp(
    score,
    1800,
    0,
    Math.round(delay * 1000)
  );

  useEffect(() => {
    if (isComplete && onAnimationComplete) {
      const t = setTimeout(() => {
        onAnimationComplete();
      }, 150);
      return () => clearTimeout(t);
    }
  }, [isComplete, onAnimationComplete]);

  // Color mappings
  const strokeColors = {
    emerald: "#10b981",
    amber: "#f59e0b",
    crimson: "#ef4444",
  };

  const glowShadows = {
    emerald: "0 0 24px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.15)",
    amber: "0 0 24px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.15)",
    crimson: "0 0 24px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.15)",
  };

  const badgeStyles = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    crimson: "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
  };

  const formattedVerdict = verdict
    .replace(/_/g, " ")
    .toUpperCase();

  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay,
        type: "spring",
        stiffness: 220,
        damping: 24,
      }}
      className="flex flex-col items-center text-center group"
    >
      {/* Circle Container */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Ambient backglow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity duration-1000"
          style={{ backgroundColor: strokeColors[color] }}
        />

        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox="0 0 160 160"
        >
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#27272a"
            strokeWidth={strokeWidth}
            className="opacity-50"
          />

          {/* Animated Radial Stroke */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={strokeColors[color]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1.8,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(${glowShadows[color]})`,
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline font-mono tracking-tight">
            <span className="text-5xl font-black text-white">
              {animatedScore}
            </span>
            <span className="text-zinc-500 text-sm font-semibold ml-1">/100</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-0.5">
            PRAMAAN SCORE
          </span>
        </div>
      </div>

      {/* Contributor Name */}
      <h3 className="text-xl font-bold font-display text-zinc-100 mt-5 tracking-tight group-hover:text-white transition">
        {name}
      </h3>

      {/* Verdict Badge */}
      <div
        className={`mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${badgeStyles[color]}`}
      >
        {color === "emerald" && <ShieldCheck className="w-3.5 h-3.5" />}
        {color === "amber" && <HelpCircle className="w-3.5 h-3.5" />}
        {color === "crimson" && <AlertOctagon className="w-3.5 h-3.5" />}
        <span>{formattedVerdict}</span>
      </div>
    </motion.div>
  );
}
