"use client"

import { authClient } from "@/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SigninPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // 📧 Email + Password Sign-in
  const handleEmailSignin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        setError(error.message || "Invalid email or password")
        setLoading(false)
        return
      }

      router.replace("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 🐙 GitHub OAuth Sign-in
  const handleGithubSignin = async () => {
    setLoading(true)
    setError(null)

    try {
      // ⚠️ DO NOT use router here
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard", // ✅ IMPORTANT
      })
    } catch {
      setError("GitHub sign-in failed")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Email Sign-in */}
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
            onClick={handleEmailSignin}
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* GitHub Sign-in */}
        <button
          onClick={handleGithubSignin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 008 11c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.7-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6a11.5 11.5 0 008-11C23.5 5.7 18.3.5 12 .5z" />
          </svg>
          Continue with GitHub
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
