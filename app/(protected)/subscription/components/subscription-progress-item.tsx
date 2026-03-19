export function SubscriptionProgressItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <li className="flex items-center gap-3 text-sm text-gray-700">
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded ${
          active ? "bg-primary" : "bg-gray-200"
        }`}
      >
        {icon}
      </span>
      {label}
    </li>
  )
}
