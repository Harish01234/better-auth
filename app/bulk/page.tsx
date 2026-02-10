"use client"

import { useState } from "react"
import Papa from "papaparse"

type CsvUser = {
  email: string
  name: string
}

export default function BulkEnrollmentPage() {
  const [users, setUsers] = useState<CsvUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleFileUpload(file: File) {
    setError(null)
    setSuccess(null)

    Papa.parse<CsvUser>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data.filter(
          (u) => u.email && u.name
        )

        if (parsed.length === 0) {
          setError("No valid rows found in CSV")
          return
        }

        setUsers(parsed)
      },
      error: () => {
        setError("Failed to parse CSV file")
      }
    })
  }

  async function handleEnroll() {
    if (users.length === 0) {
      setError("No users to enroll")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const res = await fetch("/api/bulk-enro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Bulk enrollment failed")
        setLoading(false)
        return
      }

      setSuccess(`Invited ${data.invited} users successfully`)
      setUsers([])
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bulk User Enrollment
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Upload a CSV file to invite users and let them set their passwords.
        </p>

        {/* Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Upload CSV
          </label>

          <input
            type="file"
            accept=".csv"
            className="mt-2"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />
        </div>

        {/* Preview Table */}
        {users.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              Preview ({users.length} users)
            </h2>

            <div className="max-h-64 overflow-auto rounded border">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2">{u.email}</td>
                      <td className="border px-3 py-2">{u.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {success && (
          <p className="mt-4 text-sm text-green-600">{success}</p>
        )}

        {/* Action */}
        <div className="mt-6">
          <button
            onClick={handleEnroll}
            disabled={loading || users.length === 0}
            className="rounded bg-black px-6 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Enrolling…" : "Enroll Users"}
          </button>
        </div>
      </div>
    </div>
  )
}
