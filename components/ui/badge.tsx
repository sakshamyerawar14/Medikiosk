import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0F172A] text-white",
        secondary:
          "border-transparent bg-[#F1F5F9] text-[#0F172A]",
        success:
          "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]",
        warning:
          "border-[#FDE68A] bg-[#FEFCE8] text-[#B45309]",
        destructive:
          "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
        info:
          "border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]",
        outline:
          "text-[#0F172A] border-[#E2E8F0]",
        ai:
          "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9] font-medium gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
