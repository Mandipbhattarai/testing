import { listEvents } from "../../lib/db"

export default function EventsPage() {
  const events = listEvents()
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Events</h2>
      <ul className="space-y-3">
        {events.map((ev) => (
          <li key={ev.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium">{ev.title}</div>
                <div className="text-sm text-gray-600">
                  {ev.date} • {ev.location}
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{ev.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
