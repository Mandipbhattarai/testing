export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser } from "../../../lib/db";
import { getSecurityMode } from "../../../lib/auth";
import { sanitizeInput } from "../../../lib/sanitize";

export async function POST(req: NextRequest) {
  const mode = getSecurityMode();
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    if (mode === "secure") {
      const s1 = sanitizeInput(email);
      const s2 = sanitizeInput(password);
      if (!s1.ok || !s2.ok) {
        return NextResponse.json(
          { message: "Unsafe input detected" },
          { status: 400 }
        );
      }
    }
    const hash = await bcrypt.hash(password, 10);
    try {
      createUser(email, hash, "user");
      return NextResponse.json({ message: "ok" });
    } catch (e: any) {
      const msg =
        mode === "secure"
          ? "Registration failed"
          : `Registration failed for: ${email}`;
      return NextResponse.json({ message: msg }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}
