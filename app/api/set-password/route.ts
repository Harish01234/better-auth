import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const { email, otp, password } = await req.json()

  if (!email || !otp || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    )
  }

  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email,
        otp,
        password
      }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Reset password error:", err)
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 400 }
    )
  }
}
