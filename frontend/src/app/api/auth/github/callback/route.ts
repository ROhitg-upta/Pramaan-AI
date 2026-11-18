import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, isAuthConfigured } from "@/lib/server/auth";
import { query, isDatabaseConfigured } from "@/lib/server/db";

export const dynamic = "force-dynamic";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID?.trim() || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET?.trim() || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = req.cookies.get("pramaan_oauth_state")?.value;
  const returnTo = req.cookies.get("pramaan_oauth_return")?.value || "/";

  // Validate CSRF state
  if (!code || !state || state !== storedState) {
    return NextResponse.json(
      { error: "INVALID_OAUTH_STATE", message: "OAuth state verification failed. Possible CSRF attempt." },
      { status: 400 }
    );
  }

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !isAuthConfigured) {
    return NextResponse.json(
      { error: "AUTH_NOT_CONFIGURED", message: "GitHub OAuth credentials or AUTH_SECRET not configured on server." },
      { status: 503 }
    );
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { error: "OAUTH_EXCHANGE_FAILED", message: tokenData.error_description || "Failed to exchange GitHub OAuth code." },
        { status: 401 }
      );
    }

    // 2. Fetch authenticated GitHub user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Pramaan-AI-Auth/2.0",
      },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "FAILED_TO_FETCH_USER", message: "Could not retrieve GitHub profile." }, { status: 502 });
    }

    const ghUser = await userRes.json();
    const githubNumericId = ghUser.id; // Immutable numeric ID
    const githubLogin = ghUser.login;
    const fullName = ghUser.name || ghUser.login;

    // 3. Fetch primary verified email
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Pramaan-AI-Auth/2.0",
      },
    });

    let primaryEmail = ghUser.email;
    if (emailsRes.ok) {
      const emails = await emailsRes.json();
      if (Array.isArray(emails)) {
        const verified = emails.find((e: any) => e.primary && e.verified) || emails[0];
        if (verified) primaryEmail = verified.email;
      }
    }

    if (!primaryEmail) {
      primaryEmail = `${githubLogin}@users.noreply.github.com`;
    }

    // 4. Role Assignment & Institution Whitelist Check
    let role: "STUDENT" | "EVALUATOR" | "ADMIN" = "STUDENT";
    let isInstitutionVerified = false;
    let institutionId: string | null = null;
    let organizationName: string | undefined = undefined;

    const userId = `usr_${githubNumericId}`;

    if (isDatabaseConfigured) {
      try {
        // Check if pre-approved in institution_evaluators table
        const evalRows = await query(
          `SELECT * FROM institution_evaluators WHERE email = $1`,
          [primaryEmail]
        );

        if (evalRows.length > 0) {
          role = "EVALUATOR";
          isInstitutionVerified = true;
          institutionId = evalRows[0].institution_id;
          organizationName = evalRows[0].institution_name;
        }

        // Upsert user in database
        await query(
          `INSERT INTO users (
            id, email, full_name, github_numeric_id, github_login, role, is_institution_verified, institution_id, organization_name
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            github_login = EXCLUDED.github_login,
            updated_at = CURRENT_TIMESTAMP`,
          [userId, primaryEmail, fullName, githubNumericId, githubLogin, role, isInstitutionVerified, institutionId, organizationName]
        );
      } catch (dbErr) {
        console.warn("User upsert in database notice:", dbErr);
      }
    }

    // 5. Create Cryptographic Session Token (jose)
    const sessionToken = await createSessionToken({
      userId,
      email: primaryEmail,
      fullName,
      githubNumericId,
      githubLogin,
      accountLinkage: "GITHUB_ACCOUNT_LINKED",
      role,
      isInstitutionVerified,
      institutionId,
      organizationName,
    });

    // 6. Set HTTP-only Secure Cookie and Redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
    let baseOrigin: string;
    if (appUrl) {
      baseOrigin = appUrl.replace(/\/+$/, "");
    } else {
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      baseOrigin = `${protocol}://${host}`;
    }
    const targetUrl = new URL(returnTo, baseOrigin);

    const res = NextResponse.redirect(targetUrl.toString());

    res.cookies.set("pramaan_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Clear temporary OAuth cookies
    res.cookies.delete("pramaan_oauth_state");
    res.cookies.delete("pramaan_oauth_return");

    return res;
  } catch (err: any) {
    console.error("GitHub OAuth Callback error:", err);
    return NextResponse.json({ error: "INTERNAL_OAUTH_ERROR", message: err?.message || "OAuth processing failed." }, { status: 500 });
  }
}
