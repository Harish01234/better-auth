"use client"

import { authClient } from "@/auth-client"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/LogoutButton"
import EmailVerificationGate from "@/components/EmailVerificationGate"


export default function DashboardPage() {
  const { data, isPending, error } = authClient.useSession()

  // 🔄 Loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading dashboard…
      </div>
    )
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-red-600">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || "Unable to load session"}
          </p>
        </div>
      </div>
    )
  }

  // 🔒 No session → redirect
  if (!data) {
    redirect("/signin")
  }

  const { user, session } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="h-14 w-14 rounded-full border object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
                {user.email?.[0]?.toUpperCase()}
              </div>
            )}

            {/* User Info */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {user.name || "User"}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* ✅ Your existing Logout button */}
          <LogoutButton />
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            title="User ID"
            value={user.id}
          />

          <InfoCard
            title="Email Verified"
            value={user.emailVerified ? "Yes" : "No"}
            highlight={user.emailVerified}
          />

          <InfoCard
            title="Login Provider"
            value={user.image ? "GitHub OAuth" : "Email & Password"}
          />

          <InfoCard
            title="Session ID"
            value={session.id}
          />

          <InfoCard
            title="Session Expires"
            value={new Date(session.expiresAt).toLocaleString()}
          />

          <InfoCard
            title="Session Status"
            value="Active"
            highlight
          />
        </div>

        {/* Email Verification Gate */}
        <EmailVerificationGate email={user.email} emailVerified={user.emailVerified} />
      </div>
    </div>
  )
}

/* Local helper for clean UI */
function InfoCard({
  title,
  value,
  highlight,
}: {
  title: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {title}
      </p>
      <p
        className={`mt-2 break-all text-sm font-semibold ${
          highlight ? "text-green-600" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
