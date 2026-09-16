"use client";

import React from "react";

/**
 * Modern Developer Background
 * Minimalist subtle grid + soft radial dark vignette (Linear/Vercel style)
 */
export const ForensicGridBg: React.FC = () => {
  return (
    <>
      {/* Precision Grid Layer */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Soft Vignette */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.06),rgba(9,9,11,0))]"
        aria-hidden="true"
      />
    </>
  );
};
