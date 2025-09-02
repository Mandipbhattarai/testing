import { revalidatePath } from "next/cache"
import { getSecurityMode } from "../../lib/auth"
import { createEvent } from "../../lib/db"
import { sanitizeInput } from "../../lib/sanitize"

async function createAction(formData: FormData) {
  "use server"
  const title = String(formData.get("title") || "")
  const date = String(formData.get("date") || "")
  const location = String(formData.get("location") || "")
  const description = String(formData.get("description") || "")

  if (getSecurityMode() === "secure") {
    for (const v of [title, date, location, description]) {
      const s = sanitizeInput(v)
      if (!s.ok) throw new Error("Unsafe input detected")
    }
  }
  createEvent(title, date, location, description)
  revalidatePath("/admin")
}

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-4 text-2xl font-semibold">Create Event</h2>
      <form action={createAction} className="card space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" name="title" required />
        </div>
        <div>
          <label className="label">Date</label>
          <input className="input" name="date" placeholder="2025-12-31" required />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" name="location" required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" name="description" rows={4} required />
        </div>
        <button className="btn w-full" type="submit">
          Create
        </button>
      </form>
    </div>
  )
}
