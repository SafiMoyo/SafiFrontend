import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-100",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "text-gray-900 hover:bg-gray-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    href?: string
    loading?: boolean
    target?: React.HTMLAttributeAnchorTarget
  }

function Button({
  className,
  variant,
  size,
  asChild,
  href,
  loading,
  target,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button"

  // LINK CASE
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {props.children}
      </a>
    )
  }

  // BUTTON CASE
  return (
    <Component
      className={cn(
        buttonVariants({ variant, size }),
        className,
        loading && "scale-[0.98]"
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {props.children}
      {loading && <Loader className="animate-spin" size={15} />}
    </Component>
  )
}

export { Button, buttonVariants }
