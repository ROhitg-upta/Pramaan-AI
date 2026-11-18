/**
 * Pramaan AI — Server-Side Cryptographic Authentication & Authorization
 * Edge & Node compatible via 'jose' library
 */

import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const AUTH_SECRET_STRING = process.env.AUTH_SECRET?.trim() || "";
export const isAuthConfigured = AUTH_SECRET_STRING.length >= 16;

const SECRET_KEY = isAuthConfigured
  ? new TextEncoder().encode(AUTH_SECRET_STRING)
  : new TextEncoder().encode("unconfigured_dev_fallback_secret_32_bytes_len");

export interface VerifiedSession {
  userId: string;
  email: string;
  fullName: string;
  githubNumericId: number | null;
  githubLogin: string | null;
  accountLinkage: "GITHUB_ACCOUNT_LINKED" | "UNLINKED";
  role: "STUDENT" | "EVALUATOR" | "ADMIN";
  isInstitutionVerified: boolean;
  institutionId?: string | null;
  organizationName?: string;
}

/**
 * Sign a new cryptographic session token
 */
export async function createSessionToken(session: VerifiedSession, expiresIn = "7d"): Promise<string> {
  if (!isAuthConfigured) {
    throw new Error("AUTH_NOT_CONFIGURED: AUTH_SECRET is not configured in server environment variables.");
  }

  return await new SignJWT({
    email: session.email,
    fullName: session.fullName,
    githubNumericId: session.githubNumericId,
    githubLogin: session.githubLogin,
    accountLinkage: session.accountLinkage,
    role: session.role,
    isInstitutionVerified: session.isInstitutionVerified,
    institutionId: session.institutionId || null,
    organizationName: session.organizationName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

/**
 * Verify incoming session from Request (Cookie or Authorization Bearer header)
 */
export async function getVerifiedSession(req: NextRequest): Promise<VerifiedSession | null> {
  if (!isAuthConfigured) {
    return null; // Missing auth config strictly returns null session (never bypasses)
  }

  // 1. Check Bearer header
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    // 2. Check pramaan_session cookie
    token = req.cookies.get("pramaan_session")?.value || null;
  }

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ["HS256"] });

    return {
      userId: payload.sub as string,
      email: (payload.email as string) || "",
      fullName: (payload.fullName as string) || "",
      githubNumericId: (payload.githubNumericId as number) || null,
      githubLogin: (payload.githubLogin as string) || null,
      accountLinkage: (payload.accountLinkage as any) || "UNLINKED",
      role: (payload.role as any) || "STUDENT",
      isInstitutionVerified: Boolean(payload.isInstitutionVerified),
      institutionId: (payload.institutionId as string) || null,
      organizationName: payload.organizationName as string | undefined,
    };
  } catch {
    return null; // Invalid or expired token
  }
}

/**
 * Require a verified session; throws an error response if unauthenticated
 */
export async function requireAuth(req: NextRequest): Promise<VerifiedSession> {
  if (!isAuthConfigured) {
    throw new Response(
      JSON.stringify({
        error: "AUTH_NOT_CONFIGURED",
        message: "Server authentication is not configured in environment variables.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const session = await getVerifiedSession(req);
  if (!session) {
    throw new Response(
      JSON.stringify({
        error: "UNAUTHORIZED",
        message: "Valid authenticated session required.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return session;
}

/**
 * Require verified Institutional Evaluator role
 */
export async function requireEvaluator(req: NextRequest): Promise<VerifiedSession> {
  const session = await requireAuth(req);

  if (session.role !== "EVALUATOR" || !session.isInstitutionVerified) {
    throw new Response(
      JSON.stringify({
        error: "FORBIDDEN_EVALUATOR_REQUIRED",
        message: "Institutional Evaluator privileges require server-verified credentials.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return session;
}
