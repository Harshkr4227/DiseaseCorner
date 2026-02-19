import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default: "bg-[#111111] text-[#F9F7F1] border-2 border-[#111111] hover:bg-[#333333] hover:border-[#333333] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
        secondary:
          "bg-transparent border-2 border-[#111111] text-[#111111] hover:bg-[#111111]/5",
        ghost: "hover:bg-[#111111]/5 text-[#111111]",
        link: "text-[#111111] underline-offset-4 hover:underline decoration-1",
        outline: "bg-transparent border border-[#111111]/20 text-[#111111] hover:bg-[#111111]/5 hover:border-[#111111]",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-md",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10 rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
