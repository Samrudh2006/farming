/**
 * Public passport page — shareable link (no auth required).
 */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PassportCard } from "@/components/passport/passport-card";
import { SkeletonPassport } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePublicPassport } from "@/hooks/use-queries";
import { pageTransition } from "@/lib/animations";

export default function PublicPassportPage({ params }: { params: { id: string } }) {
  const { data: passport, isLoading, error } = usePublicPassport(params.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
              IS
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ISIN Skill Passport
            </span>
          </Link>
          <Link href="/register">
            <Button size="sm">Create Your Own</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12">
        <motion.div {...pageTransition}>
          {isLoading ? (
            <SkeletonPassport />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Passport not found or has been made private.</p>
            </div>
          ) : passport ? (
            <PassportCard passport={passport} />
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}
