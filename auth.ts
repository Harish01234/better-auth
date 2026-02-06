import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { emailOTP } from "better-auth/plugins"
import { sendMail } from "./mailer";


export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        max:15

    }),
    emailAndPassword: { 
    enabled: true, 


    
  }, 
  socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  },  

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        let subject = "";
        let message = "";

        if (type === "sign-in") {
          subject = "Your login OTP";
          message = `Your login OTP is: ${otp}`;
        } else if (type === "email-verification") {
          subject = "Verify your email";
          message = `Your email verification OTP is: ${otp}`;
        } else {
          subject = "Reset your password";
          message = `Your password reset OTP is: ${otp}`;
        }

        await sendMail({
          to: email,
          subject,
          text: message,
        });
      },
    }),
  ],
    
})