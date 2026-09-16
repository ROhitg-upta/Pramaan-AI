/**
 * Pramaan AI — Obsidian Forensic Color Design Tokens
 * Strictly adheres to docs/DESIGN_SPEC.md Section 2.1
 */

export const FORENSIC_COLORS = {
  // Backgrounds
  void: "#050507",
  obsidian: "#0A0D14",
  card: "#0F1629",
  cardHover: "#151D35",
  elevated: "#1A2342",
  codeBg: "#0D1117",
  input: "#0C1220",

  // Borders
  borderSubtle: "#1E293B",
  borderActive: "#334155",
  borderGlowEmerald: "rgba(16, 185, 129, 0.4)",
  borderGlowCrimson: "rgba(239, 68, 68, 0.4)",
  borderGlowCyan: "rgba(6, 182, 212, 0.4)",

  // Neons (Status & Evidence)
  neonEmerald: "#10B981",
  neonEmeraldSoft: "#059669",
  neonAmber: "#F59E0B",
  neonAmberSoft: "#D97706",
  neonCrimson: "#EF4444",
  neonCrimsonSoft: "#DC2626",
  neonCyan: "#06B6D4",
  neonCyanSoft: "#0891B2",
  neonPurple: "#8B5CF6",
  neonPurpleSoft: "#7C3AED",

  // Text Hierarchy
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textGhost: "#475569",
} as const;

export const GLOW_EFFECTS = {
  emerald: "0 0 20px rgba(16, 185, 129, 0.35), 0 0 60px rgba(16, 185, 129, 0.1)",
  amber: "0 0 20px rgba(245, 158, 11, 0.35), 0 0 60px rgba(245, 158, 11, 0.1)",
  crimson: "0 0 20px rgba(239, 68, 68, 0.35), 0 0 60px rgba(239, 68, 68, 0.1)",
  cyan: "0 0 20px rgba(6, 182, 212, 0.35), 0 0 60px rgba(6, 182, 212, 0.1)",
  purple: "0 0 20px rgba(139, 92, 246, 0.35), 0 0 60px rgba(139, 92, 246, 0.1)",
} as const;

export type ForensicColorName = keyof typeof FORENSIC_COLORS;
export type GlowEffectName = keyof typeof GLOW_EFFECTS;

/**
 * Returns hexadecimal color based on Pramaan authenticity score (0 - 100)
 */
export function getScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return FORENSIC_COLORS.textMuted;
  if (score >= 75) return FORENSIC_COLORS.neonEmerald;
  if (score >= 50) return FORENSIC_COLORS.neonAmber;
  return FORENSIC_COLORS.neonCrimson;
}

/**
 * Returns color based on contributor audit verdict
 */
export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case "VERIFIED_BUILDER":
      return FORENSIC_COLORS.neonEmerald;
    case "PROBABLE_AUTHOR":
      return FORENSIC_COLORS.neonCyan;
    case "GHOST_CONTRIBUTOR":
      return FORENSIC_COLORS.neonAmber;
    case "SUSPECT_AI_FLUFF":
    case "SUSPECT_FREELOADER":
    case "PROBABLE_FREELOADER":
      return FORENSIC_COLORS.neonCrimson;
    default:
      return FORENSIC_COLORS.textMuted;
  }
}

/**
 * Returns color based on anomaly severity level
 */
export function getSeverityColor(severity: string): string {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return FORENSIC_COLORS.neonCrimson;
    case "HIGH":
      return "#F87171"; // soft red
    case "MEDIUM":
      return FORENSIC_COLORS.neonAmber;
    case "LOW":
      return FORENSIC_COLORS.neonCyan;
    default:
      return FORENSIC_COLORS.textSecondary;
  }
}
