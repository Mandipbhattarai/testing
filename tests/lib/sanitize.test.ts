import { sanitizeInput } from "../../lib/sanitize"
import fs from "fs"
import path from "path"

describe("sanitizeInput", () => {
  it("accepts safe input", () => {
    const safe = ["user@example.com", "Hello World", "2025-01-01", "123 Main St"]
    for (const s of safe) {
      expect(sanitizeInput(s).ok).toBe(true)
    }
  })

  it("rejects SQLi payloads", () => {
    const p = path.join(process.cwd(), "tests", "payloads", "sqli.txt")
    const payloads = fs.readFileSync(p, "utf-8").split(/\r?\n/).filter(Boolean)
    for (const s of payloads) {
      expect(sanitizeInput(s).ok).toBe(false)
    }
  })

  it("rejects XSS payloads", () => {
    const p = path.join(process.cwd(), "tests", "payloads", "xss.txt")
    const payloads = fs.readFileSync(p, "utf-8").split(/\r?\n/).filter(Boolean)
    for (const s of payloads) {
      expect(sanitizeInput(s).ok).toBe(false)
    }
  })
})
