/**
 * My Passport page.
 */
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PassportCard } from "@/components/passport/passport-card";
import { SkeletonPassport } from "@/components/ui/skeleton";
import { slideUp } from "@/lib/animations";

export default function PassportPage() {
  // TODO: Fetch passport via React Query
  const isLoading = false;
  const passport = null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <motion.div {...slideUp}>
          <h1 className="text-3xl font-bold mb-2">My Skill Passport</h1>
          <p className="text-muted-foreground mb-8">Your verified skill profile built through real-world demonstrations.</p>
        </motion.div>

        {isLoading ? (
          <SkeletonPassport />
        ) : passport ? (
          <div className="max-w-lg mx-auto">
            <PassportCard passport={passport} />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-4 rounded-full bg-indigo-500/10 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Passport Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Complete your first task to start building your Skill Passport. 
              Each task you complete adds to your verified skill profile.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
