import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

/* =========================================
   GET SINGLE FORM
========================================= */

export async function GET(
  req: Request,
  context: { params: Promise<{ formId: string }> }
) {
  const { formId } = await context.params

  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fieldHeaders: {
          orderBy: { order: "asc" },
          include: {
            fields: {
              orderBy: { order: "asc" }
            }
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(form)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    )
  }
}


/* =========================================
   UPDATE FORM (ADMIN ONLY)
========================================= */

export async function PUT(
  req: Request,
  context: { params: Promise<{ formId: string }> }
) {
  const { formId } = await context.params
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
    await prisma.$transaction(async (tx) => {

      await tx.form.update({
        where: { id: formId },
        data: { title, description }
      })

      // delete old fields first
      await tx.field.deleteMany({
        where: {
          header: { formId }
        }
      })

      await tx.fieldHeader.deleteMany({
        where: { formId }
      })

      // recreate headers + fields
      for (const header of fieldHeaders) {
        const createdHeader = await tx.fieldHeader.create({
          data: {
            title: header.title,
            order: header.order,
            formId
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
    })

    return NextResponse.json({ message: "Form updated successfully" })

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    )
  }
}


/* =========================================
   DELETE FORM (ADMIN ONLY)
========================================= */

export async function DELETE(
  req: Request,
  context: { params: Promise<{ formId: string }> }
) {
  const { formId } = await context.params
  const session = await auth.api.getSession(req)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    await prisma.form.delete({
      where: { id: formId }
    })

    return NextResponse.json({ message: "Form deleted successfully" })

  } catch (error) {
    return NextResponse.json(
      { error: "Cannot delete form (maybe submissions exist)" },
      { status: 400 }
    )
  }
}
