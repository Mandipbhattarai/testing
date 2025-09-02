"use client"

import type React from "react"

import { useState } from "react"

const MODE = process.env.SECURITY_MODE || "vulnerable"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess("Registration successful. You can now login.")
    } else {
      setError(data.message || "Registration failed")
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 text-2xl font-semibold">Register</h2>
      <form onSubmit={onSubmit} className="card space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="StrongPassword123!"
          />
        </div>
        <button className="btn w-full" type="submit">
          Create Account
        </button>
        {success && <div className="text-sm text-emerald-700">{success}</div>}
        {error &&
          (MODE === "vulnerable" ? (
            <div className="text-sm text-red-600" dangerouslySetInnerHTML={{ __html: error }} />
          ) : (
            <div className="text-sm text-red-600">{error}</div>
          ))}
      </form>
    </div>
  )
}
