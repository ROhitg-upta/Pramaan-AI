import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSession, isAuthConfigured } from "@/lib/server/auth";

// Force Next.js 14 to treat this route as purely dynamic (never pre-rendered / statically cached)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getVerifiedSession(req);

  return NextResponse.json(
    {
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
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
