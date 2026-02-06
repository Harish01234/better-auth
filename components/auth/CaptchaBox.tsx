"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

type CaptchaBoxProps = {
  onVerify: (token: string) => void
  onExpire: () => void
}

export default function CaptchaBox({
  onVerify,
  onExpire,
}: CaptchaBoxProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) {
      console.error("❌ Turnstile site key is missing")
      return
    }

    if (!ref.current) return

    const interval = setInterval(() => {
      // @ts-ignore
      if (window.turnstile) {
        // @ts-ignore
        window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onVerify,
          "expired-callback": onExpire,
        })
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [siteKey, onVerify, onExpire])

  if (!siteKey) {
    return (
      <div className="rounded-md border bg-red-50 py-3 text-center text-xs text-red-600">
        CAPTCHA configuration missing
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        ref={ref}
        className="flex justify-center rounded-md border bg-gray-50 py-3"
      />
    </>
  )
}
