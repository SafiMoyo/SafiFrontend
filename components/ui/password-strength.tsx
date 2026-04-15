export const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "A letter (a–z or A–Z)", test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "A number (0–9)", test: (p: string) => /[0-9]/.test(p) },
]

export function PasswordStrength({ password }: { password: string }) {
  const isStrong = passwordRules.every((r) => r.test(password))

  return (
    <div className="mt-1.5 space-y-1">
      {passwordRules.map((rule) => {
        const ok = rule.test(password)
        return (
          <p
            key={rule.label}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              ok ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span
              className={`inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border ${
                ok ? "border-green-500 bg-green-500 text-white" : "border-gray-300"
              }`}
            >
              {ok && (
                <svg viewBox="0 0 10 10" className="size-2.5" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {rule.label}
          </p>
        )
      })}
      {isStrong && (
        <p className="mt-1 text-xs font-semibold text-green-600">
          Password is strong
        </p>
      )}
    </div>
  )
}
