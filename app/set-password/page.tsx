"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()

  // 🔹 Email from URL
  const emailFromURL = params.get("email") ?? ""

  const [email, setEmail] = useState(emailFromURL)
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setEmail(emailFromURL)
  }, [emailFromURL])

  async function handleSubmit() {
    setError(null)

    if (!email || !otp || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid OTP or email")
        setLoading(false)
        return
      }

      setSuccess(true)

      // redirect after success
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold text-gray-800">
          Set Your Password
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Enter the OTP sent to your email to complete setup.
        </p>

        <div className="mt-4 space-y-3">
          {/* Email (prefilled from URL) */}
          <input
            type="email"
            className="w-full rounded border px-3 py-2 bg-gray-100"
            value={email}
            disabled
          />

          {/* OTP */}
          <input
            placeholder="OTP (e.g. 165572)"
            className="w-full rounded border px-3 py-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {/* New password */}
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm password */}
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full rounded border px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        {success && (
          <p className="mt-3 text-sm text-green-600">
            Password set successfully. Redirecting…
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full rounded bg-black py-2 text-white disabled:opacity-60"
        >
          {loading ? "Setting password…" : "Set Password"}
        </button>
      </div>
    </div>
  )
}
