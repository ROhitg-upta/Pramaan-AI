import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ForensicGridBg } from "@/components/layout/ForensicGridBg";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
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
              <Footer />
            </div>
            <RoleSwitcher />
          </PresentationModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
