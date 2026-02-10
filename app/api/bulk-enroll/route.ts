import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type InputUser = {
  email: string
  name: string
}

export async function POST(req: Request) {
  try {
    const { users }: { users: InputUser[] } = await req.json()

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "Users required" }, { status: 400 })
    }

    const normalized = users.map((u) => ({
      email: u.email.toLowerCase().trim(),
      name: u.name.trim(),
      role: "USER",
      emailVerified: false
    }))

    // 1️⃣ Bulk create users (FAST)
    await prisma.user.createMany({
      data: normalized,
      skipDuplicates: true
    })

    // 2️⃣ Send OTP for password setup (OFFICIAL WAY)
    for (const user of normalized) {
      await auth.api.requestPasswordResetEmailOTP({
        body: { email: user.email }
      })
    }

    return NextResponse.json({
      success: true,
      invited: normalized.length
    })
  } catch (err) {
    console.error("Bulk enroll error:", err)
    return NextResponse.json(
      { error: "Bulk enrollment failed" },
      { status: 500 }
    )
  }
}
