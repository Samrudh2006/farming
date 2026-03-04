/**
 * Framer Motion animation presets for ISIN.
 * Import and spread into motion components.
 */

// ─── Page Transitions ─────────────────────────────────
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// ─── Card / Component Animations ──────────────────────
export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 12px 40px -12px rgba(79, 70, 229, 0.2)",
    transition: { duration: 0.2 },
  },
  whileTap: { scale: 0.98 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const slideLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

// ─── Stagger Containers ──────────────────────────────
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

// ─── Score Animations ────────────────────────────────
export const scoreReveal = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
};

export const progressFill = (value: number) => ({
  initial: { width: "0%" },
  animate: {
    width: `${value}%`,
    transition: { duration: 1, ease: "easeOut", delay: 0.5 },
  },
});

export const circleProgress = (percentage: number) => {
  const circumference = 2 * Math.PI * 52; // r=52
  const offset = circumference - (percentage / 100) * circumference;
  return {
    initial: { strokeDashoffset: circumference },
    animate: {
      strokeDashoffset: offset,
      transition: { duration: 1.5, ease: "easeOut", delay: 0.3 },
    },
  };
};

// ─── Notification / Toast ────────────────────────────
export const toastSlide = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 50, scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

// ─── Modal / Dialog ──────────────────────────────────
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

// ─── Skeleton Pulse ──────────────────────────────────
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

// ─── Floating / Idle Animations ──────────────────────
export const floatingNode = (delay: number = 0) => ({
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  },
});

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(79, 70, 229, 0.1)",
      "0 0 40px rgba(79, 70, 229, 0.25)",
      "0 0 20px rgba(79, 70, 229, 0.1)",
    ],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};
