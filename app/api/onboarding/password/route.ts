import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function PUT(req: Request) {
  try {
    const { email, otp, password } = await req.json()

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, OTP and password are required" },
        { status: 400 }
      )
    }

    await auth.api.resetPasswordEmailOTP({
      body: {
        email,
        otp,
        password
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Set password error:", error)
    return NextResponse.json(
      { error: error?.message ?? "Invalid or expired OTP" },
      { status: 400 }
    )
  }
}
