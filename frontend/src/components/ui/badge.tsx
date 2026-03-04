/**
 * Badge component for skill levels, trust indicators, etc.
 */
import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-default",
  {
    variants: {
      variant: {
        default: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
        success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        danger: "bg-red-500/20 text-red-300 border border-red-500/30",
        purple: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
        pink: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
        outline: "bg-transparent text-foreground border border-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
