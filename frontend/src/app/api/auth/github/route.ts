import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID?.trim() || "";

export async function GET(req: NextRequest) {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      {
        error: "GITHUB_OAUTH_NOT_CONFIGURED",
        message: "GITHUB_CLIENT_ID is not configured in environment variables. Real authentication is disabled.",
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get("returnTo") || "/";

  // Generate random CSRF state
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Prioritize explicitly configured NEXT_PUBLIC_APP_URL (e.g. https://pramaan-ai-frontend-lovat.vercel.app)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
  let redirectUri: string;
  if (appUrl) {
    redirectUri = `${appUrl.replace(/\/+$/, "")}/api/auth/github/callback`;
  } else {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    redirectUri = `${protocol}://${host}/api/auth/github/callback`;
  }

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "read:user user:email");
  githubAuthUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(githubAuthUrl.toString());

  // Set CSRF state cookie (5 minutes expiration)
  res.cookies.set("pramaan_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  res.cookies.set("pramaan_oauth_return", returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  return res;
}
