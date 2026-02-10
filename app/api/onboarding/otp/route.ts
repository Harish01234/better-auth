import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    await auth.api.requestPasswordResetEmailOTP({
      body: { email }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("OTP error:", error)
    return NextResponse.json(
      { error: error?.message ?? "Failed to send OTP" },
      { status: 400 }
    )
  }
}
