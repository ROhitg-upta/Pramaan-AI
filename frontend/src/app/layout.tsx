import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ForensicGridBg } from "@/components/layout/ForensicGridBg";
import { Navbar } from "@/components/layout/Navbar";
import { PresentationModeProvider } from "@/components/layout/PresentationModeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { RoleSwitcher } from "@/components/auth/RoleSwitcher";

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
  title: "Pramaan AI — Enterprise SaaS Code Forensics & Viva Defense",
  description:
    "Enterprise developer-first code forensics, live viva defense examination rooms, and Hoollow Proof-of-Work developer credentials.",
  keywords: ["Code Forensics", "Viva Defense", "Git Analytics", "AST Complexity", "Proof of Work", "Hoollow", "Enterprise SaaS"],
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

        <AuthProvider>
          <PresentationModeProvider>
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
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
            </div>
            <RoleSwitcher />
          </PresentationModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
