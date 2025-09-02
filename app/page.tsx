import Link from "next/link"

export default function Page() {
  return (
    <section className="mx-auto max-w-xl text-center">
      <h1 className="mb-3 text-balance text-3xl font-semibold">Event Management System</h1>
      <p className="text-pretty text-gray-600">
        Manage events, register users, and explore intentional security differences between modes.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link className="btn" href="/events">
          Browse Events
        </Link>
        <Link className="btn" href="/login">
          User Login
        </Link>
        <Link className="btn" href="/admin-login">
          Admin Login
        </Link>
      </div>
    </section>
  )
}
