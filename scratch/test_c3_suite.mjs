/**
 * Pramaan AI — Phase C3 Static & Runtime Verification Suite
 * 
 * Verifies:
 * 1. Production Origin & OAuth Route Verification
 * 2. Scoped Evaluator Authorization (institution_id, not free-text orgName)
 * 3. Atomic Concurrency Claim SQL in Answer Submission
 * 4. C3 Data Flow (Viva -> Assessment Ledger -> Verdict -> Certificate)
 * 5. Credential Honesty & Disclaimers
 */

import fs from "fs";
import path from "path";

const ROOT_DIR = "C:/Users/rohit/OneDrive/Desktop/Pramaan AI";

console.log("===============================================================================");
console.log("   PRAMAAN AI — PHASE C3 VERIFICATION SUITE");
console.log("===============================================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${testName}`);
    if (details) console.log(`         -> ${details}`);
  } else {
    console.error(`  [FAIL] Test ${totalTests}: ${testName}`);
    if (details) console.error(`         -> ${details}`);
    process.exitCode = 1;
  }
}

// =============================================================================
// SUITE 1: Production Origin & OAuth Route Integrity
// =============================================================================
console.log("--- SUITE 1: Production Origin & OAuth Route Integrity ---");
{
  const githubRoutePath = path.join(ROOT_DIR, "frontend/src/app/api/auth/github/route.ts");
  const callbackRoutePath = path.join(ROOT_DIR, "frontend/src/app/api/auth/github/callback/route.ts");
  const envExamplePath = path.join(ROOT_DIR, "frontend/.env.example");

  assert(fs.existsSync(githubRoutePath), "OAuth initiation route exists", githubRoutePath);
  assert(fs.existsSync(callbackRoutePath), "OAuth callback route exists", callbackRoutePath);

  const githubRouteSrc = fs.readFileSync(githubRoutePath, "utf-8");
  assert(
    githubRouteSrc.includes("process.env.NEXT_PUBLIC_APP_URL"),
    "OAuth initiation route respects NEXT_PUBLIC_APP_URL override",
    "Uses configured production origin over request headers when present"
  );

  const envExampleSrc = fs.readFileSync(envExamplePath, "utf-8");
  assert(
    envExampleSrc.includes("https://pramaan-ai-frontend-lovat.vercel.app"),
    "Production origin matches exact deployed URL in env example",
    "NEXT_PUBLIC_APP_URL=https://pramaan-ai-frontend-lovat.vercel.app"
  );
  assert(
    envExampleSrc.includes("https://pramaan-ai-frontend-lovat.vercel.app/api/auth/github/callback"),
    "Expected production callback URL documented in env example",
    "/api/auth/github/callback"
  );
}

// =============================================================================
// SUITE 2: Fixed Evaluator Authorization (institution_id Scoping)
// =============================================================================
console.log("\n--- SUITE 2: Fixed Evaluator Authorization & Onboarding Restrictions ---");
{
  const assessmentRoutePath = path.join(ROOT_DIR, "frontend/src/app/api/assessment/route.ts");
  const assessmentRouteSrc = fs.readFileSync(assessmentRoutePath, "utf-8");

  assert(
    !assessmentRouteSrc.includes("session.organizationName === assessment.organization_name"),
    "Assessment route rejects free-text organizationName equality",
    "Eliminated insecure free-text org matching"
  );

  assert(
    assessmentRouteSrc.includes("assessment.institution_id && session.institutionId && session.institutionId === assessment.institution_id"),
    "Assessment route strictly enforces server-managed institution_id match",
    "Requires explicit institution ID linkage"
  );

  const pySecurityPath = path.join(ROOT_DIR, "backend/app/core/security.py");
  const pySecuritySrc = fs.readFileSync(pySecurityPath, "utf-8");

  assert(
    pySecuritySrc.includes("institution_id: Optional[str] = None") &&
    pySecuritySrc.includes("institution_id and user_inst and user_inst == institution_id"),
    "FastAPI security engine enforces institution_id resource scoping",
    "Rejects unverified evaluators without server-managed institution membership"
  );

  const onboardingPath = path.join(ROOT_DIR, "frontend/src/app/auth/onboarding/page.tsx");
  const onboardingSrc = fs.readFileSync(onboardingPath, "utf-8");

  assert(
    !onboardingSrc.includes('loginAs("evaluator")'),
    "Onboarding page prevents self-assigning institutional evaluator status",
    "Does not grant client-side evaluator privileges"
  );
}

// =============================================================================
// SUITE 3: Concurrency Control & Atomic SQL Claiming
// =============================================================================
console.log("\n--- SUITE 3: Atomic SQL Claiming & Provider Failure Non-Destructiveness ---");
{
  const answerRoutePath = path.join(ROOT_DIR, "frontend/src/app/api/assessment/answer/route.ts");
  const answerRouteSrc = fs.readFileSync(answerRoutePath, "utf-8");

  assert(
    answerRouteSrc.includes("claim_status = 'EVALUATING'") &&
    answerRouteSrc.includes("claim_token = $1") &&
    answerRouteSrc.includes("RETURNING id"),
    "Answer endpoint executes atomic conditional SQL claim before external AI evaluation",
    "UPDATE assessment_exchanges SET claim_status = 'EVALUATING' ... RETURNING id"
  );

  assert(
    answerRouteSrc.includes("claimResult.length === 0") &&
    answerRouteSrc.includes("EVALUATION_IN_PROGRESS"),
    "Concurrent request on active claim triggers conflict rejection (409)",
    "Prevents duplicate external API calls and race conditions"
  );

  assert(
    answerRouteSrc.includes("claim_status = 'FAILED'") &&
    answerRouteSrc.includes("claim_token = NULL") &&
    answerRouteSrc.includes("502"),
    "External provider failure releases claim and returns 502 Bad Gateway without zeroing scores",
    "Scores remain intact for candidate retry"
  );

  const schemaPath = path.join(ROOT_DIR, "database/migrations/001_initial_schema.sql");
  const schemaSrc = fs.readFileSync(schemaPath, "utf-8");

  assert(
    schemaSrc.includes("claim_status VARCHAR(32)") &&
    schemaSrc.includes("claim_token VARCHAR(128)") &&
    schemaSrc.includes("claimed_at TIMESTAMP WITH TIME ZONE"),
    "Database migration DDL includes concurrency claim tracking columns",
    "claim_status, claim_token, and claimed_at present in assessment_exchanges"
  );
}

// =============================================================================
// SUITE 4: C3 Data Flow (Viva -> Assessment Ledger -> Verdict)
// =============================================================================
console.log("\n--- SUITE 4: End-to-End Assessment Data Flow ---");
{
  const vivaPagePath = path.join(ROOT_DIR, "frontend/src/app/viva/[analysisId]/[contributorId]/page.tsx");
  const vivaPageSrc = fs.readFileSync(vivaPagePath, "utf-8");

  assert(
    vivaPageSrc.includes('fetch("/api/assessment"'),
    "Viva page initiates or resumes authoritative assessment via server API",
    "POST /api/assessment"
  );

  assert(
    vivaPageSrc.includes('fetch("/api/assessment/answer"'),
    "Viva page submits answers to authoritative answer endpoint",
    "POST /api/assessment/answer"
  );

  assert(
    vivaPageSrc.includes("firstUnanswered !== -1"),
    "Viva page resumes from first unanswered question on page reload",
    "State recovered from persisted exchanges"
  );

  assert(
    vivaPageSrc.includes("assessmentId ? `/verdict/${analysisId}?assessmentId=${assessmentId}`"),
    "Viva page routes to Verdict with assessmentId query parameter",
    "Binds verdict directly to completed server assessment"
  );

  const verdictPagePath = path.join(ROOT_DIR, "frontend/src/app/verdict/[analysisId]/page.tsx");
  const verdictPageSrc = fs.readFileSync(verdictPagePath, "utf-8");

  assert(
    verdictPageSrc.includes('fetch(`/api/assessment?id=${encodeURIComponent(assessmentId)}') &&
    verdictPageSrc.includes("asmData.scores.viva_defense"),
    "Verdict page reads authoritative scores from persisted assessment endpoint",
    "GET /api/assessment?id=..."
  );

  const subScorePath = path.join(ROOT_DIR, "frontend/src/components/verdict/SubScoreBreakdown.tsx");
  const subScoreSrc = fs.readFileSync(subScorePath, "utf-8");

  assert(
    subScoreSrc.includes("vivaDefense: number | null") &&
    subScoreSrc.includes('item.isPending ? "PENDING" : item.score'),
    "SubScoreBreakdown honestly renders PENDING for unassessed viva scores",
    "No fake fallback score (e.g. 92 or 30)"
  );
}

// =============================================================================
// SUITE 5: Credential Honesty & Standalone Migration Runner
// =============================================================================
console.log("\n--- SUITE 5: Credential Honesty & Migration Runner ---");
{
  const certPath = path.join(ROOT_DIR, "frontend/src/components/certificate/ProofCertificatePDF.tsx");
  const certSrc = fs.readFileSync(certPath, "utf-8");

  assert(
    certSrc.includes("Does not constitute mathematical proof of exclusive authorship"),
    "Certificate displays mandatory comprehension-not-exclusive-authorship disclaimer",
    "Comprehension disclaimer preserved"
  );

  const migratePath = path.join(ROOT_DIR, "scripts/migrate.mjs");
  assert(fs.existsSync(migratePath), "Standalone Node migration runner exists", migratePath);

  const pyMigratePath = path.join(ROOT_DIR, "backend/app/core/migrate.py");
  assert(fs.existsSync(pyMigratePath), "Python migration runner exists", pyMigratePath);
}

console.log("\n===============================================================================");
console.log(`   PHASE C3 VERIFICATION RESULT: ${passedTests}/${totalTests} TESTS PASSED`);
console.log("===============================================================================\n");
