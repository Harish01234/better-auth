"use client"

import { authClient } from "@/auth-client"
import { redirect } from "next/navigation"
import { useState } from "react"
import LogoutButton from "@/components/LogoutButton"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { data, isPending, error } = authClient.useSession()

    const router = useRouter()


  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  /* ---------------- Loading ---------------- */
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-500">
        Loading admin dashboard…
      </div>
    )
  }

  if (error) {
    return <div>Error loading session</div>
  }

  if (!data) {
    redirect("/signin")
  }

  const user = data.user as any

  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  /* ---------------- Fetch Users ---------------- */
  async function handleManageUsers() {
    setActiveSection("users")
    setLoadingUsers(true)

    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error("Failed to fetch users")
    } finally {
      setLoadingUsers(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              System administration & user management
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Admin Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <InfoCard label="Name" value={user.name} />
          <InfoCard label="Email" value={user.email} />
          <InfoCard label="Role" value={user.role} highlight />
        </div>

        {/* Admin Actions */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Admin Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <AdminButton
              label="Manage Users"
              onClick={handleManageUsers}
            />
            <AdminButton label="View Sessions" />
            <AdminButton label="System Settings" />
             <AdminButton label="create forms"  onClick={() => router.push("/admin/forms")} />
                           <AdminButton label="form submissions"  onClick={() => router.push("/admin/submissions")} />


          </div>
        </div>

        {/* USERS SECTION */}
        {activeSection === "users" && (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              All Registered Users
            </h2>

            {loadingUsers ? (
              <p className="text-gray-500">Loading users...</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Verified</th>
                      <th className="px-6 py-3 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.emailVerified ? (
                            <span className="text-green-600 font-medium">
                              ✔ Verified
                            </span>
                          ) : (
                            <span className="text-red-500 font-medium">
                              ✘ Not Verified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
    <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-semibold ${
          highlight ? "text-indigo-600" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function AdminButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
    >
      {label}
    </button>
  )
}
