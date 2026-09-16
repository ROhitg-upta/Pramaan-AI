"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Terminal as TerminalIcon,
  AlertOctagon,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PhaseProgress, type PipelinePhase } from "@/components/scanning/PhaseProgress";
import { LiveTelemetryGrid } from "@/components/scanning/LiveTelemetryGrid";
import { TerminalLogStream, type LogEntry } from "@/components/scanning/TerminalLogStream";
import { AnomalyAlertCard, type AnomalyAlert } from "@/components/scanning/AnomalyAlertCard";
import { checkBackendHealth, getAnalysisStatus } from "@/lib/api";

const INITIAL_PHASES: PipelinePhase[] = [
  {
    id: "ingest",
    name: "Repository Ingestion",
    description: "Cloning repo & unpacking shallow git objects",
    status: "active",
  },
  {
    id: "mining",
    name: "Commit Mining",
    description: "PyDriller chronological commit traversal & diff extraction",
    status: "pending",
  },
  {
    id: "identity",
    name: "Identity Resolution",
    description: "Levenshtein multi-email author clustering & alias deduplication",
    status: "pending",
  },
  {
    id: "ast",
    name: "AST Complexity Tiering",
    description: "4-tier semantic syntax tree parsing & cyclomatic weighting",
    status: "pending",
  },
  {
    id: "heuristics",
    name: "Behavioral Fraud Heuristics",
    description: "Anomaly rules: Big Bang, Zero Churn, Panic Burst detection",
    status: "pending",
  },
  {
    id: "viva",
    name: "Viva Defense Generation",
    description: "Gemini line-grounded question synthesis for claimed logic",
    status: "pending",
  },
];

export default function InvestigationRoom() {
  const params = useParams();
  const router = useRouter();
  const analysisId = (params?.id as string) || "demo-smart-campus";

  const [progress, setProgress] = useState(0);
  const [phases, setPhases] = useState<PipelinePhase[]>(INITIAL_PHASES);
  const [isScanning, setIsScanning] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Telemetry Metrics
  const [commitsCount, setCommitsCount] = useState(0);
  const [linesCount, setLinesCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [filesCount, setFilesCount] = useState(0);

  // Logs & Anomalies
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);

  // Track if using demo simulation
  const isSimulation = analysisId === "demo-smart-campus";

  // Push new log helper
  const addLog = (tag: LogEntry["tag"], message: string) => {
    const time = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, timestamp: time, tag, message },
    ]);
  };

  // ════════════════════ SIMULATION ENGINE (5 Seconds) ════════════════════
  useEffect(() => {
    if (!isSimulation) return;

    let mounted = true;
    addLog("SYS", `Target mounted: analysis_id=${analysisId}`);
    addLog("GIT", "Cloning shallow repository objects from origin/main...");

    const timeline = [
      // 0.8s: Commit Mining starts
      setTimeout(() => {
        if (!mounted) return;
        setPhases((p) =>
          p.map((ph, i) =>
            i === 0
              ? { ...ph, status: "completed", duration: "0.8s" }
              : i === 1
              ? { ...ph, status: "active" }
              : ph
          )
        );
        setProgress(25);
        setCommitsCount(18);
        addLog("GIT", "Unpacked 45 commits across 14 simulated days.");
        addLog("GIT", "Traversing commit DAG with PyDriller reverse chronologer.");
      }, 800),

      // 1.8s: Commit Mining done, Identity Resolution starts
      setTimeout(() => {
        if (!mounted) return;
        setPhases((p) =>
          p.map((ph, i) =>
            i === 1
              ? { ...ph, status: "completed", duration: "1.0s" }
              : i === 2
              ? { ...ph, status: "active" }
              : ph
          )
        );
        setProgress(45);
        setCommitsCount(45);
        setAuthorsCount(3);
        addLog("ALIAS", "Resolving multi-email contributor handles...");
        addLog(
          "ALIAS",
          "Matched 'rohit.sharma@university.edu' ↔ 'rohit_gh' via Levenshtein distance 0.94."
        );
        addLog(
          "ALIAS",
          "Clustered 3 verified developer profiles: Rohit Sharma, Aryan Kumar, Priya Patel."
        );
      }, 1800),

      // 2.7s: AST Complexity starts
      setTimeout(() => {
        if (!mounted) return;
        setPhases((p) =>
          p.map((ph, i) =>
            i === 2
              ? { ...ph, status: "completed", duration: "0.9s" }
              : i === 3
              ? { ...ph, status: "active" }
              : ph
          )
        );
        setProgress(65);
        setLinesCount(11420);
        setFilesCount(42);
        addLog("AST", "Parsing AST syntax trees for Python and TypeScript...");
        addLog(
          "AST",
          "Isolated Tier 3 logic: auth_service.py (rotate_refresh_token, race-mutex)."
        );
        addLog(
          "AST",
          "Stripped Tier 0 vendor files: package-lock.json, minified styles, node_modules."
        );
      }, 2700),

      // 3.4s: Red Flag Detection & Anomaly Popup!
      setTimeout(() => {
        if (!mounted) return;
        addLog(
          "ANOMALY",
          "🚨 CRITICAL ALERT: FLAG_BIG_BANG detected on commit #4a82e1f by Aryan Kumar!"
        );
        addLog(
          "ANOMALY",
          "Delta: +4,821 lines added, 0 lines deleted at 03:42 AM (6 hours before deadline)."
        );
        setAnomalies([
          {
            id: "alert-01",
            type: "FLAG_BIG_BANG",
            severity: "CRITICAL",
            author: "Aryan Kumar",
            commitHash: "#4a82e1f",
            timestamp: "03:42 AM",
            deltaLines: "+4,821 / -0 lines",
            description: "Monolithic copy-paste injection with zero iterative history",
            explanation:
              "Contributor has 1 single commit contributing 4,821 lines with zero modifications or deletions, exhibiting structural patterns identical to public templates.",
          },
        ]);
      }, 3400),

      // 3.9s: Fraud Heuristics & AST completion
      setTimeout(() => {
        if (!mounted) return;
        setPhases((p) =>
          p.map((ph, i) =>
            i === 3
              ? { ...ph, status: "completed", duration: "1.2s" }
              : i === 4
              ? { ...ph, status: "active" }
              : ph
          )
        );
        setProgress(85);
        setLinesCount(18420);
        setFilesCount(67);
        addLog("ANOMALY", "FLAG_ZERO_CHURN confirmed: 0.0% churn ratio for Aryan Kumar.");
        addLog(
          "ANOMALY",
          "FLAG_GHOST_CONTRIBUTOR confirmed: Priya Patel (0% Tier-3 code, 86% docs/styles)."
        );
      }, 3900),

      // 4.6s: Viva Question Generation
      setTimeout(() => {
        if (!mounted) return;
        setPhases((p) =>
          p.map((ph, i) =>
            i === 4
              ? { ...ph, status: "completed", duration: "0.7s" }
              : i === 5
              ? { ...ph, status: "active" }
              : ph
          )
        );
        setProgress(95);
        addLog(
          "VIVA",
          "Invoking Gemini 2.5 Flash with line-grounded prompt templates..."
        );
        addLog(
          "VIVA",
          "Synthesized 3 un-googleable questions targeting lines 12-34 in 'useAuthContext.jsx'."
        );
        addLog(
          "VIVA",
          "Synthesized concurrency race-condition viva questions for 'auth_service.py'."
        );
      }, 4600),

      // 5.2s: Complete!
      setTimeout(() => {
        if (!mounted) return;
        setPhases((p) =>
          p.map((ph, i) =>
            i === 5 ? { ...ph, status: "completed", duration: "0.6s" } : ph
          )
        );
        setProgress(100);
        setIsScanning(false);
        setIsComplete(true);
        addLog("SYS", "Pipeline execution finished successfully in 5.2s.");
        addLog("SYS", "Audit Dossier compiled. Ready for Evidence Wall inspection.");
      }, 5200),
    ];

    return () => {
      mounted = false;
      timeline.forEach((t) => clearTimeout(t));
    };
  }, [analysisId, isSimulation]);

  // ════════════════════ REAL REPOSITORY ANALYSIS (FastAPI / Direct GitHub) ════════════════════
  useEffect(() => {
    if (isSimulation) return;

    let pollInterval: NodeJS.Timeout;
    let pollCount = 0;

    // A. Direct GitHub Analysis Mode (gh-owner-repo)
    if (analysisId.startsWith("gh-")) {
      const raw = analysisId.replace(/^gh-/, "");
      const parts = raw.split("-");
      const owner = parts[0];
      const repo = parts.slice(1).join("-");
      const repoUrl = `https://github.com/${owner}/${repo}`;

      addLog("SYS", `Initiating direct forensic ingestion for ${owner}/${repo}...`);
      addLog("GIT", `Querying GitHub API for repository tree and commit DAG...`);

      import("@/lib/github-analyzer").then(({ analyzeGitHubRepoDirectly }) => {
        analyzeGitHubRepoDirectly(repoUrl, "main", (pct, step) => {
          setProgress(pct);
          addLog(pct < 50 ? "GIT" : pct < 80 ? "AST" : "VIVA", step);

          // Update phases dynamically
          setPhases((prev) =>
            prev.map((ph, idx) => {
              const phasePct = (idx + 1) * 16.6;
              if (pct >= phasePct) {
                return { ...ph, status: "completed", duration: "0.8s" };
              } else if (pct >= phasePct - 16.6) {
                return { ...ph, status: "active" };
              }
              return ph;
            })
          );
        })
          .then((report) => {
            setCommitsCount(report.total_commits);
            setLinesCount(report.total_lines_audited);
            setAuthorsCount(report.contributors.length);
            setFilesCount(report.total_files);

            if (report.anomalies && report.anomalies.length > 0) {
              setAnomalies(
                report.anomalies.map((flag) => ({
                  id: flag.id,
                  type: flag.type,
                  severity: flag.severity,
                  author: flag.contributor_name,
                  timestamp: "Detected",
                  deltaLines: "Monolithic pattern",
                  description: flag.evidence_summary,
                  explanation: flag.evidence_summary,
                }))
              );
            }

            setProgress(100);
            setIsScanning(false);
            setIsComplete(true);
            addLog("SYS", `Real-time forensic report compiled for ${report.repo_url}`);
          })
          .catch((err) => {
            addLog("SYS", `Error during direct repository analysis: ${err.message}`);
            setIsScanning(false);
          });
      });
      return;
    }

    // B. Live FastAPI Polling Mode
    const pollStatus = async () => {
      try {
        pollCount++;
        const res = await getAnalysisStatus(analysisId, pollCount);

        setProgress(res.progress_percent);
        if (res.live_metrics) {
          setCommitsCount(res.live_metrics.total_commits);
          setLinesCount(res.live_metrics.total_lines);
          setAuthorsCount(res.live_metrics.contributors_found);
          setFilesCount(res.live_metrics.files_analyzed);
        }

        // Update pipeline phases
        setPhases((prev) =>
          prev.map((ph, idx) => {
            const phasePct = (idx + 1) * 16.6;
            if (res.progress_percent >= phasePct) {
              return { ...ph, status: "completed", duration: "1.0s" };
            } else if (res.progress_percent >= phasePct - 16.6) {
              return { ...ph, status: "active" };
            }
            return ph;
          })
        );

        if (res.early_red_flags && res.early_red_flags.length > 0) {
          setAnomalies(
            res.early_red_flags.map((flag) => ({
              id: flag.id,
              type: flag.type,
              severity: flag.severity,
              author: flag.contributor_name,
              timestamp: "Just now",
              deltaLines: "Infraction detected",
              description: flag.description,
              explanation: flag.details,
            }))
          );
        }

        if (res.current_step) {
          addLog("SYS", res.current_step);
        }

        if (res.status === "completed" || res.progress_percent >= 100) {
          setIsScanning(false);
          setIsComplete(true);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.warn("Live status polling error:", err);
      }
    };

    pollInterval = setInterval(pollStatus, 800);
    return () => clearInterval(pollInterval);
  }, [analysisId, isSimulation]);

  const handleDismissAnomaly = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Status Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
            <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
            <span>Auditing:</span>
            <span className="font-semibold text-zinc-100">
              {analysisId === "demo-smart-campus"
                ? "demo/smart-campus-app"
                : `repo/${analysisId.slice(0, 8)}`}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isScanning ? (
            <div className="flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scanning Commit Graph...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Audit Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Orchestration Grid */}
      <div className="space-y-6">
        {/* 1. 6-Phase Pipeline Tracker */}
        <PhaseProgress phases={phases} overallProgress={progress} />

        {/* 2. Real-Time Telemetry Grid */}
        <LiveTelemetryGrid
          commitsCount={commitsCount}
          linesCount={linesCount}
          authorsCount={authorsCount}
          filesCount={filesCount}
          isScanning={isScanning}
        />

        {/* 3. Anomalies & Terminal Log Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Anomaly Tray (Left 5 Cols if anomalies exist) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="h-4 w-4 text-rose-400" />
                <span className="font-semibold text-zinc-200 uppercase tracking-wider">
                  Heuristic Anomaly Alerts ({anomalies.length})
                </span>
              </div>
            </div>

            <AnimatePresence>
              {anomalies.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-8 text-center font-mono text-xs text-zinc-500">
                  {isScanning
                    ? "Evaluating commit cadence and AST blast radius..."
                    : "No critical anomalies detected in clean baseline."}
                </div>
              ) : (
                anomalies.map((alert) => (
                  <AnomalyAlertCard
                    key={alert.id}
                    alert={alert}
                    onDismiss={handleDismissAnomaly}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Terminal Monospace Stream (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <TerminalLogStream logs={logs} isScanning={isScanning} />
          </div>
        </div>

        {/* 4. Completion Climax Card (Slides in when 100% complete) */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                      Forensic Audit Finished
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-zinc-100">
                    Full Repository Dossier Ready
                  </h3>
                  <p className="mt-1 font-body text-sm text-zinc-400 max-w-xl">
                    45 commits analyzed • 1 Critical Anomaly flagged • 3 Contributor Profiles generated with line-targeted viva defense questions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="https://hoollow.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 font-mono text-xs text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                  >
                    <span>Export to Hoollow Profile ↗</span>
                  </a>
                  <button
                    onClick={() => router.push(`/evidence/${analysisId}`)}
                    className="inline-flex items-center space-x-2 rounded-xl bg-emerald-400 px-6 py-3 font-mono text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-300 active:scale-95 transition-all"
                  >
                    <span>Inspect Evidence Wall & Dossier</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Hoollow Proof-of-Work Standard Watermark */}
              <div className="mt-5 border-t border-white/5 pt-3 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span className="font-semibold text-emerald-500/80">
                  VERIFIED UNDER HOOLLOW PROOF-OF-WORK STANDARD
                </span>
                <span className="text-zinc-600">Horizon Hackathon 2026</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
