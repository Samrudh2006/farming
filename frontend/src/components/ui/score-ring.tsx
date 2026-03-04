/**
 * Circular score visualizer — used in Skill Passport.
 */
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { circleProgress } from "@/lib/animations";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}: ScoreRingProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Color based on score
  const getColor = () => {
    if (percentage >= 80) return "#10B981"; // emerald
    if (percentage >= 60) return "#6366F1"; // indigo
    if (percentage >= 40) return "#F59E0B"; // amber
    return "#EF4444"; // red
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        {/* Animated progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          {...circleProgress(percentage)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <motion.span
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {Math.round(score)}
        </motion.span>
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
}
