// app/api/forms/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const session = await auth.api.getSession(req)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()

  const { title, description, fieldHeaders } = body

  try {
    const result = await prisma.$transaction(async (tx) => {
      const form = await tx.form.create({
        data: {
          title,
          description,
          createdById: session.user.id
        }
      })

      for (const header of fieldHeaders) {
        const createdHeader = await tx.fieldHeader.create({
          data: {
            title: header.title,
            order: header.order,
            formId: form.id
          }
        })

        for (const field of header.fields) {
          await tx.field.create({
            data: {
              label: field.label,
              type: field.type,
              required: field.required ?? false,
              order: field.order,
              placeholder: field.placeholder,
              options: field.options,
              headerId: createdHeader.id
            }
          })
        }
      }

      return form
    })

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}



export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      where: { isActive: true },
      include: {
        fieldHeaders: {
          orderBy: { order: "asc" },
          include: {
            fields: {
              orderBy: { order: "asc" }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(forms)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    )
  }
}
