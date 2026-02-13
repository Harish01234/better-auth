import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession(req)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const { formId, answers } = body as {
      formId: string
      answers: Record<string, any>
    }

    if (!formId || !answers) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      )
    }

    // 🔥 Check if user already submitted
    const existing = await prisma.submission.findUnique({
      where: { userId: session.user.id }
    })

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a form." },
        { status: 400 }
      )
    }

    // 🔥 Create submission + answers in transaction
    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: {
          userId: session.user.id,
          formId
        }
      })

      await tx.submissionAnswer.createMany({
        data: Object.entries(answers).map(([fieldId, value]) => ({
          submissionId: submission.id,
          fieldId,
          value
        }))
      })

      return submission
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
