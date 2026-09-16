"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  tag: "GIT" | "ALIAS" | "AST" | "ANOMALY" | "VIVA" | "SYS";
  message: string;
}

interface TerminalLogStreamProps {
  logs: LogEntry[];
  isScanning: boolean;
}

export const TerminalLogStream: React.FC<TerminalLogStreamProps> = ({
  logs,
  isScanning,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll to bottom as new logs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyLogs = () => {
    const rawText = logs
      .map((l) => `[${l.timestamp}] [${l.tag}] ${l.message}`)
      .join("\n");
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTagBadge = (tag: LogEntry["tag"]) => {
    switch (tag) {
      case "GIT":
        return <span className="text-emerald-400 font-bold">[GIT]</span>;
      case "ALIAS":
        return <span className="text-purple-400 font-bold">[ALIAS]</span>;
      case "AST":
        return <span className="text-cyan-400 font-bold">[AST]</span>;
      case "ANOMALY":
        return <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded">[ANOMALY]</span>;
      case "VIVA":
        return <span className="text-amber-400 font-bold">[VIVA]</span>;
      case "SYS":
      default:
        return <span className="text-zinc-500 font-bold">[SYS]</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 sm:p-5 font-mono shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3 text-xs text-zinc-400">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-zinc-300">TELEMETRY STREAM :: FORENSIC LOG</span>
          {isScanning && (
            <span className="flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>STREAMING</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-zinc-500">{logs.length} events</span>
          <button
            onClick={handleCopyLogs}
            className="flex items-center space-x-1 rounded px-2 py-0.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={containerRef}
        className="h-64 sm:h-72 overflow-y-auto space-y-1.5 text-xs text-zinc-300 font-mono leading-relaxed pr-2 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-zinc-600">
            Awaiting forensic ingestion stream...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2.5 hover:bg-white/[0.02] py-0.5 px-1 rounded">
              <span className="text-zinc-600 shrink-0 select-none text-[11px]">{log.timestamp}</span>
              <span className="shrink-0 text-[11px]">{getTagBadge(log.tag)}</span>
              <span className="break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
