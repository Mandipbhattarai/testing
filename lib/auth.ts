import bcrypt from "bcryptjs"
import type { NextRequest, NextResponse } from "next/server"
import { sanitizeInput } from "./sanitize"
import { findUserByEmailSecure, findUserByEmailVulnerable, type Role, type User } from "./db"

export function getSecurityMode(): "secure" | "vulnerable" {
  return process.env.SECURITY_MODE === "secure" ? "secure" : "vulnerable"
}

export type AuthResult = { ok: true; user: User; redirect: string } | { ok: false; status: 400 | 401; message: string }

export async function authenticate(email: string, password: string): Promise<AuthResult> {
  const mode = getSecurityMode()
  if (mode === "secure") {
    // sanitize inputs
    const s1 = sanitizeInput(email)
    const s2 = sanitizeInput(password)
    if (!s1.ok || !s2.ok) {
      return { ok: false, status: 400, message: "Unsafe input detected" }
    }
    const user = findUserByEmailSecure(email)
    if (!user) return { ok: false, status: 401, message: "Invalid credentials" }
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return { ok: false, status: 401, message: "Invalid credentials" }
    const redirect = user.role === "admin" ? "/admin" : "/dashboard"
    return { ok: true, user, redirect }
  } else {
    // vulnerable: string-concat SQL + no hashing + reflected email in error later
    const user = findUserByEmailVulnerable(email, password)
    if (!user) {
      // On failure, message contains raw email to enable XSS reflection in UI
      return { ok: false, status: 401, message: `Login failed for: ${email}` }
    }
    const redirect = user.role === "admin" ? "/admin" : "/dashboard"
    return { ok: true, user, redirect }
  }
}

type Session = { userId: number; role: Role; email: string }

function encodeSession(s: Session): string {
  const json = JSON.stringify(s)
  return Buffer.from(json, "utf-8").toString("base64url")
}

export function decodeSession(value: string | undefined | null): Session | null {
  try {
    if (!value) return null
    const json = Buffer.from(value, "base64url").toString("utf-8")
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function setSessionCookie(res: NextResponse, s: Session) {
  res.cookies.set("session", encodeSession(s), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}

export function getSessionFromRequest(req: NextRequest): Session | null {
  const c = req.cookies.get("session")?.value
  return decodeSession(c)
}

export function requireRole(req: NextRequest, role: Role): { ok: boolean; status?: number } {
  const mode = getSecurityMode()
  const sess = getSessionFromRequest(req)
  if (!sess) return { ok: false, status: 401 }
  if (mode === "secure") {
    if (role === "admin" && sess.role !== "admin") return { ok: false, status: 403 }
    return { ok: true }
  } else {
    // vulnerable mode: weaker checks (simulate flaw): only checks session exists
    if (!sess) return { ok: false, status: 401 }
    return { ok: true }
  }
}

// Helper to render errors safely based on mode
export function formatLoginError(message: string): { unsafeHtml?: string; safeText?: string } {
  const mode = getSecurityMode()
  if (mode === "secure") {
    return { safeText: message }
  }
  // vulnerable: reflect raw message
  return { unsafeHtml: message }
}
