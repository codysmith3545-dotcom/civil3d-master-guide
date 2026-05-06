import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/invites";
import { INVITE_COOKIE } from "@/lib/access";

export const runtime = "nodejs";

/**
 * /invite/[token]
 *
 * Validates a signed JWT in the path, sets `kb_invite` as an HTTP-only cookie,
 * and redirects to the homepage. Pages with `visibility: invite` in their
 * frontmatter then become viewable until the cookie expires.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const payload = await verifyToken(params.token);
  if (!payload) {
    return new NextResponse(
      "Invalid or expired invite link. Ask the operator for a fresh URL.",
      { status: 401 },
    );
  }

  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set({
    name: INVITE_COOKIE,
    value: params.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // The cookie inherits the JWT's expiry implicitly on every request
    // because /lib/access.ts re-validates the JWT each time. We also set a
    // long max-age so browsers retain it across sessions.
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
