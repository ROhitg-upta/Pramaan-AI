import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSession, requireAuth, isAuthConfigured } from "@/lib/server/auth";
import { query, isDatabaseConfigured } from "@/lib/server/db";

/**
 * GET /api/assessment?id=<assessment_id>
 * Authoritative retrieval of assessment record with cross-user authorization protection
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assessmentId = searchParams.get("id");

  if (!assessmentId) {
    return NextResponse.json({ error: "Assessment ID is required." }, { status: 400 });
  }

  // Check database connectivity
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      {
        error: "DATABASE_NOT_CONFIGURED",
        message: "Assessment persistence ledger is not configured.",
      },
      { status: 503 }
    );
  }

  try {
    const rows = await query(
      `SELECT a.*, r.repo_url, r.resolved_commit_sha, r.branch, c.contributor_login, c.primary_name
       FROM assessments a
       JOIN analysis_runs r ON a.analysis_run_id = r.id
       JOIN run_contributors c ON a.contributor_id = c.id
       WHERE a.id = $1`,
      [assessmentId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    }

    const assessment = rows[0];

    // Authorization Check:
    // If assessment is an official (non-practice) record, verify caller is owner or evaluator
    if (!assessment.is_practice) {
      const session = await getVerifiedSession(req);

      if (!session) {
        return NextResponse.json(
          { error: "UNAUTHORIZED", message: "Authentication required to view official assessment records." },
          { status: 401 }
        );
      }

      const isCandidateOwner = session.userId === assessment.candidate_user_id;
      // Evaluator access is strictly resource-scoped: must be the explicitly assigned evaluator or match authorized institution
      const isAssignedEvaluator =
        session.role === "EVALUATOR" &&
        session.isInstitutionVerified &&
        Boolean(
          (assessment.assigned_evaluator_id && session.userId === assessment.assigned_evaluator_id) ||
          (assessment.organization_name && session.organizationName && session.organizationName === assessment.organization_name)
        );

      if (!isCandidateOwner && !isAssignedEvaluator) {
        return NextResponse.json(
          { error: "FORBIDDEN", message: "You are not authorized to view this private assessment. Explicit evaluator assignment or candidate ownership required." },
          { status: 403 }
        );
      }
    }

    // Load exchanges
    const exchanges = await query(
      `SELECT question_index, commit_sha, file_path, line_start, line_end, code_snippet,
              question_text, student_answer, answered_at, ai_score, evaluator_score, feedback,
              builder_signals, fluff_signals, review_signals
       FROM assessment_exchanges
       WHERE assessment_id = $1
       ORDER BY question_index ASC`,
      [assessmentId]
    );

    return NextResponse.json({
      assessment_id: assessment.id,
      analysis_run_id: assessment.analysis_run_id,
      repo_url: assessment.repo_url,
      resolved_commit_sha: assessment.resolved_commit_sha,
      branch: assessment.branch,
      contributor_login: assessment.contributor_login,
      primary_name: assessment.primary_name,
      status: assessment.status,
      is_practice: assessment.is_practice,
      account_linkage: assessment.account_linkage,
      scores: {
        git_forensics: assessment.git_forensics_score,
        complexity: assessment.complexity_score,
        viva_defense: assessment.viva_defense_score,
        final_pramaan: assessment.final_pramaan_score,
      },
      certificate_id: assessment.certificate_id,
      certificate_sha256: assessment.certificate_sha256,
      started_at: assessment.started_at,
      completed_at: assessment.completed_at,
      exchanges,
    });
  } catch (err: any) {
    console.error("GET /api/assessment error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/assessment
 * Initiate a server-owned assessment record
 * Strips any client-provided scores, status, or credentials
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysis_run_id, contributor_id, is_practice_requested, initial_questions } = body;

    if (!analysis_run_id || !contributor_id) {
      return NextResponse.json(
        { error: "analysis_run_id and contributor_id are required." },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured) {
      // In practice mode without DB, return an explicit ephemeral response
      if (is_practice_requested) {
        return NextResponse.json({
          assessment_id: `practice_${Date.now()}`,
          is_practice: true,
          status: "IN_PROGRESS",
          message: "Ephemeral practice session initialized. No official credential will be issued.",
        });
      }

      return NextResponse.json(
        {
          error: "DATABASE_NOT_CONFIGURED",
          message: "Official assessments are disabled because the authoritative database is not configured.",
        },
        { status: 503 }
      );
    }

    // Determine candidate identity from server session
    const session = await getVerifiedSession(req);
    let candidateUserId: string | null = null;
    let candidateGithubNumericId: number | null = null;
    let accountLinkage: "GITHUB_ACCOUNT_LINKED" | "UNLINKED" = "UNLINKED";
    let isPractice = Boolean(is_practice_requested);

    if (session) {
      candidateUserId = session.userId;
      candidateGithubNumericId = session.githubNumericId;
      accountLinkage = session.accountLinkage;
    } else {
      // Unauthenticated sessions are forced into practice mode
      isPractice = true;
    }

    // Generate unique assessment ID
    const assessmentId = `asm_${Math.random().toString(36).substring(2, 10)}`;

    // Verify run and contributor existence in DB
    const runRows = await query(`SELECT * FROM analysis_runs WHERE id = $1`, [analysis_run_id]);
    if (runRows.length === 0) {
      return NextResponse.json(
        { error: `Analysis run "${analysis_run_id}" not found.` },
        { status: 404 }
      );
    }

    const contribRows = await query(
      `SELECT * FROM run_contributors WHERE id = $1 AND analysis_run_id = $2`,
      [contributor_id, analysis_run_id]
    );

    const contributor = contribRows[0] || {
      git_forensics_score: 70,
      complexity_score: 65,
    };

    // Insert authoritative assessment record
    await query(
      `INSERT INTO assessments (
        id, analysis_run_id, contributor_id, candidate_user_id, candidate_github_numeric_id,
        account_linkage, status, is_practice, git_forensics_score, complexity_score,
        viva_defense_score, final_pramaan_score, rubric_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL, NULL, $11)`,
      [
        assessmentId,
        analysis_run_id,
        contributor_id,
        candidateUserId,
        candidateGithubNumericId,
        accountLinkage,
        "SCHEDULED",
        isPractice,
        contributor.git_forensics_score || 70,
        contributor.complexity_score || 65,
        "v1.0-grounded",
      ]
    );

    // Persist server-stored questions and code evidence before any student answers
    if (Array.isArray(initial_questions) && initial_questions.length > 0) {
      for (let i = 0; i < initial_questions.length; i++) {
        const q = initial_questions[i];
        await query(
          `INSERT INTO assessment_exchanges (
            id, assessment_id, question_index, commit_sha, file_path, line_start, line_end,
            code_snippet, question_text, expected_concepts, trap_signals
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (assessment_id, question_index) DO NOTHING`,
          [
            `ex_${assessmentId}_${i}`,
            assessmentId,
            i,
            q.commit_hash || "head",
            q.file_path || "unknown",
            q.line_start || 1,
            q.line_end || 30,
            q.code_snippet || "",
            q.question_text || "",
            JSON.stringify(q.expected_key_concepts || q.expected_concepts || []),
            JSON.stringify(q.trap_signals || []),
          ]
        );
      }
    }

    return NextResponse.json({
      assessment_id: assessmentId,
      analysis_run_id,
      contributor_id,
      status: "SCHEDULED",
      is_practice: isPractice,
      account_linkage: accountLinkage,
      viva_defense_score: null,
      final_pramaan_score: null,
      questions_persisted: Array.isArray(initial_questions) ? initial_questions.length : 0,
      message: isPractice
        ? "Practice assessment initialized. No official credential will be issued."
        : "Official assessment record initialized on authoritative server ledger.",
    });
  } catch (err: any) {
    console.error("POST /api/assessment error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
