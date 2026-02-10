// app/api/bulk-enroll/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendInviteEmail } from "@/lib/mailer" // your mail util

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

    // 1️⃣ Insert users FAST
    await prisma.user.createMany({
      data: normalized,
      skipDuplicates: true
    })

    // 2️⃣ Send onboarding link
    await Promise.all(
      normalized.map((user) =>
        sendInviteEmail({ email: user.email, link:process.env.APP_URL+"/onboarding?email="+user.email })
      )
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Bulk enrollment failed" },
      { status: 500 }
    )
  }
}
