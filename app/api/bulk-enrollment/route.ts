import { NextResponse } from "next/server"
import { auth } from "@/auth"

type InputUser = {
  email: string
  password: string
  name: string
}

export async function POST(req: Request) {
  try {
    const { users }: { users: InputUser[] } = await req.json()

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "Users array is required" },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as { email: string; reason: string }[]
    }

    for (const user of users) {
      try {
        await auth.api.signUpEmail({
          asResponse: true, // 🔥 REQUIRED
          body: {
            email: user.email.toLowerCase().trim(),
            password: user.password,
            name: user.name.trim(),
            role: "USER" // 🔥 REQUIRED
          }
        })

        results.success++
      } catch (err: any) {
        results.failed++
        results.errors.push({
          email: user.email,
          reason: err?.message ?? "Unknown error"
        })
      }
    }

    return NextResponse.json({
      success: true,
      summary: results
    })
  } catch (error) {
    console.error("❌ BULK ENROLL ERROR", error)
    return NextResponse.json(
      { error: "Bulk enrollment failed" },
      { status: 500 }
    )
  }
}
