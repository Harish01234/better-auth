"use client"

import { useState } from "react"
import { authClient } from "@/auth-client"

type Props = {
  email: string
  emailVerified: boolean
}

export default function EmailVerificationGate({
  email,
  emailVerified,
}: Props) {
  const [step, setStep] = useState<"idle" | "sent">("idle")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (emailVerified) return null

  // 📤 Send OTP
  const sendOtp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })

    setLoading(false)

    if (error) {
      setError(error.message || "Failed to send OTP")
      return
    }

    setStep("sent")
  }

  // ✅ Verify OTP + Mark email verified
  const verifyOtp = async () => {
    setLoading(true)
    setError(null)

    // 1️⃣ Check OTP
    const check = await authClient.emailOtp.checkVerificationOtp({
      email,
      type: "email-verification",
      otp,
    })

    if (check.error) {
      setLoading(false)
      setError(check.error.message || "Invalid OTP")
      return
    }

    // 2️⃣ IMPORTANT: Mark email as verified
    const verify = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    })

    setLoading(false)

    if (verify.error) {
      setError(verify.error.message || "Failed to verify email")
      return
    }

    setSuccess("Email verified successfully")

    // 3️⃣ Refresh session properly
    window.location.reload()
  }

  return (
    <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-yellow-800">
        Email verification required
      </h2>

      <p className="mt-1 text-xs text-yellow-700">
        Your email is not verified. Please verify to secure your account.
      </p>

      {step === "idle" && (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="mt-4 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
        >
          {loading ? "Sending OTP…" : "Send OTP"}
        </button>
      )}

      {step === "sent" && (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <button
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            {loading ? "Verifying…" : "Verify OTP"}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      {success && <p className="mt-3 text-xs text-green-700">{success}</p>}
    </div>
  )
}
