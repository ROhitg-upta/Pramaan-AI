import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({
    success: true,
    message: "Logged out successfully. Session cookie cleared.",
  });

  res.cookies.set("pramaan_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}
