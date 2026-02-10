"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function OnboardingPage() {
  const params = useSearchParams()
  const email = params.get("email") ?? ""

  const [step, setStep] = useState<"idle" | "otp" | "done">("idle")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendOTP() {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/onboarding/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setStep("otp")
  }

  async function setPasswordHandler() {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/onboarding/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setStep("done")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome 👋
          </h1>
          <p className="text-sm text-gray-500">
            Complete your account setup
          </p>
        </div>

        {/* Email badge */}
        <div className="flex justify-center">
          <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
            {email}
          </span>
        </div>

        {/* STEP 1 */}
        {step === "idle" && (
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 font-medium hover:opacity-90 transition"
          >
            {loading ? "Sending OTP..." : "Send Verification Code"}
          </button>
        )}

        {/* STEP 2 */}
        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                One-Time Password
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={setPasswordHandler}
              disabled={loading}
              className="w-full rounded-lg bg-green-600 text-white py-2 font-medium hover:bg-green-700 transition"
            >
              {loading ? "Setting Password..." : "Activate Account"}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === "done" && (
          <div className="text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <p className="text-green-600 font-semibold">
              Your account is ready!
            </p>
            <p className="text-sm text-gray-500">
              You can now log in using your email and password.
            </p>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
