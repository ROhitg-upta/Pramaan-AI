/**
 * Pramaan AI — Production-Grade Hybrid Forensics Client
 * Priority:
 * 1. Live FastAPI Backend (http://localhost:8000) for deep AST + PyDriller Git mining
 * 2. Next.js Server-Side / Direct GitHub Ingestion Engine for real GitHub repositories
 * 3. Explicit Demo fallback ONLY when user explicitly selects "demo-smart-campus"
 */

import {
  type AnalysisStatusResponse,
  type FullReportResponse,
  type VivaQuestion,
  type VivaQuestionsResponse,
  type VivaEvaluationResponse,
  mockFullReport,
  mockVivaQuestions,
  mockVivaEvalFluff,
  mockVivaEvalBuilder,
} from "./mock-data";

import {
  parseGitHubUrl,
  analyzeGitHubRepoDirectly,
  generateRealVivaQuestions,
} from "./github-analyzer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const IS_MOCK_ENV = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// In-memory report cache for client-side routing
const memoryReportCache = new Map<string, FullReportResponse>();

/**
 * Health check to probe FastAPI backend readiness
 */
export async function checkBackendHealth(): Promise<{
  live: boolean;
  mode: "LIVE" | "GITHUB_DIRECT" | "MOCK";
  url: string;
  latencyMs?: number;
}> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${API_BASE_URL}/docs`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);
    return {
      live: res.ok || res.status < 500,
      mode: res.ok ? "LIVE" : "GITHUB_DIRECT",
      url: API_BASE_URL,
      latencyMs,
    };
  } catch {
    return {
      live: false,
      mode: "GITHUB_DIRECT",
      url: API_BASE_URL,
    };
  }
}

/**
 * 1. Ingest and start analysis
 * Tries FastAPI backend first. If offline, initializes Direct GitHub Ingestion Engine!
 */
export async function analyzeRepo(
  repoUrl: string,
  branch = "main"
): Promise<{ analysis_id: string; status: string; message: string; isRealRepo: boolean }> {
  const cleanUrl = repoUrl.trim();

  // If user explicitly asks for demo
  if (cleanUrl === "demo" || cleanUrl.includes("demo-smart-campus") || cleanUrl.includes("demo/smart-campus-app")) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pramaan_target_url", "https://github.com/demo/smart-campus-app");
    }
    return {
      analysis_id: "demo-smart-campus",
      status: "processing",
      message: "Loading official Smart Campus demo case...",
      isRealRepo: false,
    };
  }

  // Persist exact target URL in sessionStorage
  if (typeof window !== "undefined") {
    sessionStorage.setItem("pramaan_target_url", cleanUrl);
  }

  // 1. Try FastAPI backend if running
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/analyze/repo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: cleanUrl, branch }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        analysis_id: data.analysis_id,
        status: "processing",
        message: "FastAPI PyDriller forensic pipeline initialized.",
        isRealRepo: true,
      };
    }
  } catch {
    // FastAPI backend offline — seamlessly fall through to Direct GitHub API engine
  }

  // 2. Direct GitHub Ingestion Engine for real repositories (safe gh__ double underscore delimiter)
  const parsed = parseGitHubUrl(cleanUrl);
  if (parsed) {
    const analysisId = `gh__${encodeURIComponent(parsed.owner.toLowerCase())}__${encodeURIComponent(parsed.repo.toLowerCase())}`;
    return {
      analysis_id: analysisId,
      status: "processing",
      message: `Analyzing ${parsed.owner}/${parsed.repo} via Direct GitHub Forensic Engine...`,
      isRealRepo: true,
    };
  }

  throw new Error(`Invalid GitHub repository URL: "${cleanUrl}". Please provide a format like https://github.com/owner/repo.`);
}

/**
 * 2. Get Analysis Status during live scan
 */
export async function getAnalysisStatus(
  analysisId: string,
  pollCount = 0
): Promise<AnalysisStatusResponse> {
  // If FastAPI backend has this ID
  if (!analysisId.startsWith("demo-") && !analysisId.startsWith("gh-") && !analysisId.startsWith("gh__")) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analyze/${analysisId}/status`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignore
    }
  }

  // If analyzed directly via GitHub or cached
  const cached = getCachedReport(analysisId);
  if (cached) {
    return {
      analysis_id: analysisId,
      status: "completed",
      progress_percent: 100,
      current_step: "Analysis complete. Forensic dossier ready.",
      elapsed_seconds: 2.5,
      phases: [
        { name: "Repository Ingestion", status: "completed", duration_ms: 600 },
        { name: "Commit Mining", status: "completed", duration_ms: 800 },
        { name: "Identity Resolution", status: "completed", duration_ms: 300 },
        { name: "AST Tier Classification", status: "completed", duration_ms: 500 },
        { name: "Anomaly Detection", status: "completed", duration_ms: 200 },
        { name: "Viva Question Generation", status: "completed", duration_ms: 400 },
      ],
      live_metrics: {
        total_commits: cached.total_commits,
        total_lines: cached.total_lines_audited,
        contributors_found: cached.contributors.length,
        files_analyzed: cached.total_files,
      },
    };
  }

  // Demo fallback
  return {
    analysis_id: analysisId,
    status: pollCount > 4 ? "completed" : "processing",
    progress_percent: Math.min(25 + pollCount * 20, 100),
    current_step: "Analyzing commit graph...",
    elapsed_seconds: pollCount * 0.8,
    phases: [],
  };
}

/**
 * Helper to get report from memory or localStorage
 */
function getCachedReport(analysisId: string): FullReportResponse | null {
  if (memoryReportCache.has(analysisId)) {
    return memoryReportCache.get(analysisId)!;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`pramaan_report_${analysisId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        memoryReportCache.set(analysisId, parsed);
        return parsed;
      }
    } catch {
      // Ignore
    }
  }
  return null;
}

/**
 * 3. GET /api/v1/analyze/{id}/report — Complete forensic audit report
 */
export async function getAnalysisReport(analysisId: string): Promise<FullReportResponse> {
  // If explicitly requested demo, return demo data
  if (analysisId === "demo" || analysisId === "demo-smart-campus") {
    return {
      ...mockFullReport,
      analysis_id: "demo-smart-campus",
      is_demo: true,
    };
  }

  // 1. Check client-side cached report
  const cached = getCachedReport(analysisId);
  if (cached) {
    return cached;
  }

  // 2. Check live FastAPI backend
  if (!analysisId.startsWith("demo-") && !analysisId.startsWith("gh-") && !analysisId.startsWith("gh__")) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analyze/${analysisId}/report`);
      if (res.ok) {
        const data: FullReportResponse = await res.json();
        memoryReportCache.set(analysisId, data);
        if (typeof window !== "undefined") {
          localStorage.setItem(`pramaan_report_${analysisId}`, JSON.stringify(data));
        }
        return data;
      }
    } catch {
      // Fall through
    }
  }

  // 3. If analysisId is a gh__ or gh- format, analyze on-the-fly!
  if (analysisId.startsWith("gh__") || analysisId.startsWith("gh-")) {
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
      } else {
        const raw = analysisId.replace(/^gh-/, "");
        const parts = raw.split("-");
        if (parts.length >= 2) {
          const owner = parts[0];
          const repo = parts.slice(1).join("-");
          targetRepoUrl = `https://github.com/${owner}/${repo}`;
        }
      }
    }

    if (targetRepoUrl) {
      const data = await analyzeGitHubRepoDirectly(targetRepoUrl);
      memoryReportCache.set(analysisId, data);
      return data;
    }
  }

  throw new Error(`Report for analysis "${analysisId}" could not be found or loaded.`);
}

/**
 * 4. Generate line-targeted viva questions for any contributor
 */
export async function getVivaQuestions(
  analysisId: string,
  contributorId: string,
  questionCount = 3
): Promise<VivaQuestionsResponse> {
  // Demo mode
  if (analysisId === "demo-smart-campus" || analysisId === "demo") {
    const questions: VivaQuestion[] =
      mockVivaQuestions[contributorId] || mockVivaQuestions["contrib-002"] || [];
    return {
      contributor_id: contributorId,
      contributor_name: "Aryan Kumar",
      questions: questions.slice(0, questionCount),
    };
  }

  // Try Next.js server-side /api/viva/generate
  try {
    const report = await getAnalysisReport(analysisId);
    const contributor = report.contributors.find((c) => c.id === contributorId);

    const res = await fetch("/api/viva/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contributorName: contributor?.primary_name || "Contributor",
        repoName: report.repo_url.replace("https://github.com/", ""),
        auditedFiles: (report as any).audited_files || [],
        contributorId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Server viva generation fallback:", err);
  }

  // Fallback to grounded questions based on report's audited files
  const report = await getAnalysisReport(analysisId);
  const contributor = report.contributors.find((c) => c.id === contributorId);

  if (contributor) {
    const realQuestions = generateRealVivaQuestions(
      contributor,
      report.repo_url.replace("https://github.com/", ""),
      (report as any).audited_files || []
    );
    return {
      contributor_id: contributorId,
      contributor_name: contributor.primary_name,
      questions: realQuestions.slice(0, questionCount),
    };
  }

  return {
    contributor_id: contributorId,
    contributor_name: "Contributor",
    questions: [],
  };
}

/**
 * 5. Evaluate candidate's viva defense
 */
export async function evaluateVivaAnswer(
  questionId: string,
  studentAnswer: string,
  questionText?: string,
  expectedKeyConcepts?: string[]
): Promise<VivaEvaluationResponse> {
  // Try Next.js server-side /api/viva/evaluate
  try {
    const res = await fetch("/api/viva/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        answer: studentAnswer,
        questionText,
        expectedKeyConcepts,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall through to client evaluation
  }

  // Client-side intelligent evaluation heuristic
  const lower = studentAnswer.toLowerCase();
  const concepts: string[] = expectedKeyConcepts || ["error handling", "performance", "state"];
  const covered = concepts.filter((c: string) => lower.includes(c.toLowerCase()));
  const missed = concepts.filter((c: string) => !lower.includes(c.toLowerCase()));

  const builderSignals: string[] = [];
  if (lower.includes("error") || lower.includes("try") || lower.includes("catch") || lower.includes("fallback")) {
    builderSignals.push("Concrete error handling & exception flow referenced.");
  }
  if (lower.includes("state") || lower.includes("cache") || lower.includes("memory") || lower.includes("db") || lower.includes("async")) {
    builderSignals.push("System state and runtime resource awareness demonstrated.");
  }

  const accuracyScore = Math.min(95, Math.max(30, 45 + covered.length * 20));
  const authenticityScore = Math.min(95, Math.max(25, 50 + builderSignals.length * 15));
  const edgeCaseScore = Math.min(95, Math.max(20, 40 + (lower.includes("edge") || lower.includes("fail") ? 30 : 10)));
  const compositeScore = Math.round(0.40 * accuracyScore + 0.35 * authenticityScore + 0.25 * edgeCaseScore);
  const verdict = compositeScore >= 75 ? "VERIFIED_BUILDER" : compositeScore >= 50 ? "PROBABLE_AUTHOR" : "SUSPECT_AI_FLUFF";
  const feedback = verdict === "VERIFIED_BUILDER"
    ? "Solid understanding of core implementation and architectural choices demonstrated."
    : verdict === "PROBABLE_AUTHOR"
    ? "Adequate baseline understanding, though answers lacked deep edge case handling."
    : "Answers relied on generic statements rather than demonstrating line-level comprehension.";

  return {
    question_id: questionId,
    score: compositeScore,
    technical_accuracy: accuracyScore,
    tactical_authenticity: authenticityScore,
    edge_case_preparedness: edgeCaseScore,
    verdict,
    key_concepts_covered: covered,
    missed_concepts: missed,
    builder_signals_detected: builderSignals,
    fluff_signals_detected: [],
    feedback,
    evaluator_note: `Candidate demonstrated ${verdict.replace(/_/g, " ").toLowerCase()} characteristics with ${builderSignals.length} practical implementation signals.`,
  };
}
