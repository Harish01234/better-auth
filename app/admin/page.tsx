"use client"

import { authClient } from "@/auth-client"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/LogoutButton"

export default function AdminPage() {
  const { data, isPending, error } = authClient.useSession()

  /* ---------------- Loading ---------------- */
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-500">
        Loading admin dashboard…
      </div>
    )
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-red-600">
            Session Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || "Unable to load session"}
          </p>
        </div>
      </div>
    )
  }

  /* ---------------- Not logged in ---------------- */
  if (!data) {
    redirect("/signin")
  }

  // TEMP: bypass TS until typings are fixed
  const user = data.user as any

  /* ---------------- Not admin ---------------- */
  // @ts-ignore — role exists at runtime
  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  /* ---------------- Admin UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              System administration & user management
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Admin Info Card */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <InfoCard label="Name" value={user.name} />
          <InfoCard label="Email" value={user.email} />
          <InfoCard label="Role" value={user.role} highlight />

        </div>

        {/* Details */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Account Details
          </h2>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">User ID:</span>{" "}
              {user.id}
            </p>
            <p>
              <span className="font-medium text-gray-800">Email Verified:</span>{" "}
              {user.emailVerified ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Account Created:</span>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Admin Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <AdminButton label="Manage Users" />
            <AdminButton label="View Sessions" />
            <AdminButton label="System Settings" />
          </div>
        </div>

      </div>
    </div>
  )
}

/* ---------------- Reusable Components ---------------- */

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl bg-pink-50 p-6 shadow">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-semibold ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function AdminButton({ label }: { label: string }) {
  return (
    <button className="rounded-lg border border-gray-300 bg-red-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
      {label}
    </button>
  )
}
