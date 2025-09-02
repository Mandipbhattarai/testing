export type SanitizeResult = { ok: true } | { ok: false; reason: string };

const sqliPatterns: RegExp[] = [
  // common tautologies
  /\bOR\b\s*['"]?\s*1\s*=\s*1\s*['"]?/i,
  /\bAND\b\s*['"]?\s*1\s*=\s*1\s*['"]?/i,
  // comment sequences
  /--/i,
  /#/i,
  /\/\*/i,
  // union-based injection
  /\bUNION\b\s+\bSELECT\b/i,
  // stacked queries
  /;/,
];

const xssPatterns: RegExp[] = [
  /<\s*script/i,
  /on\w+\s*=/i, // catches onerror, onload, onclick, etc.
  /javascript:/i,
  /<\s*iframe/i,
  /<\s*img/i,
  /<\s*svg/i,
  /<\s*body/i,
];

export function sanitizeInput(value: string): SanitizeResult {
  if (!value) return { ok: true };

  for (const re of sqliPatterns) {
    if (re.test(value)) {
      return { ok: false, reason: "Unsafe input detected (SQLi)" };
    }
  }
  for (const re of xssPatterns) {
    if (re.test(value)) {
      return { ok: false, reason: "Unsafe input detected (XSS)" };
    }
  }
  return { ok: true };
}

export function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
