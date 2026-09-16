"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Projector, Keyboard, X, Sparkles } from "lucide-react";

interface PresentationModeContextType {
  isPresentation: boolean;
  togglePresentation: () => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
}

const PresentationModeContext = createContext<PresentationModeContextType>({
  isPresentation: false,
  togglePresentation: () => {},
  showShortcuts: false,
  setShowShortcuts: () => {},
});

export const usePresentationMode = () => useContext(PresentationModeContext);

export function PresentationModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPresentation, setIsPresentation] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const togglePresentation = () => {
    setIsPresentation((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ctrl + Shift + P or Cmd + Shift + P
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setIsPresentation((prev) => !prev);
      }

      // '?' key for shortcuts
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }

      // Esc closes shortcuts
      if (e.key === "Escape") {
        setShowShortcuts(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update html root style
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isPresentation) {
        document.documentElement.classList.add("presentation-mode");
      } else {
        document.documentElement.classList.remove("presentation-mode");
      }
    }
  }, [isPresentation]);

  return (
    <PresentationModeContext.Provider
      value={{
        isPresentation,
        togglePresentation,
        showShortcuts,
        setShowShortcuts,
      }}
    >
      <div className={isPresentation ? "presentation-scale transition-all duration-500" : ""}>
        {children}
      </div>

      {/* Presentation Mode Indicator Pill */}
      <AnimatePresence>
        {isPresentation && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-3 right-3 z-[9999] flex items-center space-x-2 rounded-full border border-purple-500/40 bg-purple-950/90 px-3.5 py-1.5 font-mono text-xs text-purple-200 shadow-2xl backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <Projector className="w-3.5 h-3.5 text-purple-300" />
            <span className="font-semibold tracking-wide">STAGE MODE ACTIVE</span>
            <button
              onClick={togglePresentation}
              className="ml-1 text-purple-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theatrical Vignette in Presentation Mode */}
      {isPresentation && (
        <div
          className="fixed inset-0 pointer-events-none z-[9990]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        />
      )}

      {/* Keyboard Shortcuts Modal (?) */}
      <AnimatePresence>
        {showShortcuts && (
          <div
            onClick={() => setShowShortcuts(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center space-x-2 font-mono text-xs text-zinc-300">
                  <Keyboard className="w-4 h-4 text-purple-400" />
                  <span className="font-bold uppercase tracking-wider">
                    Pramaan AI Shortcuts
                  </span>
                </div>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                  <span className="text-zinc-400">Toggle Stage Presentation</span>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                      Ctrl
                    </kbd>
                    <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                      Shift
                    </kbd>
                    <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                      P
                    </kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                  <span className="text-zinc-400">This Help Modal</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                    ?
                  </kbd>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                  <span className="text-zinc-400">Close Open Modal / Overlay</span>
                  <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                    Esc
                  </kbd>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-400">Toggle Mock / Live Backend</span>
                  <span className="text-zinc-500 text-[11px]">Via Navbar pill</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-500">
                Pramaan AI • Built for Stage Demos &amp; Horizon 2026
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PresentationModeContext.Provider>
  );
}
