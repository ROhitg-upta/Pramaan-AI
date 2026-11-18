"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // On the landing page, DoodleCrewFooter already provides the full sketchbook footer & badges
  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="border-t border-white/5 py-6 text-center font-mono text-xs text-zinc-500">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <span>Pramaan AI Enterprise</span>
        <span className="hidden sm:inline text-zinc-700">•</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-black px-3.5 py-1 text-[11px] font-medium tracking-wider text-zinc-100 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
        </span>
        <span className="hidden sm:inline text-zinc-700">•</span>
        <span>Horizon 2026</span>
      </div>
    </footer>
  );
}
