"use client"

import { useEffect, useState } from "react"

export default function Submissions() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then(res => res.json())
      .then(data => {
        setSubmissions(data)
        setLoading(false)
      })
  }, [])

  const exportCSV = () => {
    if (!submissions.length) return

    const headers = [
      "User Email",
      "User ID",
      "Form Name",
      "Submitted At"
    ]

    const rows = submissions.map((submission) => [
      submission.user.email,
      submission.user.id,
      submission.form.title,
      new Date(submission.submittedAt).toLocaleString()
    ])

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(item => `"${item}"`).join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "submissions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading submissions...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-10">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            📊 All Submissions
          </h1>

          <button
            onClick={exportCSV}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
          >
            ⬇ Export CSV
          </button>
        </div>

        {submissions.length === 0 ? (
          <p className="text-gray-500">No submissions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left text-sm text-gray-600 uppercase tracking-wide">
                  <th className="p-4">User Email</th>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Form Name</th>
                  <th className="p-4">Submitted At</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-4 text-gray-800 font-medium">
                      {submission.user.email}
                    </td>

                    <td className="p-4 text-gray-500 text-sm font-mono">
                      {submission.user.id}
                    </td>

                    <td className="p-4 text-gray-700">
                      {submission.form.title}
                    </td>

                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
