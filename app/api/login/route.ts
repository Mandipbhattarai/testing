export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import {
  authenticate,
  formatLoginError,
  setSessionCookie,
} from "../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const result = await authenticate(email, password);
    if (!result.ok) {
      const fmt = formatLoginError(result.message);
      // Return message as-is; client will decide how to render (safe vs innerHTML)
      return NextResponse.json(
        { message: fmt.unsafeHtml ?? fmt.safeText },
        { status: result.status }
      );
    }
    const res = NextResponse.json({ redirect: result.redirect });
    setSessionCookie(res, {
      userId: result.user.id,
      role: result.user.role,
      email: result.user.email,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
