import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full min-w-0 border transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2",
  {
    variants: {
      variant: {
        default:
          "border-input bg-input/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-7 rounded-md px-2 py-0.5 text-sm file:h-6 file:text-xs/relaxed focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 md:text-xs/relaxed",
        auth: "h-12 rounded-xl border-purple-200 bg-purple-50 px-3 text-sm text-gray-900 placeholder:text-purple-300 focus-visible:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:border-purple-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>

function Input({ className, type, variant, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
