"use client"

import { authClient } from "@/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  // 📧 Email Signup
  const handleEmailSignup = async () => {
    setError(null)

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0],
      })

      if (error) {
        setError(error.message || "Unable to create account")
        return
      }

      // ✅ Signup success → go to dashboard
      router.replace("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 🐙 GitHub Signup (OAuth)
  const handleGithubSignup = async () => {
    setLoading(true)
    setError(null)

    try {
      // ⚠️ OAuth handles redirect automatically
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard", // ✅ IMPORTANT
      })
    } catch {
      setError("GitHub signup failed")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up using email or GitHub
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Email Signup */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={handleEmailSignup}
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* GitHub Signup */}
        <button
          onClick={handleGithubSignup}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 008 11c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.7-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6a11.5 11.5 0 008-11C23.5 5.7 18.3.5 12 .5z" />
          </svg>
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">
          By creating an account, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
