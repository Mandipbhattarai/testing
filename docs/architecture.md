# Architecture

- Next.js 14 (App Router)
- SQLite (better-sqlite3) for persistence
- Simple cookie session: `{ userId, role, email }` base64url-encoded
- Security mode switch via `process.env.SECURITY_MODE`

\`\`\`mermaid
flowchart TD
  A[Browser] |Form submit JSON| B[/api/login/]
  B |SECURITY_MODE| C{Mode}
  C |secure| D[Sanitize inputs + Param queries + bcrypt]
  C |vulnerable| E[String-concat SQL + raw reflection]
  D  F{Auth OK?}
  E  F
  F |Yes| G[Set HttpOnly session cookie]
  F |No| H[Return error JSON]
  G  I[Redirect: /admin or /dashboard]
  A |GET /events| J[Server Components read from DB]
  A |GET /admin| K[Middleware checks role]
\`\`\`

Key modules:
- `lib/db.ts` – DB init and helpers
- `lib/sanitize.ts` – sanitization + HTML escape
- `lib/auth.ts` – authenticate(), session encode/decode, requireRole()
- `middleware.ts` – basic route protection
- `app/api/*` – login/register endpoints
- `scripts/seed.ts` – initial data
