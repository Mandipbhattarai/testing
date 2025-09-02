import path from "path"
import Database from "better-sqlite3"

export type Role = "admin" | "user"
export type User = { id: number; email: string; passwordHash: string; role: Role }
export type Event = { id: number; title: string; date: string; location: string; description: string }

let _db: Database.Database | null = null

function dbPath() {
  return path.join(process.cwd(), "data", "ems.db")
}

export function getDb() {
  if (!_db) {
    _db = new Database(dbPath())
    _db.pragma("journal_mode = WAL")
    ensureTables()
  }
  return _db
}

function ensureTables() {
  const db = _db!
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `)
}

export function createUser(email: string, passwordHash: string, role: Role = "user") {
  const db = getDb()
  const stmt = db.prepare("INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)")
  const info = stmt.run(email, passwordHash, role)
  return info.lastInsertRowid as number
}

export function findUserByEmailSecure(email: string): User | null {
  const db = getDb()
  const stmt = db.prepare<User>("SELECT * FROM users WHERE email = ? LIMIT 1")
  const row = stmt.get(email) as User | undefined
  return row || null
}

// Vulnerable function: intentionally uses string-concatenated SQL with raw inputs (for demo)
// Note: Compares the provided password "as-is" (not hashed) against the stored passwordHash.
// SQLi payloads with comments (e.g., ' OR '1'='1 --) will bypass the password check.
export function findUserByEmailVulnerable(email: string, password: string): User | null {
  const db = getDb()
  const query = `SELECT * FROM users WHERE email = '${email}' AND passwordHash='${password}' LIMIT 1;`
  try {
    const row = db.prepare(query).get() as User | undefined
    return row || null
  } catch (e) {
    // If malformed query due to SQLi, try a fallback that often returns rows (still intentionally unsafe)
    try {
      const fallback = `SELECT * FROM users WHERE email = '${email}' LIMIT 1;`
      const row = db.prepare(fallback).get() as User | undefined
      return row || null
    } catch {
      return null
    }
  }
}

export function listEvents(): Event[] {
  const db = getDb()
  const stmt = db.prepare<Event>("SELECT * FROM events ORDER BY date ASC")
  return stmt.all() as Event[]
}

export function createEvent(title: string, date: string, location: string, description: string) {
  const db = getDb()
  const stmt = db.prepare("INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)")
  const info = stmt.run(title, date, location, description)
  return info.lastInsertRowid as number
}
