"use client"

type EmailPasswordFormProps = {
  disabled: boolean
}

export default function EmailPasswordForm({
  disabled,
}: EmailPasswordFormProps) {
  const handleRegister = () => {
    // you will implement later
  }

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <button
        onClick={handleRegister}
        disabled={disabled}
        className="w-full rounded-md bg-black py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Create account
      </button>
    </div>
  )
}
