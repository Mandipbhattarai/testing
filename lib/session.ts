import jwt from "jsonwebtoken";

// ⚠️ use a secret in .env
const SECRET = process.env.SESSION_SECRET || "dev_secret";

export interface SessionData {
  userId: string;
  role: "user" | "admin";
  email: string;
}

// Encode cookie
export function encodeSession(data: SessionData): string {
  return jwt.sign(data, SECRET);
}

// Decode cookie (safe for middleware)
export function decodeSession(token?: string): SessionData | null {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as SessionData;
  } catch {
    return null;
  }
}
