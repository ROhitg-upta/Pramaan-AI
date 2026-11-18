import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSession } from "@/lib/server/auth";
import { query, isDatabaseConfigured } from "@/lib/server/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Forbidden client fields that must never be accepted from the browser
const FORBIDDEN_CLIENT_FIELDS = [
  "score",
  "ai_score",
  "evaluator_score",
  "final_pramaan_score",
  "viva_defense_score",
  "status",
  "verdict",
  "is_practice",
  "certificate_id",
  "certificate_sha256",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Reject any request attempting to supply authoritative fields
    for (const field of FORBIDDEN_CLIENT_FIELDS) {
      if (body[field] !== undefined) {
        return NextResponse.json(
          {
            error: "FORBIDDEN_FIELD",
            message: `Authoritative field '${field}' cannot be supplied by the client. Scores are computed exclusively server-side.`,
          },
          { status: 400 }
        );
      }
    }

    const { assessment_id, question_index, answer, idempotency_key } = body;

    if (!assessment_id || question_index === undefined || !answer) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "assessment_id, question_index, and answer are required." },
        { status: 400 }
      );
    }

    const cleanAnswer = String(answer).trim();
    if (cleanAnswer.length < 5) {
      return NextResponse.json(
        { error: "ANSWER_TOO_SHORT", message: "Defense answer must be at least 5 characters." },
        { status: 400 }
      );
    }

    const session = await getVerifiedSession(req);

    // 2. Database Connectivity Check
    if (!isDatabaseConfigured) {
      // In practice mode without persistent database, evaluate live but refuse official credential
      const fallbackResult = await evaluateAnswerWithConcepts(
        "General Implementation",
        cleanAnswer,
        ["error handling", "performance", "state"]
      );

      return NextResponse.json({
        is_practice: true,
        evaluation: fallbackResult,
        status: "IN_PROGRESS",
        message: "Evaluated in ephemeral practice mode. Not persisted to authoritative ledger.",
      });
    }

    // 3. Load Stored Assessment Record
    const assessmentRows = await query(
      `SELECT * FROM assessments WHERE id = $1`,
      [assessment_id]
    );

    if (assessmentRows.length === 0) {
      return NextResponse.json({ error: "ASSESSMENT_NOT_FOUND", message: "Assessment record not found." }, { status: 404 });
    }

    const assessment = assessmentRows[0];

    // Check completion state: finalized assessments are immutable
    if (assessment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "ASSESSMENT_FINALIZED", message: "This assessment is already completed and finalized. No further submissions permitted." },
        { status: 400 }
      );
    }

    // 4. Validate Candidate Ownership
    if (!assessment.is_practice) {
      if (!session) {
        return NextResponse.json(
          { error: "UNAUTHORIZED", message: "Authenticated session required for official assessment submissions." },
          { status: 401 }
        );
      }

      if (session.userId !== assessment.candidate_user_id) {
        return NextResponse.json(
          { error: "FORBIDDEN_CANDIDATE_MISMATCH", message: "You are not authorized to submit answers for this assessment." },
          { status: 403 }
        );
      }
    }

    // 5. Load Stored Question Exchange from DB
    const exchangeRows = await query(
      `SELECT * FROM assessment_exchanges WHERE assessment_id = $1 AND question_index = $2`,
      [assessment_id, question_index]
    );

    if (exchangeRows.length === 0) {
      return NextResponse.json(
        { error: "QUESTION_NOT_FOUND", message: `Question index ${question_index} does not exist in this assessment.` },
        { status: 404 }
      );
    }

    const exchange = exchangeRows[0];

    // 6. Concurrency Control & Idempotency
    if (exchange.answered_at) {
      // If submitted with identical idempotency key and identical answer: return existing result (safe idempotent retry)
      if (idempotency_key && exchange.idempotency_key === idempotency_key && exchange.student_answer === cleanAnswer) {
        return NextResponse.json({
          idempotent_replay: true,
          question_index,
          ai_score: exchange.ai_score,
          feedback: exchange.feedback,
          builder_signals: exchange.builder_signals,
          fluff_signals: exchange.fluff_signals,
          assessment_status: assessment.status,
        });
      }

      // If conflicting answer submitted for an already answered question
      return NextResponse.json(
        {
          error: "CONFLICT_ALREADY_SUBMITTED",
          message: `Question ${question_index + 1} has already been submitted and cannot be overwritten.`,
        },
        { status: 409 }
      );
    }

    // 7. Server-Side Answer Evaluation (Using stored question & expected concepts)
    let evaluationResult: any = null;
    try {
      evaluationResult = await evaluateAnswerWithConcepts(
        exchange.question_text,
        cleanAnswer,
        exchange.expected_concepts || []
      );
    } catch (evalErr: any) {
      // Network or AI provider error: DO NOT set score to 0! Leave pending for retry.
      console.error("Evaluation provider error:", evalErr);
      return NextResponse.json(
        {
          error: "EVALUATION_PROVIDER_UNAVAILABLE",
          message: "The automated evaluation service encountered a temporary network timeout. Please retry submission.",
        },
        { status: 502 }
      );
    }

    const { score, feedback, builderSignals, fluffSignals } = evaluationResult;

    // 8. Atomically Update Exchange in Database
    await query(
      `UPDATE assessment_exchanges
       SET student_answer = $1,
           answered_at = CURRENT_TIMESTAMP,
           idempotency_key = $2,
           ai_score = $3,
           feedback = $4,
           builder_signals = $5,
           fluff_signals = $6
       WHERE assessment_id = $7 AND question_index = $8`,
      [
        cleanAnswer,
        idempotency_key || null,
        score,
        feedback,
        JSON.stringify(builderSignals || []),
        JSON.stringify(fluffSignals || []),
        assessment_id,
        question_index,
      ]
    );

    // 9. Check Assessment Completion
    const allExchanges = await query(
      `SELECT ai_score FROM assessment_exchanges WHERE assessment_id = $1 ORDER BY question_index ASC`,
      [assessment_id]
    );

    const answeredCount = allExchanges.filter((e) => e.ai_score !== null).length;
    const isAllCompleted = answeredCount === allExchanges.length && allExchanges.length > 0;

    let updatedStatus = assessment.status;
    let finalPramaanScore: number | null = null;
    let vivaDefenseScore: number | null = null;
    let certificateId: string | null = null;
    let certificateSha256: string | null = null;

    if (isAllCompleted) {
      // Compute final score server-side
      const totalScore = allExchanges.reduce((acc, e) => acc + (e.ai_score || 0), 0);
      vivaDefenseScore = Math.round(totalScore / allExchanges.length);

      finalPramaanScore = Math.round(
        0.35 * assessment.git_forensics_score +
        0.25 * assessment.complexity_score +
        0.40 * vivaDefenseScore
      );

      updatedStatus = "COMPLETED";

      // Issue certificate ONLY if non-practice and candidate account linked
      if (!assessment.is_practice && assessment.candidate_user_id) {
        certificateId = `PRM-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
        const certPayload = `${certificateId}:${assessment.analysis_run_id}:${assessment.contributor_id}:${finalPramaanScore}`;
        certificateSha256 = crypto.createHash("sha256").update(certPayload).digest("hex");
      }

      await query(
        `UPDATE assessments
         SET status = 'COMPLETED',
             viva_defense_score = $1,
             final_pramaan_score = $2,
             certificate_id = $3,
             certificate_sha256 = $4,
             completed_at = CURRENT_TIMESTAMP
         WHERE id = $5`,
        [vivaDefenseScore, finalPramaanScore, certificateId, certificateSha256, assessment_id]
      );
    } else {
      await query(`UPDATE assessments SET status = 'IN_PROGRESS' WHERE id = $1`, [assessment_id]);
      updatedStatus = "IN_PROGRESS";
    }

    return NextResponse.json({
      question_index,
      ai_score: score,
      feedback,
      builder_signals: builderSignals,
      fluff_signals: fluffSignals,
      assessment_status: updatedStatus,
      is_completed: isAllCompleted,
      viva_defense_score: vivaDefenseScore,
      final_pramaan_score: finalPramaanScore,
      certificate_id: certificateId,
    });
  } catch (err: any) {
    console.error("POST /api/assessment/answer error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * Server-Side Evaluation Engine (Gemini API with Semantic Concept Fallback)
 */
async function evaluateAnswerWithConcepts(
  questionText: string,
  answer: string,
  expectedConcepts: string[]
): Promise<{
  score: number;
  feedback: string;
  builderSignals: string[];
  fluffSignals: string[];
}> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (geminiKey) {
    const prompt = `You are the Autonomous Oral Viva Examiner for Pramaan AI.
Evaluate this student defense answer strictly against the asked question.
Question: "${questionText}"
Expected Concepts: ${JSON.stringify(expectedConcepts)}
Student Answer: "${answer}"

Rules:
1. Score from 0 to 100 based on technical depth, architectural clarity, and absence of generic buzzwords.
2. Return JSON: { "score": number, "feedback": string, "builder_signals": string[], "fluff_signals": string[] }`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          score: Math.max(0, Math.min(100, Math.round(parsed.score || 70))),
          feedback: parsed.feedback || "Technical defense evaluated.",
          builderSignals: parsed.builder_signals || [],
          fluffSignals: parsed.fluff_signals || [],
        };
      }
    }
  }

  // Deterministic Concept Matching Evaluator
  const lowerAnswer = answer.toLowerCase();
  const matchedConcepts = expectedConcepts.filter((c) => lowerAnswer.includes(c.toLowerCase()));
  const conceptRatio = expectedConcepts.length > 0 ? matchedConcepts.length / expectedConcepts.length : 0.5;

  const FLUFF_PATTERNS = ["industry standard", "best practice", "scalable and clean", "modern architecture", "it just works"];
  const fluffMatches = FLUFF_PATTERNS.filter((p) => lowerAnswer.includes(p));

  let score = Math.round(50 + conceptRatio * 45 - fluffMatches.length * 15);
  score = Math.max(20, Math.min(95, score));

  return {
    score,
    feedback:
      conceptRatio > 0.5
        ? `Defended key concepts (${matchedConcepts.join(", ")}). Demonstrates code understanding.`
        : "Answer lacks concrete technical specifics visible in the committed file.",
    builderSignals: matchedConcepts.map((c) => `Demonstrated understanding of ${c}`),
    fluffSignals: fluffMatches.map((f) => `Generic textbook phrase: '${f}'`),
  };
}
