import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSession, isAuthConfigured } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const session = await getVerifiedSession(req);

  return NextResponse.json({
    authConfigured: isAuthConfigured,
    authenticated: Boolean(session),
    user: session
      ? {
          id: session.userId,
          email: session.email,
          fullName: session.fullName,
          role: session.role,
          githubNumericId: session.githubNumericId,
          githubLogin: session.githubLogin,
          accountLinkage: session.accountLinkage,
          isInstitutionVerified: session.isInstitutionVerified,
          organizationName: session.organizationName,
        }
      : null,
  });
}
