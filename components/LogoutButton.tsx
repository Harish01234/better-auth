"use client"

import { authClient } from "@/auth-client"

export default function AuthButton() {
  const { data: session, isPending } = authClient.useSession()

  const handleLogout = async () => {
    try {
      await authClient.signOut()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const handleLogin = () => {
    // redirect to login page later
  }

  if (isPending) return null

  // 🔐 Logged in → show Logout
  if (session) {
    return (
      <button
        onClick={handleLogout}
        className="
          group
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-red-200
          bg-red-50
          px-5
          py-2
          text-sm
          font-semibold
          text-red-600
          transition
          hover:bg-red-100
          hover:text-red-700
          active:scale-[0.96]
          shadow-sm
        "
      >
        <svg
          className="h-4 w-4 transition group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    )
  }

  // 🚪 Not logged in → show Login
  return (
    <button
      onClick={handleLogin}
      className="
        inline-flex
        items-center
        rounded-full
        bg-indigo-600
        px-5
        py-2
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-indigo-700
        active:scale-[0.96]
        shadow-sm
      "
    >
      Login
    </button>
  )
}
