import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx support.
 * Usage: cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a score as a display string with optional suffix.
 */
export function formatScore(score: number, suffix = "/100"): string {
  return `${Math.round(score)}${suffix}`;
}

/**
 * Get the trust level label and color from a trust score.
 */
export function getTrustLevel(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 80)
    return { label: "Verified", color: "text-emerald-600", bgColor: "bg-emerald-50" };
  if (score >= 50)
    return { label: "Review", color: "text-amber-600", bgColor: "bg-amber-50" };
  return { label: "Flagged", color: "text-red-600", bgColor: "bg-red-50" };
}

/**
 * Get the skill level badge info from a skill score.
 */
export function getSkillLevel(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 90)
    return { label: "Expert", color: "text-purple-600", bgColor: "bg-gradient-to-r from-purple-600 to-pink-500" };
  if (score >= 75)
    return { label: "Advanced", color: "text-indigo-600", bgColor: "bg-indigo-600" };
  if (score >= 60)
    return { label: "Intermediate", color: "text-sky-600", bgColor: "bg-sky-500" };
  if (score >= 40)
    return { label: "Developing", color: "text-amber-600", bgColor: "bg-amber-500" };
  return { label: "Beginner", color: "text-slate-500", bgColor: "bg-slate-400" };
}

/**
 * Format a date for display.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Generate a passport ID format.
 */
export function formatPassportId(id: string): string {
  return `ISIN-${new Date().getFullYear()}-${id.slice(0, 4).toUpperCase()}`;
}

/**
 * Truncate text to a max length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
