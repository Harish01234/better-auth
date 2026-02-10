import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendInviteEmail({
  email,
  link
}: {
  email: string
  link: string
}) {
  await transporter.sendMail({
    from: `"SkilledGELMS" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Set your password",
    html: `
      <p>Hello,</p>
      <p>Your account has been created.</p>
      <p>Click below to set your password:</p>
      <p><a href="${link}">Set Password</a></p>
      <p>This link expires in 24 hours.</p>
    `
  })
}
