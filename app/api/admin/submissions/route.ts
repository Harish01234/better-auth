import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: Request) {
  const session = await auth.api.getSession(req)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const submissions = await prisma.submission.findMany({
      select: {
        id: true,
        submittedAt: true,
        user: {
          select: {
            id: true,
            email: true
          }
        },
        form: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        submittedAt: "desc"
      }
    })

    return NextResponse.json(submissions)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}
