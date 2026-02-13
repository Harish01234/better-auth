"use client"

import { useEffect, useState } from "react"

export default function MySubmissionPage() {
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/submissions/me")
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setSubmission(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your submission...
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        You haven’t submitted any form yet.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* User Info Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            👤 User Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{submission.user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{submission.user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-mono text-xs text-gray-600">
                {submission.user.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-medium">
                {new Date(submission.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Form Info */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📝 Form Details
          </h2>

          <div className="space-y-2 text-gray-700">
            <p className="text-lg font-semibold">
              {submission.form.title}
            </p>

            {submission.form.description && (
              <p className="text-gray-600">
                {submission.form.description}
              </p>
            )}

            <p className="text-sm text-gray-500">
              Version: {submission.form.version}
            </p>

            <p className="text-sm text-gray-500">
              Submitted on:{" "}
              {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Answers Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📊 Your Answers
          </h2>

          <div className="space-y-6">
            {submission.answers.map((answer: any) => (
              <div
                key={answer.id}
                className="bg-slate-50 p-5 rounded-xl border border-gray-200"
              >
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {answer.field.label}
                </p>

                <div className="text-lg text-gray-800">
                  {renderValue(answer.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function renderValue(value: any) {
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "object" && value !== null)
    return JSON.stringify(value)
  return value?.toString() || "-"
}
