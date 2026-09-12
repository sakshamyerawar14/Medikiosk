import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F172A] text-white hover:bg-[#1E293B] active:scale-[0.99] focus-visible:ring-[#0F172A] shadow-sm",
        secondary:
          "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-[0.99] focus-visible:ring-[#0F172A]",
        sage:
          "bg-[#059669] text-white hover:bg-[#047857] active:scale-[0.99] focus-visible:ring-[#059669] shadow-sm",
        outline:
          "border border-[#0F172A] text-[#0F172A] bg-transparent hover:bg-[#F1F5F9] focus-visible:ring-[#0F172A]",
        ghost:
          "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626] focus-visible:ring-[#EF4444] shadow-sm",
        kiosk:
          "bg-[#0F172A] text-white hover:bg-[#1E293B] active:scale-[0.98] text-lg font-semibold h-14 px-8 rounded-xl shadow-md min-h-[56px]",
        kioskSecondary:
          "bg-white border-2 border-[#CBD5E1] text-[#0F172A] hover:border-[#0F172A] hover:bg-[#F8FAFC] active:scale-[0.98] text-lg font-semibold h-14 px-8 rounded-xl min-h-[56px]",
        kioskSage:
          "bg-[#059669] text-white hover:bg-[#047857] active:scale-[0.98] text-lg font-semibold h-14 px-8 rounded-xl shadow-md min-h-[56px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base font-semibold",
        xl: "h-14 rounded-xl px-8 text-lg font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
