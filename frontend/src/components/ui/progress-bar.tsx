/**
 * Animated progress bar.
 */
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { progressFill } from "@/lib/animations";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && <span className="text-sm font-medium">{Math.round(value)}/{max}</span>}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: color || "linear-gradient(to right, #4F46E5, #7C3AED)",
          }}
          {...progressFill(percentage)}
        />
      </div>
    </div>
  );
}
