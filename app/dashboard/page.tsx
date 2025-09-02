import { cookies } from "next/headers"
import { decodeSession } from "../../lib/auth"
import { listEvents } from "../../lib/db"

export default function Dashboard() {
  const session = decodeSession(cookies().get("session")?.value)
  const events = listEvents()

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-1 text-xl font-semibold">Welcome</h2>
        <p className="text-gray-600">Signed in as {session?.email}</p>
      </div>

      <div className="card">
        <h3 className="mb-2 text-lg font-semibold">Upcoming Events</h3>
        <ul className="space-y-2">
          {events.map((ev) => (
            <li key={ev.id} className="rounded border p-3">
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-600">
                {ev.date} • {ev.location}
              </div>
              <p className="mt-1 text-sm text-gray-700">{ev.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
