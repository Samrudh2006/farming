/**
 * Main navigation bar for ISIN.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tasks", href: "/tasks" },
  { label: "My Passport", href: "/passport" },
];

const RECRUITER_NAV = [
  { label: "Search", href: "/recruiter" },
  { label: "Saved", href: "/recruiter/saved" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = user?.role === "recruiter" ? RECRUITER_NAV : NAV_ITEMS;

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-default">
            IS
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            ISIN
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-default relative",
                  pathname === item.href
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Right section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.full_name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
