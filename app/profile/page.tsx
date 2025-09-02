import { cookies } from "next/headers"
import { decodeSession } from "../../lib/auth"

export default function ProfilePage() {
  const session = decodeSession(cookies().get("session")?.value)
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Your Profile</h2>
      <div className="card">
        <div className="text-sm text-gray-600">Email</div>
        <div className="font-medium">{session?.email}</div>
      </div>
      <form action="/api/logout" method="post">
        <button className="btn">Logout</button>
      </form>
    </div>
  )
}
