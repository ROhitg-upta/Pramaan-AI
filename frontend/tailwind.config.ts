import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050507",
        obsidian: "#0A0D14",
        card: "#0F1629",
        "card-hover": "#151D35",
        elevated: "#1A2342",
        "code-bg": "#0D1117",
        "neon-emerald": "#10B981",
        "neon-emerald-soft": "#059669",
        "neon-amber": "#F59E0B",
        "neon-amber-soft": "#D97706",
        "neon-crimson": "#EF4444",
        "neon-crimson-soft": "#DC2626",
        "neon-cyan": "#06B6D4",
        "neon-cyan-soft": "#0891B2",
        "neon-purple": "#8B5CF6",
        "neon-purple-soft": "#7C3AED",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",
        "text-ghost": "#475569",
        "border-subtle": "#1E293B",
        "border-active": "#334155",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "neon-emerald": "0 0 20px rgba(16, 185, 129, 0.35), 0 0 60px rgba(16, 185, 129, 0.1)",
        "neon-amber": "0 0 20px rgba(245, 158, 11, 0.35), 0 0 60px rgba(245, 158, 11, 0.1)",
        "neon-crimson": "0 0 20px rgba(239, 68, 68, 0.35), 0 0 60px rgba(239, 68, 68, 0.1)",
        "neon-cyan": "0 0 20px rgba(6, 182, 212, 0.35), 0 0 60px rgba(6, 182, 212, 0.1)",
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.35), 0 0 60px rgba(139, 92, 246, 0.1)",
      },
      animation: {
        "grid-drift": "gridDrift 120s linear infinite",
        "scan-sweep": "scanSweep 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "typewriter-cursor": "blink 530ms step-end infinite",
      },
      keyframes: {
        gridDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 -1000px" },
        },
        scanSweep: {
          "0%": { top: "-2px", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100vh", opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.06" },
          "50%": { opacity: "0.12" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
