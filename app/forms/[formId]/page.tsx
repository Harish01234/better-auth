"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Field = {
  id: string
  label: string
  type: string
  required: boolean
  options?: any
}

type FieldHeader = {
  id: string
  title: string
  fields: Field[]
}

type Form = {
  id: string
  title: string
  description?: string
  fieldHeaders: FieldHeader[]
}

export default function SingleFormPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.formId as string

  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      const res = await fetch(`/api/forms/${formId}`)
      const data = await res.json()
      setForm(data)
      setLoading(false)
    }

    if (formId) fetchForm()
  }, [formId])

  const handleChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async () => {
    if (!form) return

    // Basic required validation
    for (const section of form.fieldHeaders) {
      for (const field of section.fields) {
        if (field.required && !answers[field.id]) {
          alert(`${field.label} is required`)
          return
        }
      }
    }

    setSubmitting(true)

    console.log("🚀 FORM SUBMIT PAYLOAD :" ,answers)

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          formId,
          answers
        })
      })

      if (!res.ok) throw new Error()

      alert("Form submitted successfully 🎉")
      router.push("/forms")

    } catch {
      alert("You may have already submitted this form.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        Loading form...
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-10">

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {form.title}
        </h1>

        <p className="text-slate-500 mb-8">
          {form.description}
        </p>

        {form.fieldHeaders.map(section => (
          <div key={section.id} className="mb-10">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">
              {section.title}
            </h2>

            <div className="space-y-6">
              {section.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {field.type === "TEXT" && (
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      onChange={(e) =>
                        handleChange(field.id, e.target.value)
                      }
                    />
                  )}

                  {field.type === "NUMBER" && (
                    <input
                      type="number"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      onChange={(e) =>
                        handleChange(field.id, e.target.value)
                      }
                    />
                  )}

                  {field.type === "TEXTAREA" && (
                    <textarea
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={4}
                      onChange={(e) =>
                        handleChange(field.id, e.target.value)
                      }
                    />
                  )}

                  {field.type === "BOOLEAN" && (
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleChange(field.id, e.target.checked)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          {submitting ? "Submitting..." : "Submit Form"}
        </button>

      </div>
    </div>
  )
}
