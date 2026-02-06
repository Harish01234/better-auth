"use client"

type GithubAuthButtonProps = {
  disabled: boolean
}

export default function GithubAuthButton({
  disabled,
}: GithubAuthButtonProps) {
  const handleGithubRegister = () => {
    // you will implement later
  }

  return (
    <button
      onClick={handleGithubRegister}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Continue with GitHub
    </button>
  )
}
