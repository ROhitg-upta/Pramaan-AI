import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 text-zinc-400 shadow-xl">
          <ShieldAlert className="h-6 w-6 text-zinc-300" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
            404 Error • Dossier Not Found
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Route Relocated or Missing
          </h1>
          <p className="font-body text-xs sm:text-sm text-zinc-400">
            The requested evidence trail, student dossier, or audit session could not be located in the forensic index.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Terminal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
