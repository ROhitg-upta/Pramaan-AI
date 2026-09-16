import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ForensicGridBg } from "@/components/layout/ForensicGridBg";
import { Navbar } from "@/components/layout/Navbar";
import { PresentationModeProvider } from "@/components/layout/PresentationModeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pramaan AI — Autonomous Code Forensics & Viva Defense",
  description:
    "Developer-first code forensics and line-targeted viva defense engine. Separating real builders from copy-paste.",
  keywords: ["Code Forensics", "Viva Defense", "Git Analytics", "AST Complexity", "Proof of Work", "Hoollow"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#09090b] text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <ForensicGridBg />

        <PresentationModeProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/5 py-6 text-center font-mono text-xs text-zinc-600">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <span>Pramaan AI</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-emerald-500/80 font-medium">
                  VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Horizon 2026</span>
              </div>
            </footer>
          </div>
        </PresentationModeProvider>
      </body>
    </html>
  );
}
