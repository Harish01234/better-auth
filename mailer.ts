import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  NODE_ENV,
} = process.env;

// ---- Safety check at startup ----
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  throw new Error("❌ SMTP environment variables are missing");
}

// ---- Create transporter ----
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true only for 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // avoids cert issues on custom SMTP
  },
});

// ---- Verify SMTP connection (runs once) ----
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP server connected successfully");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err);
  }
})();

// ---- Reusable mail sender ----
export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    // ---- Dev mode: don't actually send ----
    // if (NODE_ENV === "development") {
    //   console.log("📧 DEV EMAIL");
    //   console.log("To:", to);
    //   console.log("Subject:", subject);
    //   console.log("Body:", text);
    //   return { success: true, dev: true };
    // }

    const info = await transporter.sendMail({
      from: `"SkilledGELMS" <${SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Email send failed:", {
      to,
      subject,
      error: error?.message,
    });

    throw new Error("EMAIL_SEND_FAILED");
  }
}
