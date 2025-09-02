import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Event Management System",
  description: "EMS with dual security modes (vulnerable vs secure)",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <a href="/" className="text-xl font-semibold text-emerald-700">
              EMS
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/events">Events</a>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
              <a href="/admin-login">Admin</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="mt-16 border-t bg-white">
          <div className="container py-4 text-sm text-gray-500">
            SECURITY_MODE: <strong>{process.env.SECURITY_MODE || "vulnerable"}</strong>
          </div>
        </footer>
      </body>
    </html>
  )
}
