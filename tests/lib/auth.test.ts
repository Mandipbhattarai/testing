import { authenticate, getSecurityMode } from "../../lib/auth"
import { getDb } from "../../lib/db"
import bcrypt from "bcryptjs"

describe("auth.authenticate", () => {
  const adminEmail = "admin@example.com"
  const adminPass = "Admin123!"
  const userEmail = "user@example.com"
  const userPass = "User123!"

  beforeAll(async () => {
    const db = getDb()
    const count = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any).c as number
    if (count === 0) {
      const i = db.prepare("INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)")
      i.run(adminEmail, await bcrypt.hash(adminPass, 10), "admin")
      i.run(userEmail, await bcrypt.hash(userPass, 10), "user")
    }
  })

  it("secure mode: valid/invalid credentials", async () => {
    process.env.SECURITY_MODE = "secure"
    expect(getSecurityMode()).toBe("secure")

    const ok = await authenticate(adminEmail, adminPass)
    expect(ok.ok).toBe(true)

    const bad = await authenticate(adminEmail, "wrong")
    expect(bad.ok).toBe(false)
  })

  it("vulnerable mode: SQLi may bypass", async () => {
    process.env.SECURITY_MODE = "vulnerable"
    const inj = await authenticate(`' OR '1'='1 --`, "anything")
    // Depending on DB content, SQLi should bypass and return some user
    expect(inj.ok).toBe(true)
  })
})
