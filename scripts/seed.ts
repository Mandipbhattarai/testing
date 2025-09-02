import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"
import { getDb, createEvent } from "../lib/db"

async function main() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  const db = getDb()

  // Ensure admin/user exist
  const adminEmail = "admin@example.com"
  const userEmail = "user@example.com"
  const adminHash = await bcrypt.hash("Admin123!", 10)
  const userHash = await bcrypt.hash("User123!", 10)

  const uStmt = db.prepare("SELECT * FROM users WHERE email = ?")
  const iStmt = db.prepare("INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)")

  if (!uStmt.get(adminEmail)) {
    iStmt.run(adminEmail, adminHash, "admin")
  }
  if (!uStmt.get(userEmail)) {
    iStmt.run(userEmail, userHash, "user")
  }

  // Seed a couple events if table is empty
  const count = (db.prepare("SELECT COUNT(*) as c FROM events").get() as any).c as number
  if (count === 0) {
    createEvent("Tech Conference", "2026-01-20", "New York", "A conference about modern web and security.")
    createEvent("Community Meetup", "2026-02-10", "San Francisco", "Local meetup for developers.")
  }

  console.log("Seed complete.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
