"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Form = {
  id: string
  title: string
  description?: string
  createdAt: string
}

export default function FormsPage() {
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/forms")
        const data = await res.json()
        setForms(data)
      } catch {
        console.error("Failed to fetch forms")
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500 text-lg">Loading forms...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Available Forms
        </h1>

        {forms.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-slate-500">
            No forms available.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-slate-200 cursor-pointer"
              onClick={() => router.push(`/forms/${form.id}`)}
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                {form.title}
              </h2>

              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                {form.description || "No description provided"}
              </p>

              <div className="text-xs text-slate-400">
                Created: {new Date(form.createdAt).toLocaleDateString()}
              </div>

              <div className="mt-4 text-indigo-600 font-medium text-sm">
                View Form →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
