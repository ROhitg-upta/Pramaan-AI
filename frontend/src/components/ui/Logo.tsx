"use client";

import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * Pramaan AI — Minimalist Geometric Logo
 * Converging Git commit branches forming a cryptographic Proof Diamond.
 * Linear / Vercel developer-first aesthetic.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 28,
  className = "",
  showText = true,
}) => {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Ambient Glow */}
        <circle cx="16" cy="16" r="14" className="fill-emerald-500/10" />

        {/* Git Branch Lines Converging */}
        <path
          d="M7 8V18C7 20.2091 8.79086 22 11 22H14"
          stroke="#71717A"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M25 8V18C25 20.2091 23.2091 22 21 22H18"
          stroke="#71717A"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Commit Nodes */}
        <circle cx="7" cy="8" r="2.25" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5" />
        <circle cx="25" cy="8" r="2.25" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.5" />

        {/* Central Proof Diamond / Verification Core */}
        <path
          d="M16 6L22 14L16 26L10 14L16 6Z"
          fill="url(#diamondGradient)"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 14H22"
          stroke="#10B981"
          strokeWidth="1.25"
          strokeOpacity="0.7"
        />
        <circle cx="16" cy="14" r="1.75" fill="#34D399" />

        {/* Gradients */}
        <defs>
          <linearGradient
            id="diamondGradient"
            x1="16"
            y1="6"
            x2="16"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#10B981" stopOpacity="0.3" />
            <stop stopColor="#059669" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex items-center space-x-1.5">
          <span className="font-display text-base font-semibold tracking-tight text-zinc-100">
            Pramaan
          </span>
          <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
