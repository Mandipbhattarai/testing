# Event Management System (EMS) with Dual Security Modes

This repository implements a web-based EMS using Next.js 14 (App Router), TypeScript, Tailwind, and SQLite (better-sqlite3). It demonstrates intentionally vulnerable behavior first, then secured behavior, using a `SECURITY_MODE` switch: `vulnerable | secure`.

Key features:
- Pages: `/`, `/login`, `/register`, `/admin-login`, `/dashboard`, `/admin`, `/create-event`, `/events`, `/profile`
- API routes: `/api/login`, `/api/register`
- Auth: email/password (bcrypt) with simple HttpOnly cookie session
- DB: SQLite at `./data/ems.db` with `better-sqlite3`
- Security:
  - vulnerable: string-concatenated SQL, reflected unsanitized error, no output escaping
  - secure: parameterized queries, input sanitization, and HTML escaping
- Tests: Jest (white-box) and Selenium (black-box), generating CSV and JSON reports

## Setup

1) Install dependencies
- Use PNPM:
\`\`\`
pnpm i
\`\`\`

2) Seed DB
\`\`\`
pnpm seed
\`\`\`

3) Run initial vulnerable app (terminal A)
\`\`\`
pnpm sec:vuln
\`\`\`

4) In a new terminal (B), install Selenium deps and run initial tests
\`\`\`
pnpm selenium:init
pnpm selenium:initial
\`\`\`

5) Verify reports
- Check `reports/selenium_initial.csv` and `.json` to see SQLi/XSS vulnerabilities detected.

6) Switch to secure mode
- Stop the dev server and start secure:
\`\`\`
pnpm sec:secure
\`\`\`

7) Run final tests
\`\`\`
pnpm selenium:final
\`\`\`

8) Verify `reports/selenium_final.csv` shows PASS for blocks.

Notes:
- On Windows, ensure Python 3 and pip are in PATH. If Chrome/Chromedriver mismatch occurs, webdriver-manager will auto-install a compatible version.
- If `node scripts/seed.js` fails (no compiled JS), the script falls back to `ts-node scripts/seed.ts`.

## How Modes Work

- `SECURITY_MODE=vulnerable`
  - `/api/login` uses string-concatenated SQL with raw inputs
  - Login failure reflects the raw email back in the error (rendered via `dangerouslySetInnerHTML`)
  - Role checks are laxer
- `SECURITY_MODE=secure`
  - Inputs pass through `sanitizeInput()` (blocks SQLi/XSS payloads with "Unsafe input detected")
  - SQL queries are parameterized
  - Errors are escaped (no raw HTML)
  - Role guard enforced for admin-only paths

See `docs/architecture.md`, `docs/test-plan.md`, and `docs/results.md` for more details.
