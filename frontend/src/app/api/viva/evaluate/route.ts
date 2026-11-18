import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, questionText } = body;
    const rawAnswer = (body.answer || body.candidateAnswer || "").trim();
    const expectedKeyConcepts = body.expectedKeyConcepts || body.expectedConcepts || [];

    if (!rawAnswer) {
      return NextResponse.json({
        question_id: questionId,
        score: 15,
        technical_accuracy: 10,
        tactical_authenticity: 15,
        edge_case_preparedness: 20,
        verdict: "UNPREPARED",
        key_concepts_covered: [],
        missed_concepts: expectedKeyConcepts || ["technical explanation", "architectural rationale"],
        builder_signals_detected: [],
        fluff_signals_detected: ["Empty defense answer provided."],
        evaluator_note: "No verbal or typed defense was submitted by the candidate for this question.",
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (geminiKey && questionText) {
      try {
        const prompt = `You are the Chief Academic Forensic Auditor for Pramaan AI.
Evaluate the student's answer to this code defense question.
Question: ${questionText}
Expected concepts: ${(expectedKeyConcepts || []).join(", ")}
Student Answer: "${rawAnswer}"

Rules:
1. Distinguish between a genuine hands-on builder (talks about variables, specific logic, trade-offs) vs AI copy-paste fluff (generic high-level textbook talk).
2. Return strict JSON with:
   score (0-100), technical_accuracy (0-100), tactical_authenticity (0-100), edge_case_preparedness (0-100),
   verdict ("VERIFIED_BUILDER" | "PROBABLE_AUTHOR" | "SUSPECT_AI_FLUFF" | "PROBABLE_FREELOADER"),
   key_concepts_covered (array of strings),
   missed_concepts (array of strings),
   builder_signals_detected (array of strings),
   fluff_signals_detected (array of strings),
   evaluator_note (string summary of evaluation).`;

        const geminiRes = await fetch(
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

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              question_id: questionId,
              ...parsed,
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini evaluation fallback:", geminiErr);
      }
    }

    // Heuristic Evaluation (Hands-on Builder vs AI Fluff)
    const lower = rawAnswer.toLowerCase();
    const concepts: string[] = expectedKeyConcepts || ["error handling", "performance", "state"];
    const covered = concepts.filter((c: string) => lower.includes(c.toLowerCase()));
    const missed = concepts.filter((c: string) => !lower.includes(c.toLowerCase()));

    // Builder signals: code terms, file references, error states, specific functions
    const builderSignals: string[] = [];
    if (lower.includes("error") || lower.includes("try") || lower.includes("catch") || lower.includes("fallback")) {
      builderSignals.push("Concrete error handling & exception flow referenced.");
    }
    if (lower.includes("state") || lower.includes("cache") || lower.includes("memory") || lower.includes("db") || lower.includes("async")) {
      builderSignals.push("System state and runtime resource awareness demonstrated.");
    }
    if (lower.length > 80 && (lower.includes("because") || lower.includes("instead of") || lower.includes("trade-off") || lower.includes("opted"))) {
      builderSignals.push("Architectural trade-off justification provided.");
    }

    // Fluff signals: purely generic textbook phrases
    const fluffSignals: string[] = [];
    if (lower.includes("it makes the code clean and scalable") || lower.includes("industry standard best practices")) {
      fluffSignals.push("Recited generic textbook buzzwords without citing code specifics.");
    }
    if (lower.length < 35) {
      fluffSignals.push("Minimalist response lacking technical depth.");
    }

    const accuracyScore = Math.min(95, Math.max(30, 40 + covered.length * 20 + builderSignals.length * 10 - fluffSignals.length * 15));
    const authenticityScore = Math.min(95, Math.max(25, 45 + builderSignals.length * 18 - fluffSignals.length * 20));
    const edgeCaseScore = Math.min(95, Math.max(20, 35 + (lower.includes("edge") || lower.includes("fail") || lower.includes("crash") ? 35 : 10)));

    const compositeScore = Math.round(0.40 * accuracyScore + 0.35 * authenticityScore + 0.25 * edgeCaseScore);
    const verdict = compositeScore >= 75 ? "VERIFIED_BUILDER" : compositeScore >= 50 ? "PROBABLE_AUTHOR" : "SUSPECT_AI_FLUFF";
    const feedback = verdict === "VERIFIED_BUILDER"
      ? "Strong architectural comprehension demonstrated with specific code rationale."
      : verdict === "PROBABLE_AUTHOR"
      ? "Acceptable implementation understanding, though edge case handling could be deeper."
      : "High risk of AI-generated or superficial comprehension. Concepts were missed or answered with generic fluff.";

    return NextResponse.json({
      question_id: questionId,
      score: compositeScore,
      technical_accuracy: accuracyScore,
      tactical_authenticity: authenticityScore,
      edge_case_preparedness: edgeCaseScore,
      verdict,
      key_concepts_covered: covered,
      missed_concepts: missed,
      builder_signals_detected: builderSignals,
      fluff_signals_detected: fluffSignals,
      feedback,
      evaluator_note: `Candidate demonstrated ${verdict.replace(/_/g, " ").toLowerCase()} characteristics with ${builderSignals.length} practical implementation signals and ${covered.length}/${concepts.length} key concepts addressed.`,
    });
  } catch (err: any) {
    console.error("Viva evaluation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to evaluate defense answer." },
      { status: 500 }
    );
  }
}
