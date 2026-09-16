/**
 * Pramaan AI — Unified Dual-Mode API Client
 * Seamlessly connects to FastAPI backend or falls back to standard forensic mock data
 */

import {
  type AnalysisStatusResponse,
  type FullReportResponse,
  type VivaQuestion,
  type VivaQuestionsResponse,
  type VivaEvaluationResponse,
  mockStatusProcessing,
  mockStatusCompleted,
  mockFullReport,
  mockVivaQuestions,
  mockVivaEvalFluff,
  mockVivaEvalBuilder,
} from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const IS_MOCK_ENV = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Helper for simulated mock network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiClientConfig {
  forceMock?: boolean;
}

/**
 * Health check to probe backend readiness
 */
export async function checkBackendHealth(): Promise<{
  live: boolean;
  mode: "LIVE" | "MOCK";
  url: string;
  latencyMs?: number;
}> {
  if (IS_MOCK_ENV) {
    return { live: true, mode: "MOCK", url: "MOCK://internal" };
  }

  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/docs`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);
    return {
      live: res.ok || res.status < 500,
      mode: res.ok ? "LIVE" : "MOCK",
      url: API_BASE_URL,
      latencyMs,
    };
  } catch {
    return {
      live: false,
      mode: "MOCK",
      url: API_BASE_URL,
    };
  }
}

/**
 * 1. POST /api/v1/analyze/repo — Ingest and start analysis
 */
export async function analyzeRepo(
  repoUrl: string,
  branch = "main",
  config?: ApiClientConfig
): Promise<{ analysis_id: string; status: string; message: string }> {
  if (IS_MOCK_ENV || config?.forceMock) {
    await delay(600);
    return {
      analysis_id: "8fae491c-7721-4f11-b51c-8e4210d3f23a",
      status: "processing",
      message: "Repository cloned. Forensic analysis pipeline initialized.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/analyze/repo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: repoUrl, branch }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Pramaan API analyzeRepo failed, falling back to mock:", error);
    await delay(500);
    return {
      analysis_id: "8fae491c-7721-4f11-b51c-8e4210d3f23a",
      status: "processing",
      message: "[Fallback Mock] Repository cloned. Forensic analysis pipeline initialized.",
    };
  }
}

/**
 * 2. GET /api/v1/analyze/{id}/status — Polling scanning status
 */
export async function getAnalysisStatus(
  analysisId: string,
  pollCount = 0,
  config?: ApiClientConfig
): Promise<AnalysisStatusResponse> {
  if (IS_MOCK_ENV || config?.forceMock) {
    await delay(350);
    // Simulate progressive completion over multiple polls
    if (pollCount > 4) {
      return { ...mockStatusCompleted, analysis_id: analysisId };
    }
    const simulatedProgress = Math.min(25 + pollCount * 18, 95);
    return {
      ...mockStatusProcessing,
      analysis_id: analysisId,
      progress_percent: simulatedProgress,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/analyze/${analysisId}/status`);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Pramaan API getAnalysisStatus failed, using mock:", error);
    await delay(300);
    return {
      ...mockStatusProcessing,
      analysis_id: analysisId,
      progress_percent: Math.min(45 + pollCount * 15, 100),
    };
  }
}

/**
 * 3. GET /api/v1/analyze/{id}/report — Complete forensic audit report
 */
export async function getAnalysisReport(
  analysisId: string,
  config?: ApiClientConfig
): Promise<FullReportResponse> {
  if (IS_MOCK_ENV || config?.forceMock) {
    await delay(500);
    return {
      ...mockFullReport,
      analysis_id: analysisId,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/analyze/${analysisId}/report`);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Pramaan API getAnalysisReport failed, returning mock report:", error);
    await delay(400);
    return {
      ...mockFullReport,
      analysis_id: analysisId,
    };
  }
}

/**
 * 4. POST /api/v1/viva/{id}/questions — Generate line-targeted viva questions
 */
export async function getVivaQuestions(
  analysisId: string,
  contributorId: string,
  questionCount = 3,
  config?: ApiClientConfig
): Promise<VivaQuestionsResponse> {
  if (IS_MOCK_ENV || config?.forceMock) {
    await delay(600);
    const questions: VivaQuestion[] =
      mockVivaQuestions[contributorId] || mockVivaQuestions["contrib-002"] || [];
    const contributor = mockFullReport.contributors.find((c) => c.id === contributorId);

    return {
      contributor_id: contributorId,
      contributor_name: contributor?.primary_name || "Contributor",
      questions: questions.slice(0, questionCount),
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/viva/${analysisId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contributor_id: contributorId,
        question_count: questionCount,
      }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Pramaan API getVivaQuestions failed, using mock questions:", error);
    await delay(400);
    const questions = mockVivaQuestions[contributorId] || mockVivaQuestions["contrib-002"] || [];
    const contributor = mockFullReport.contributors.find((c) => c.id === contributorId);

    return {
      contributor_id: contributorId,
      contributor_name: contributor?.primary_name || "Aryan Kumar",
      questions: questions.slice(0, questionCount),
    };
  }
}

/**
 * 5. POST /api/v1/viva/evaluate — Evaluate candidate's viva defense
 */
export async function evaluateVivaAnswer(
  questionId: string,
  studentAnswer: string,
  config?: ApiClientConfig
): Promise<VivaEvaluationResponse> {
  if (IS_MOCK_ENV || config?.forceMock) {
    await delay(800);
    // Simple heuristic: if candidate mentions real technical terms, use builder score
    const hasBuilderSignals =
      studentAnswer.toLowerCase().includes("lock") ||
      studentAnswer.toLowerCase().includes("ttl") ||
      studentAnswer.toLowerCase().includes("concurrency") ||
      studentAnswer.toLowerCase().includes("race condition");

    if (hasBuilderSignals) {
      return {
        ...mockVivaEvalBuilder,
        question_id: questionId,
      };
    }
    return {
      ...mockVivaEvalFluff,
      question_id: questionId,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/viva/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        student_answer: studentAnswer,
      }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Pramaan API evaluateVivaAnswer failed, returning mock evaluation:", error);
    await delay(600);
    return {
      ...mockVivaEvalFluff,
      question_id: questionId,
    };
  }
}
