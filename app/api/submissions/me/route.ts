import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: Request) {
  const session = await auth.api.getSession(req)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const submission = await prisma.submission.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        form: {
          select: {
            id: true,
            title: true,
            version: true,
            description: true
          }
        },
        answers: {
          include: {
            field: {
              select: {
                label: true,
                type: true
              }
            }
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: "No submission found" }, { status: 404 })
    }

    return NextResponse.json(submission)

  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
