"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={props.position ?? "top-right"}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          success:
            "bg-purple-500 text-white border border-purple-600 shadow-md",
          error: "bg-red-500 text-white border border-red-600 shadow-md",
        },
      }}
      style={
        {
          "--normal-bg": "rgb(255 255 255)",
          "--normal-text": "rgb(38 38 38)",
          "--normal-border": "rgb(229 231 235)",
          "--border-radius": "0.375rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
