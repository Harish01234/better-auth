"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Field = {
  label: string
  type: string
  required: boolean
}

type Section = {
  title: string
  fields: Field[]
}

export default function FormBuilderPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)

  /* ===============================
     Section & Field Handlers
  =============================== */

  const addSection = () => {
    setSections([
      ...sections,
      { title: "", fields: [] }
    ])
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const addField = (sectionIndex: number) => {
    const updated = [...sections]
    updated[sectionIndex].fields.push({
      label: "",
      type: "TEXT",
      required: false
    })
    setSections(updated)
  }

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    const updated = [...sections]
    updated[sectionIndex].fields =
      updated[sectionIndex].fields.filter((_, i) => i !== fieldIndex)
    setSections(updated)
  }

  /* ===============================
     Submit
  =============================== */

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Form title required")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          fieldHeaders: sections.map((section, sIndex) => ({
            title: section.title,
            order: sIndex + 1,
            fields: section.fields.map((field, fIndex) => ({
              ...field,
              order: fIndex + 1
            }))
          }))
        })
      })

      if (!res.ok) throw new Error()

      alert("Form created successfully 🎉")
      router.push("/admin")

    } catch {
      alert("Failed to create form")
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     UI
  =============================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 py-14 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-slate-200">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Create New Form
          </h1>
          <p className="text-slate-500 mt-2">
            Design a dynamic form with sections and fields.
          </p>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />

        {/* Description */}
        <textarea
          placeholder="Form Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-8 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8 p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) => {
                  const updated = [...sections]
                  updated[sectionIndex].title = e.target.value
                  setSections(updated)
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                onClick={() => removeSection(sectionIndex)}
                className="ml-4 text-red-500 hover:text-red-600 font-medium"
              >
                Remove
              </button>
            </div>

            {/* Fields */}
            {section.fields.map((field, fieldIndex) => (
              <div
                key={fieldIndex}
                className="flex gap-3 items-center mb-3"
              >
                <input
                  type="text"
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => {
                    const updated = [...sections]
                    updated[sectionIndex].fields[fieldIndex].label =
                      e.target.value
                    setSections(updated)
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <select
                  value={field.type}
                  onChange={(e) => {
                    const updated = [...sections]
                    updated[sectionIndex].fields[fieldIndex].type =
                      e.target.value
                    setSections(updated)
                  }}
                  className="px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="TEXT">Text</option>
                  <option value="TEXTAREA">Textarea</option>
                  <option value="NUMBER">Number</option>
                  <option value="BOOLEAN">Boolean</option>
                  <option value="DATE">Date</option>
                  <option value="SELECT">Select</option>
                  <option value="RADIO">Radio</option>
                  <option value="CHECKBOX">Checkbox</option>
                </select>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const updated = [...sections]
                      updated[sectionIndex].fields[fieldIndex].required =
                        e.target.checked
                      setSections(updated)
                    }}
                  />
                  Required
                </label>

                <button
                  onClick={() =>
                    removeField(sectionIndex, fieldIndex)
                  }
                  className="text-red-500 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={() => addField(sectionIndex)}
              className="mt-2 text-indigo-600 font-medium hover:text-indigo-700"
            >
              + Add Field
            </button>
          </div>
        ))}

        {/* Add Section */}
        <button
          onClick={addSection}
          className="mb-8 text-purple-600 font-semibold hover:text-purple-700"
        >
          + Add Section
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          {loading ? "Creating..." : "Create Form"}
        </button>

      </div>
    </div>
  )
}
