"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import Link from "next/link";

export interface DoodleCrewFooterProps {
  brandWordmark?: string;
  tagline?: string;
  className?: string;
  onCtaClick?: () => void;
}

interface CharacterQuote {
  character: "yeti" | "kid" | "ghost" | "cat";
  quotes: string[];
}

const CHARACTER_QUOTES: CharacterQuote[] = [
  {
    character: "yeti",
    quotes: [
      "No freeloaders allowed!",
      "Zero AI fluff detected!",
      "PyDriller mining deep git history...",
      "Proof of Work > Degree!",
    ],
  },
  {
    character: "kid",
    quotes: [
      "Proof of Work > Degree!",
      "100% AST verified code!",
      "I built this whole state machine!",
      "Passed oral viva with 98% score!",
    ],
  },
  {
    character: "ghost",
    quotes: [
      "Har code ka pramaan!",
      "Git blame never lies...",
      "I was committed at 3:14 AM!",
      "Levenshtein alias deduplicated!",
    ],
  },
  {
    character: "cat",
    quotes: [
      "Verified under Hoollow Protocol!",
      "Shipped straight to production!",
      "Merged with zero merge conflicts!",
      "Autonomous forensics approved!",
    ],
  },
];

const FALLING_DOODLES = [
  { id: 1, type: "star", left: "6%", top: "12%", size: 22, delay: "0s", dur: "7s", rotate: 15 },
  { id: 2, type: "commit", left: "15%", top: "45%", size: 28, delay: "1.2s", dur: "8.5s", rotate: -20 },
  { id: 3, type: "asterisk", left: "24%", top: "18%", size: 18, delay: "2.4s", dur: "6s", rotate: 45 },
  { id: 4, type: "brace-open", left: "34%", top: "60%", size: 24, delay: "0.8s", dur: "9s", rotate: -10 },
  { id: 5, type: "sparkle", left: "44%", top: "25%", size: 20, delay: "3s", dur: "7.5s", rotate: 30 },
  { id: 6, type: "arrow", left: "55%", top: "52%", size: 32, delay: "1.8s", dur: "8s", rotate: -35 },
  { id: 7, type: "brace-close", left: "66%", top: "22%", size: 24, delay: "2.8s", dur: "7s", rotate: 12 },
  { id: 8, type: "star", left: "75%", top: "55%", size: 26, delay: "0.4s", dur: "6.8s", rotate: -25 },
  { id: 9, type: "commit", left: "85%", top: "15%", size: 30, delay: "3.5s", dur: "9.2s", rotate: 40 },
  { id: 10, type: "sparkle", left: "93%", top: "40%", size: 22, delay: "1.5s", dur: "7.8s", rotate: -15 },
];

export function DoodleCrewFooter({
  brandWordmark = "PRAMAAN AI",
  tagline = "Autonomous Code Forensics & Hoollow Proof-of-Work Verification",
  className = "",
  onCtaClick,
}: DoodleCrewFooterProps) {
  const containerRef = useRef<HTMLElement>(null);
  const filterId = useId().replace(/:/g, "_");

  // Mouse coordinates relative to footer for eye pupil tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  // Hopping animation and speech bubble state per character
  const [activeSpeech, setActiveSpeech] = useState<{
    character: string;
    text: string;
  } | null>({
    character: "kid",
    text: "Proof of Work > Degree!",
  });

  const [hoppingChar, setHoppingChar] = useState<string | null>(null);
  const [quoteIndices, setQuoteIndices] = useState<Record<string, number>>({
    yeti: 0,
    kid: 0,
    ghost: 0,
    cat: 0,
  });

  // Storyboard scroll-into-view entrance
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Track mouse movements for pupil tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos((prev) => ({ ...prev, active: false }));
  }, []);

  // Character click handler (trigger hop + speech bubble cycle)
  const handleCharacterClick = (charId: "yeti" | "kid" | "ghost" | "cat") => {
    setHoppingChar(charId);
    setTimeout(() => setHoppingChar(null), 600);

    const charConfig = CHARACTER_QUOTES.find((c) => c.character === charId);
    if (!charConfig) return;

    const nextIndex = ((quoteIndices[charId] || 0) + 1) % charConfig.quotes.length;
    setQuoteIndices((prev) => ({ ...prev, [charId]: nextIndex }));
    setActiveSpeech({
      character: charId,
      text: charConfig.quotes[nextIndex],
    });
  };

  // Helper to calculate eye pupil offset relative to mouse
  const calculatePupilOffset = (
    eyeAnchorXPercent: number,
    eyeAnchorYPercent: number,
    maxOffset = 3.5
  ) => {
    if (!mousePos.active || !containerRef.current) {
      return { dx: 0, dy: 0 };
    }
    const rect = containerRef.current.getBoundingClientRect();
    const eyePxX = (eyeAnchorXPercent / 100) * rect.width;
    const eyePxY = (eyeAnchorYPercent / 100) * rect.height;

    const diffX = mousePos.x - eyePxX;
    const diffY = mousePos.y - eyePxY;
    const angle = Math.atan2(diffY, diffX);
    const dist = Math.sqrt(diffX * diffX + diffY * diffY);

    const clamp = Math.min(dist * 0.05, maxOffset);
    return {
      dx: Math.cos(angle) * clamp,
      dy: Math.sin(angle) * clamp,
    };
  };

  const yetiPupil = calculatePupilOffset(18, 38);
  const kidPupil = calculatePupilOffset(38, 40);
  const ghostPupil = calculatePupilOffset(62, 34);
  const catPupil = calculatePupilOffset(84, 38);

  // Split wordmark into letters for hover wobble
  const letters = brandWordmark.split("");

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden border-t border-white/10 bg-[#07090D] text-zinc-300 selection:bg-emerald-500/20 selection:text-emerald-300 ${className}`}
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.08), transparent 70%),
                          radial-gradient(circle at 10% 90%, rgba(6, 182, 212, 0.04), transparent 40%),
                          radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.04), transparent 40%)`,
      }}
    >
      {/* SVG Dry-Brush Ink Filter Definition */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={`dry-brush-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Floating Hand-Drawn Background Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
        {FALLING_DOODLES.map((doodle) => (
          <div
            key={doodle.id}
            className="absolute transition-transform duration-1000 ease-out"
            style={{
              left: doodle.left,
              top: doodle.top,
              animation: `doodleDrift ${doodle.dur} ease-in-out infinite alternate`,
              animationDelay: doodle.delay,
              transform: `rotate(${doodle.rotate}deg)`,
            }}
          >
            {doodle.type === "star" && (
              <svg width={doodle.size} height={doodle.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" stroke="rgba(241, 245, 249, 0.7)" />
              </svg>
            )}
            {doodle.type === "commit" && (
              <svg width={doodle.size} height={doodle.size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="16" y1="2" x2="16" y2="30" stroke="#10B981" strokeDasharray="3 3" />
                <circle cx="16" cy="16" r="6" stroke="#10B981" fill="#07090D" />
                <circle cx="16" cy="16" r="2.5" fill="#10B981" />
              </svg>
            )}
            {doodle.type === "asterisk" && (
              <svg width={doodle.size} height={doodle.size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 2V18M3 6L17 14M3 14L17 6" stroke="rgba(16, 185, 129, 0.6)" strokeLinecap="round" />
              </svg>
            )}
            {doodle.type === "brace-open" && (
              <span className="font-mono text-emerald-400/40 text-xl font-bold select-none">{`{`}</span>
            )}
            {doodle.type === "brace-close" && (
              <span className="font-mono text-cyan-400/40 text-xl font-bold select-none">{`}`}</span>
            )}
            {doodle.type === "sparkle" && (
              <svg width={doodle.size} height={doodle.size} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#10B981" />
                <path d="M12 4V7M12 17V20M4 12H7M17 12H20" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            {doodle.type === "arrow" && (
              <svg width={doodle.size} height={doodle.size} viewBox="0 0 40 30" fill="none" stroke="#F1F5F9" strokeWidth="1.6" strokeLinecap="round">
                <path d="M4 20 C 14 6, 26 8, 36 14" />
                <path d="M30 8 L 36 14 L 32 20" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Main Sketchbook Section */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top Storyboard Intro & Speech Bubble Stage */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          {/* Active Character Speech Bubble */}
          <div
            className={`transition-all duration-300 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } mb-4`}
          >
            {activeSpeech && (
              <div className="relative inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-md">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-medium text-emerald-300 tracking-wide">
                  <strong className="uppercase text-white/90 mr-1.5 font-bold">
                    {activeSpeech.character}:
                  </strong>
                  &ldquo;{activeSpeech.text}&rdquo;
                </span>
                {/* Speech tail pointing down */}
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-8 border-t-emerald-500/30" />
              </div>
            )}
          </div>

          {/* Section Tagline */}
          <h3 className="text-sm uppercase tracking-[0.25em] font-mono text-zinc-400/80 mb-2">
            Sketchbook of Autonomous Proof
          </h3>
          <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-body">
            {tagline}
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* GIANT DRY-BRUSH INK WORDMARK & LIVING CHARACTERS CREW             */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="relative my-8 sm:my-14 select-none">
          {/* Character 1: THE YETI (Forensics Scanner) */}
          <div
            onClick={() => handleCharacterClick("yeti")}
            className={`absolute -top-16 sm:-top-24 left-[8%] sm:left-[12%] z-20 cursor-pointer group transition-transform ${
              hoppingChar === "yeti" ? "animate-doodleHop" : "hover:-translate-y-1"
            }`}
            title="Click Yeti: 'No freeloaders allowed!'"
          >
            <div className="relative">
              {/* Yeti SVG */}
              <svg width="84" height="84" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
                {/* Horns */}
                <path d="M28 35 C 22 22, 16 26, 24 16 C 30 24, 32 30, 32 36" fill="#10B981" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
                <path d="M72 35 C 78 22, 84 26, 76 16 C 70 24, 68 30, 68 36" fill="#10B981" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
                {/* Fluffy Body / Head */}
                <path
                  d="M26 45 C 24 32, 76 32, 74 45 C 84 52, 86 74, 76 86 C 68 94, 32 94, 24 86 C 14 74, 16 52, 26 45 Z"
                  fill="#0D1117"
                  stroke="#F1F5F9"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Belly patch */}
                <ellipse cx="50" cy="70" rx="18" ry="12" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
                {/* Left Eye */}
                <ellipse cx="40" cy="52" rx="7" ry="7" fill="#F1F5F9" stroke="#0D1117" strokeWidth="1.5" />
                <circle
                  cx={40 + yetiPupil.dx}
                  cy={52 + yetiPupil.dy}
                  r="3.2"
                  fill="#0D1117"
                  className="transition-all duration-75"
                />
                <circle cx={38.5 + yetiPupil.dx * 0.5} cy={50.5 + yetiPupil.dy * 0.5} r="1" fill="#FFFFFF" />
                {/* Right Eye */}
                <ellipse cx="60" cy="52" rx="7" ry="7" fill="#F1F5F9" stroke="#0D1117" strokeWidth="1.5" />
                <circle
                  cx={60 + yetiPupil.dx}
                  cy={52 + yetiPupil.dy}
                  r="3.2"
                  fill="#0D1117"
                  className="transition-all duration-75"
                />
                <circle cx={58.5 + yetiPupil.dx * 0.5} cy={50.5 + yetiPupil.dy * 0.5} r="1" fill="#FFFFFF" />
                {/* Smile & Fangs */}
                <path d="M42 66 Q 50 72 58 66" stroke="#F1F5F9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <polygon points="46,67 48,72 50,68" fill="#10B981" />
                {/* Forensics scanner magnifying glass held by paw */}
                <path d="M74 65 L 86 75" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                <circle cx="86" cy="75" r="7" stroke="#10B981" strokeWidth="2.5" fill="rgba(16,185,129,0.2)" />
              </svg>
              {/* Speech Hint Badge on Hover */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-[10px] font-mono px-2 py-0.5 rounded text-zinc-300 pointer-events-none whitespace-nowrap shadow-md">
                Forensics Bot
              </div>
            </div>
          </div>

          {/* Character 2: THE BUILDER KID (Legs Dangling) */}
          <div
            onClick={() => handleCharacterClick("kid")}
            className={`absolute -top-16 sm:-top-20 left-[34%] sm:left-[36%] z-20 cursor-pointer group transition-transform ${
              hoppingChar === "kid" ? "animate-doodleHop" : "hover:-translate-y-1"
            }`}
            title="Click Builder: 'Proof of Work > Degree!'"
          >
            <div className="relative">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
                {/* Backward Cap */}
                <path d="M28 42 C 30 26, 70 26, 72 42 Z" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
                <path d="M68 40 C 76 40, 84 45, 82 50 C 74 48, 68 44, 68 40 Z" fill="#047857" stroke="#065F46" strokeWidth="1.5" />
                {/* Face */}
                <path d="M30 42 C 30 64, 70 64, 70 42 Z" fill="#1E293B" stroke="#F1F5F9" strokeWidth="3" />
                {/* Hair tuft */}
                <path d="M32 42 Q 36 36 40 42" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" />
                {/* Left Eye */}
                <circle cx="42" cy="48" r="5" fill="#F1F5F9" />
                <circle cx={42 + kidPupil.dx} cy={48 + kidPupil.dy} r="2.5" fill="#0D1117" />
                <circle cx={41 + kidPupil.dx * 0.5} cy={47 + kidPupil.dy * 0.5} r="0.8" fill="#FFFFFF" />
                {/* Right Eye */}
                <circle cx="58" cy="48" r="5" fill="#F1F5F9" />
                <circle cx={58 + kidPupil.dx} cy={48 + kidPupil.dy} r="2.5" fill="#0D1117" />
                <circle cx={57 + kidPupil.dx * 0.5} cy={47 + kidPupil.dy * 0.5} r="0.8" fill="#FFFFFF" />
                {/* Confident Smile */}
                <path d="M45 56 Q 50 60 55 56" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Dangling Legs & Shoes */}
                <line x1="38" y1="64" x2="36" y2="82" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
                <path d="M32 82 C 36 82, 42 82, 42 86 C 36 88, 30 87, 32 82 Z" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
                <line x1="62" y1="64" x2="64" y2="82" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
                <path d="M60 82 C 64 82, 70 82, 70 86 C 64 88, 58 87, 60 82 Z" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
                {/* Glowing Laptop */}
                <rect x="42" y="60" width="16" height="11" rx="1.5" fill="#022C22" stroke="#10B981" strokeWidth="1.5" />
                <path d="M46 64 L 54 64" stroke="#34D399" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-[10px] font-mono px-2 py-0.5 rounded text-zinc-300 pointer-events-none whitespace-nowrap shadow-md">
                Real Builder
              </div>
            </div>
          </div>

          {/* Character 3: THE GHOST CONTRIBUTOR (Floating Wavy Ghost) */}
          <div
            onClick={() => handleCharacterClick("ghost")}
            className={`absolute -top-20 sm:-top-28 right-[32%] sm:right-[34%] z-20 cursor-pointer group transition-transform ${
              hoppingChar === "ghost" ? "animate-doodleHop" : "hover:-translate-y-1"
            }`}
            style={{
              animation: "doodleFloat 4s ease-in-out infinite alternate",
            }}
            title="Click Ghost: 'Har code ka pramaan!'"
          >
            <div className="relative">
              <svg width="78" height="84" viewBox="0 0 100 110" fill="none" className="drop-shadow-lg">
                {/* Ghost Sheet Body */}
                <path
                  d="M26 50 C 26 26, 74 26, 74 50 C 74 74, 80 88, 72 96 C 64 88, 56 98, 50 90 C 44 98, 36 88, 28 96 C 20 88, 26 74, 26 50 Z"
                  fill="#0B1320"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Cheeks */}
                <circle cx="36" cy="54" r="3.5" fill="rgba(56, 189, 248, 0.25)" />
                <circle cx="64" cy="54" r="3.5" fill="rgba(56, 189, 248, 0.25)" />
                {/* Left Eye */}
                <ellipse cx="40" cy="46" rx="5.5" ry="6.5" fill="#F1F5F9" />
                <circle cx={40 + ghostPupil.dx} cy={46 + ghostPupil.dy} r="2.8" fill="#0B1320" />
                <circle cx={39 + ghostPupil.dx * 0.5} cy={44.5 + ghostPupil.dy * 0.5} r="0.9" fill="#38BDF8" />
                {/* Right Eye */}
                <ellipse cx="60" cy="46" rx="5.5" ry="6.5" fill="#F1F5F9" />
                <circle cx={60 + ghostPupil.dx} cy={46 + ghostPupil.dy} r="2.8" fill="#0B1320" />
                <circle cx={59 + ghostPupil.dx * 0.5} cy={44.5 + ghostPupil.dy * 0.5} r="0.9" fill="#38BDF8" />
                {/* Cute Open O-Mouth */}
                <ellipse cx="50" cy="56" rx="3.5" ry="4.5" fill="#F1F5F9" />
                {/* Tiny Coffee Cup held by ghost hand */}
                <rect x="68" y="58" width="10" height="12" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                <path d="M78 61 C 82 61, 82 67, 78 67" stroke="#38BDF8" strokeWidth="1.2" fill="none" />
                <path d="M71 54 Q 73 51 75 54" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-[10px] font-mono px-2 py-0.5 rounded text-zinc-300 pointer-events-none whitespace-nowrap shadow-md">
                Git Blame
              </div>
            </div>
          </div>

          {/* Character 4: THE PIRATE CAT (Perched on end letter) */}
          <div
            onClick={() => handleCharacterClick("cat")}
            className={`absolute -top-16 sm:-top-22 right-[6%] sm:right-[10%] z-20 cursor-pointer group transition-transform ${
              hoppingChar === "cat" ? "animate-doodleHop" : "hover:-translate-y-1"
            }`}
            title="Click Cat: 'Verified under Hoollow Protocol!'"
          >
            <div className="relative">
              <svg width="82" height="82" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
                {/* Cat Ears */}
                <polygon points="28,42 22,22 42,32" fill="#1F2937" stroke="#F1F5F9" strokeWidth="2.5" />
                <polygon points="72,42 78,22 58,32" fill="#1F2937" stroke="#F1F5F9" strokeWidth="2.5" />
                {/* Pirate Bandana on head */}
                <path d="M26 38 C 40 28, 60 28, 74 38 L 72 46 C 58 38, 42 38, 28 46 Z" fill="#991B1B" stroke="#EF4444" strokeWidth="1.5" />
                <circle cx="76" cy="42" r="3" fill="#EF4444" />
                {/* Face */}
                <path d="M26 42 C 20 66, 80 66, 74 42 C 64 36, 36 36, 26 42 Z" fill="#111827" stroke="#F1F5F9" strokeWidth="3" />
                {/* Eyepatch on Left Eye */}
                <line x1="28" y1="36" x2="48" y2="52" stroke="#EF4444" strokeWidth="2" />
                <circle cx="38" cy="46" r="6.5" fill="#000000" stroke="#EF4444" strokeWidth="1.5" />
                {/* Big Right Eye (Tracking pointer) */}
                <ellipse cx="62" cy="46" rx="7" ry="7.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
                <circle cx={62 + catPupil.dx} cy={46 + catPupil.dy} r="3" fill="#000000" />
                <circle cx={60.5 + catPupil.dx * 0.5} cy={44.5 + catPupil.dy * 0.5} r="1" fill="#FFFFFF" />
                {/* Whiskers */}
                <line x1="16" y1="50" x2="28" y2="52" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="56" x2="28" y2="55" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="72" y1="52" x2="84" y2="50" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="72" y1="55" x2="84" y2="56" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
                {/* Nose & Mouth */}
                <polygon points="50,52 47,55 53,55" fill="#F43F5E" />
                <path d="M47 56 Q 50 58 53 56" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {/* Swishing Tail */}
                <path
                  d="M74 62 C 84 62, 92 70, 88 80 C 85 86, 78 82, 80 78"
                  stroke="#F1F5F9"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-[10px] font-mono px-2 py-0.5 rounded text-zinc-300 pointer-events-none whitespace-nowrap shadow-md">
                Hoollow Ninja
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* GIANT DRY-BRUSH INK LETTERING WITH HOVER WOBBLE               */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div
            className={`flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-3 py-6 px-2 text-center transition-all duration-700 ${
              inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{
              filter: `url(#dry-brush-${filterId}) drop-shadow(0 0 20px rgba(16, 185, 129, 0.12))`,
            }}
          >
            {letters.map((char, index) => {
              if (char === " ") {
                return (
                  <span key={index} className="w-4 sm:w-8 inline-block select-none">
                    &nbsp;
                  </span>
                );
              }

              return (
                <span
                  key={index}
                  className="relative inline-block font-black tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F1F5F9] transition-transform duration-200 hover:-translate-y-3 hover:scale-110 hover:text-emerald-400 cursor-default"
                  style={{
                    fontFamily: "var(--font-display, sans-serif)",
                    textShadow: "0 0 40px rgba(16, 185, 129, 0.2)",
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Authentic Ink Dry-Brush Underline Curve */}
          <div className="mx-auto max-w-2xl px-6 -mt-2 sm:-mt-4 opacity-80">
            <svg
              viewBox="0 0 600 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full text-emerald-500/70"
            >
              <path
                d="M10 20 C 150 4, 450 6, 590 18"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                filter={`url(#dry-brush-${filterId})`}
              />
              <path
                d="M50 24 C 200 12, 400 14, 550 22"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TWO PILL ACTION BUTTONS                                           */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-10">
          <button
            type="button"
            onClick={onCtaClick}
            className="group relative inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Audit Repository Now</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>

          <Link
            href="/viva"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
            </svg>
            <span>Live Oral Viva Room</span>
          </Link>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* LINK COLUMNS (PRAMAAN SAAS / ENTERPRISE DIRECTORY)               */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-white/5 text-xs font-mono">
          <div>
            <h4 className="text-zinc-100 font-bold uppercase tracking-wider mb-3">Forensics Engine</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/analyze" className="hover:text-emerald-400 transition-colors">
                  Repository Ingestion
                </Link>
              </li>
              <li>
                <Link href="/matrix" className="hover:text-emerald-400 transition-colors">
                  AST Complexity Matrix
                </Link>
              </li>
              <li>
                <Link href="/viva" className="hover:text-emerald-400 transition-colors">
                  Autonomous Oral Viva
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="hover:text-emerald-400 transition-colors">
                  Evidence Locker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-100 font-bold uppercase tracking-wider mb-3">Protocol</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/hoollow" className="hover:text-emerald-400 transition-colors">
                  Hoollow Proof of Work
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-emerald-400 transition-colors">
                  Candidate Credentials
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-emerald-400 transition-colors">
                  Vector PDF Diplomas
                </Link>
              </li>
              <li>
                <Link href="/verdict" className="hover:text-emerald-400 transition-colors">
                  Verification Stamps
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-100 font-bold uppercase tracking-wider mb-3">Enterprise SaaS</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/evaluator" className="hover:text-emerald-400 transition-colors">
                  Evaluator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/batch" className="hover:text-emerald-400 transition-colors">
                  Batch CSV Processing
                </Link>
              </li>
              <li>
                <Link href="/pitch" className="hover:text-emerald-400 transition-colors">
                  Investor & Judge Showcase
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  Licensing & Docker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-100 font-bold uppercase tracking-wider mb-3">Legal & System</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/status" className="hover:text-emerald-400 transition-colors">
                  System Health & Uptime
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">Security Hall of Fame</span>
              </li>
              <li>
                <span className="text-zinc-500">Privacy & AST Telemetry</span>
              </li>
              <li>
                <span className="text-zinc-500">Hoollow Protocol v1.4</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* BOTTOM UTILITY STRIP (HOOLLOW BADGE & HORIZON 2026)               */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-mono text-zinc-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="font-semibold text-zinc-300">Pramaan AI Enterprise</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-black/80 px-3.5 py-1 text-[11px] font-medium tracking-wider text-zinc-100 shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="text-zinc-400">Horizon 2026</span>
          </div>

          <div className="text-zinc-500 text-[11px]">
            © {new Date().getFullYear()} Pramaan AI. Har Code Ka Pramaan. All rights reserved.
          </div>
        </div>
      </div>

      {/* Embedded CSS for keyframes */}
      <style jsx>{`
        @keyframes doodleDrift {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-16px) rotate(8deg);
          }
        }
        @keyframes doodleFloat {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
        @keyframes doodleHop {
          0% {
            transform: translateY(0) scale(1, 1);
          }
          25% {
            transform: translateY(-22px) scale(0.9, 1.15);
          }
          50% {
            transform: translateY(-28px) scale(1.05, 0.95);
          }
          75% {
            transform: translateY(-6px) scale(1.15, 0.85);
          }
          100% {
            transform: translateY(0) scale(1, 1);
          }
        }
        .animate-doodleHop {
          animation: doodleHop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </footer>
  );
}
