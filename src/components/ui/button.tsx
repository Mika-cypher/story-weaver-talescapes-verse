
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-heritage-ochre to-heritage-terracotta text-white hover:from-heritage-ochre/90 hover:to-heritage-terracotta/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-heritage-ochre/30 bg-background hover:bg-heritage-ochre/5 hover:border-heritage-ochre/50",
        secondary:
          "bg-gradient-to-r from-kente-gold/10 to-heritage-ochre/10 text-heritage-ochre hover:from-kente-gold/20 hover:to-heritage-ochre/20 border border-heritage-ochre/20",
        ghost: "hover:bg-heritage-ochre/10 hover:text-heritage-ochre",
        link: "text-heritage-ochre underline-offset-4 hover:underline",
        kente: "bg-gradient-to-r from-kente-gold to-kente-royal-blue text-white hover:from-kente-gold/90 hover:to-kente-royal-blue/90 shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
