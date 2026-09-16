import { type Variants, type Transition } from "framer-motion";

/**
 * Framer Motion spring transitions and animation presets
 * Strictly adheres to docs/DESIGN_SPEC.md Section 7
 */

// Standard card entry (used for ContributorCards, AlertCards)
export const cardEntry: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export const cardEntryTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
};

// Dramatic slam-in (used for RedFlag alerts)
export const slamFromRight: Variants = {
  initial: { opacity: 0, x: 200, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 100 },
};

export const slamTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 22,
};

// Stagger container (used for metric lists, score breakdowns)
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Child item for stagger
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// Score reveal overshoot (used for AuthenticityMeter & radial bars)
export const overshootFill: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 14,
};

// Page transition (used between ACTs)
export const pageSlide: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, scale: 1.02 },
};

export const pageSlideTransition: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

// Glitch logo keyframe pulse
export const glitchPulse: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
