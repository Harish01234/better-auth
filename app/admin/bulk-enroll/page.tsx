"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"

type UserRow = {
  email: string
  name: string
  password: string
  valid: boolean
}

export default function BulkEnrollPage() {
  // 🔒 Hydration guard
  const [mounted, setMounted] = useState(false)

  // UI state
  const [users, setUsers] = useState<UserRow[]>([])
  const [fileName, setFileName] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // ✅ FIXES HYDRATION ERROR

  // utils
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // CSV handler
  const handleFileUpload = (file: File) => {
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<any>) => {
        const rows = result.data as any[]

        const parsed: UserRow[] = rows.map((row) => {
          const email = (row.email || "").trim().toLowerCase()
          const name = (row.name || "").trim()
          const password = (row.password || "").trim()

          return {
            email,
            name,
            password,
            valid: Boolean(
              email &&
              name &&
              password &&
              isValidEmail(email)
            )
          }
        })

        setUsers(parsed)
      }
    })
  }

  // stats
  const total = users.length
  const validCount = users.filter(u => u.valid).length
  const invalidCount = total - validCount

  // button action
  const handleBulkEnroll =async () => {
    const validUsers = users.filter(u => u.valid)
    console.log("🚀 BULK ENROLL PAYLOAD")
    console.table(validUsers)

    const res = await fetch("/api/bulk-enrollment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ users: validUsers })
  })

  const data = await res.json()
  console.log("SERVER RESPONSE:", data)

      
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Bulk Enrollment
          </h1>
          <p className="text-slate-600 mt-1">
            Upload a CSV file to enroll users in bulk
          </p>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6 border mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload CSV File
          </label>

          <input
            type="file"
            accept=".csv"
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:bg-slate-900 file:text-white
                       hover:file:bg-slate-700 cursor-pointer"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0])
              }
            }}
          />

          {fileName && (
            <p className="mt-2 text-xs text-slate-500">
              Uploaded: {fileName}
            </p>
          )}
        </div>

        {/* Stats */}
        {users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Stat label="Total Rows" value={total} />
            <Stat label="Valid Users" value={validCount} color="green" />
            <Stat label="Invalid Rows" value={invalidCount} color="red" />
          </div>
        )}

        {/* Table */}
        {users.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Password</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.password}</td>
                    <td className="px-4 py-3">
                      {u.valid ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Valid
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          Invalid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action */}
        {users.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleBulkEnroll}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg
                         hover:bg-slate-700 transition font-medium"
            >
              Bulk Enroll (Log Data)
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

/* Stat card */
function Stat({
  label,
  value,
  color = "slate"
}: {
  label: string
  value: number
  color?: "slate" | "green" | "red"
}) {
  const map = {
    slate: "text-slate-800",
    green: "text-green-600",
    red: "text-red-600"
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${map[color]}`}>
        {value}
      </p>
    </div>
  )
}
