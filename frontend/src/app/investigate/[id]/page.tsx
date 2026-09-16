"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Terminal as TerminalIcon,
  AlertOctagon,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Key,
  Check,
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
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // GitHub Personal Access Token (PAT) State
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [patInput, setPatInput] = useState("");
  const [retryTrigger, setRetryTrigger] = useState(0);

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

  // Derived Display Repo Name
  const displayRepoName = useMemo(() => {
    if (analysisId === "demo-smart-campus") {
      return "demo/smart-campus-app";
    }
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pramaan_target_url");
      if (stored) {
        const cleaned = stored.trim().replace(/\.git$/, "").replace(/\/$/, "");
        const match = cleaned.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
        if (match) return `${match[1]}/${match[2]}`;
      }
    }
    if (analysisId.startsWith("gh__")) {
      const raw = analysisId.replace(/^gh__/, "");
      const parts = raw.split("__");
      if (parts.length >= 2) {
        return `${decodeURIComponent(parts[0])}/${decodeURIComponent(parts[1])}`;
      }
    }
    if (analysisId.startsWith("gh-")) {
      const raw = analysisId.replace(/^gh-/, "");
      const parts = raw.split("-");
      if (parts.length >= 2) {
        return `${parts[0]}/${parts.slice(1).join("-")}`;
      }
    }
    return `repo/${analysisId.slice(0, 12)}`;
  }, [analysisId]);

  // Handle Retry
  const handleRetry = () => {
    setIsError(false);
    setErrorMessage(null);
    setIsScanning(true);
    setIsComplete(false);
    setProgress(5);
    setPhases(INITIAL_PHASES);
    setRetryTrigger((prev) => prev + 1);
  };

  // Handle Save PAT & Retry
  const handleSavePatAndRetry = () => {
    if (typeof window !== "undefined" && patInput.trim()) {
      localStorage.setItem("pramaan_gh_token", patInput.trim());
    }
    setShowTokenInput(false);
    handleRetry();
  };

  // ════════════════════ SIMULATION ENGINE (5 Seconds) ════════════════════
  useEffect(() => {
    if (!isSimulation) return;

    let mounted = true;
    setIsScanning(true);
    setIsError(false);
    setErrorMessage(null);
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
        setLinesCount(12480);
        addLog("AST", "Parsing Abstract Syntax Trees across 24 source modules...");
        addLog("AST", "Tier-3 Algorithmic Weight: +8,420 lines verified in 'auth/' and 'engine/'.");
        addLog("AST", "Tier-0 Boilerplate Discard: -3,200 lines vendor code / lockfiles pruned.");
      }, 2700),

      // 3.9s: Behavioral Fraud Heuristics
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
  }, [analysisId, isSimulation, retryTrigger]);

  // ════════════════════ REAL REPOSITORY ANALYSIS (FastAPI / Direct GitHub) ════════════════════
  useEffect(() => {
    if (isSimulation) return;

    let mounted = true;
    let pollInterval: NodeJS.Timeout | null = null;
    let pollCount = 0;

    setIsError(false);
    setErrorMessage(null);
    setIsScanning(true);
    setIsComplete(false);

    // 1. Resolve Target Repository URL safely
    let targetRepoUrl: string | null = null;

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pramaan_target_url");
      if (stored) {
        targetRepoUrl = stored;
      }
    }

    if (!targetRepoUrl) {
      if (analysisId.startsWith("gh__")) {
        const raw = analysisId.replace(/^gh__/, "");
        const [encodedOwner, encodedRepo] = raw.split("__");
        if (encodedOwner && encodedRepo) {
          const owner = decodeURIComponent(encodedOwner);
          const repo = decodeURIComponent(encodedRepo);
          targetRepoUrl = `https://github.com/${owner}/${repo}`;
        }
      } else if (analysisId.startsWith("gh-")) {
        const raw = analysisId.replace(/^gh-/, "");
        const parts = raw.split("-");
        if (parts.length >= 2) {
          const owner = parts[0];
          const repo = parts.slice(1).join("-");
          targetRepoUrl = `https://github.com/${owner}/${repo}`;
        }
      }
    }

    // A. Direct GitHub Analysis Mode (for public or PAT-authenticated repos)
    if (targetRepoUrl || analysisId.startsWith("gh__") || analysisId.startsWith("gh-")) {
      const repoUrl = targetRepoUrl || `https://github.com/${displayRepoName}`;
      addLog("SYS", `Initiating direct forensic ingestion for ${repoUrl}...`);
      addLog("GIT", `Querying GitHub API for repository tree and commit DAG...`);

      import("@/lib/github-analyzer")
        .then(({ analyzeGitHubRepoDirectly }) => {
          if (!mounted) return;

          analyzeGitHubRepoDirectly(repoUrl, "main", (pct, step) => {
            if (!mounted) return;
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
              if (!mounted) return;
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
            .catch((err: Error) => {
              if (!mounted) return;
              console.error("Direct repository analysis error:", err);
              setIsScanning(false);
              setIsError(true);
              setErrorMessage(err.message || "Repository ingestion failed.");
              addLog("SYS", `Forensic analysis aborted: ${err.message}`);
            });
        })
        .catch((err) => {
          if (!mounted) return;
          setIsScanning(false);
          setIsError(true);
          setErrorMessage(err.message || "Failed to load forensic analyzer module.");
        });

      return () => {
        mounted = false;
      };
    }

    // B. Live FastAPI Polling Mode
    const pollStatus = async () => {
      try {
        pollCount++;
        const res = await getAnalysisStatus(analysisId, pollCount);

        if (!mounted) return;
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

        if (res.current_step) {
          addLog("SYS", res.current_step);
        }

        if (res.status === "completed" || res.progress_percent >= 100) {
          setIsScanning(false);
          setIsComplete(true);
          if (pollInterval) clearInterval(pollInterval);
        }
      } catch (err: any) {
        if (!mounted) return;
        console.warn("Live status polling error:", err);
        if (pollCount > 6) {
          setIsScanning(false);
          setIsError(true);
          setErrorMessage(err?.message || "FastAPI PyDriller backend unavailable.");
          if (pollInterval) clearInterval(pollInterval);
        }
      }
    };

    pollInterval = setInterval(pollStatus, 800);
    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [analysisId, isSimulation, displayRepoName, retryTrigger]);

  const handleDismissAnomaly = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[11px] text-emerald-400">
            <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
            <span>Auditing:</span>
            <span className="font-semibold text-zinc-100">{displayRepoName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isError ? (
            <div className="flex items-center space-x-2 rounded-full border border-rose-500/30 bg-rose-950/20 px-3 py-1 text-xs text-rose-400 font-semibold">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Ingestion Failed</span>
            </div>
          ) : isScanning ? (
            <div className="flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scanning Commit Graph...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Audit Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════ ERROR RECOVERY CARD ════════════════════ */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-rose-500/25 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="flex items-start space-x-4">
            <div className="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-rose-400" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-display text-xl font-bold text-zinc-100">
                Repository Ingestion Failed
              </h3>
              <p className="font-mono text-xs text-rose-300/90">
                {errorMessage || `GitHub repository "${displayRepoName}" was not found or is private.`}
              </p>
            </div>
          </div>

          {/* Diagnostic Checklist */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2.5 font-mono text-xs text-zinc-400">
            <div className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] mb-1">
              Diagnostic Checklist:
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>Ensure the repository URL is public (private repos require a personal access token).</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>Verify that the repository and username spellings are exact (e.g. <code>ROhitg-upta/abtalks-redesign</code>).</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>Check if GitHub API rate limits are active (unauthenticated requests are capped at 60/hr by GitHub).</span>
            </div>
          </div>

          {/* Optional Inline GitHub PAT Input Form */}
          {showTokenInput && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3 font-mono text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 font-semibold flex items-center space-x-2">
                  <Key className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Enter GitHub Personal Access Token (PAT):</span>
                </label>
                <span className="text-[10px] text-zinc-500">Stored safely in local browser storage</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="password"
                  value={patInput}
                  onChange={(e) => setPatInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
                  className="w-full sm:flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={handleSavePatAndRetry}
                  className="w-full sm:w-auto rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 transition"
                >
                  Save &amp; Retry
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 rounded-xl bg-white px-4 py-2.5 text-zinc-950 font-semibold hover:bg-zinc-200 transition shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-950" />
              <span>Retry Analysis</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="inline-flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition"
            >
              <Key className="h-3.5 w-3.5 text-zinc-400" />
              <span>{showTokenInput ? "Hide Token Field" : "Enter GitHub Personal Token (For Private Repos)"}</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/investigate/demo-smart-campus")}
              className="inline-flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition ml-auto"
            >
              <span>Load Demo Project Instead ➔</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Orchestration Grid (Visible when not in hard failure, or below error) */}
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
                    {commitsCount} commits analyzed • {anomalies.length} Anomalies flagged • {authorsCount} Contributor Profiles generated with line-targeted viva defense questions.
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
                    className="inline-flex items-center space-x-2 rounded-xl bg-white px-6 py-3 font-mono text-sm font-semibold text-zinc-950 hover:bg-zinc-200 active:scale-95 transition-all shadow-sm"
                  >
                    <span>Inspect Evidence Wall &amp; Dossier</span>
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
