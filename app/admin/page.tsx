import { cookies } from "next/headers"
import { decodeSession } from "../../lib/auth"
import { listEvents } from "../../lib/db"

export default function AdminPage() {
  const session = decodeSession(cookies().get("session")?.value)
  const events = listEvents()
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-1 text-xl font-semibold">Admin Dashboard</h2>
        <p className="text-gray-600">
          Signed in as {session?.email} (role: {session?.role})
        </p>
      </div>
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Events</h3>
          <a className="btn" href="/create-event">
            Create Event
          </a>
        </div>
        <ul className="space-y-2">
          {events.map((ev) => (
            <li key={ev.id} className="rounded border p-3">
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-600">
                {ev.date} • {ev.location}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
