"use client"

import { ReactNode } from "react"

interface SettingsPageHeaderProps {
  icon: ReactNode
  title: string
  description?: string
}

export function SettingsPageHeader({
  icon,
  title,
  description,
}: SettingsPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#E4D6B3] px-5 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
    </div>
  )
}
