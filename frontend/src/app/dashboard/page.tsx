/**
 * Dashboard page — main hub after login.
 */
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SkeletonCard } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem, slideUp } from "@/lib/animations";
import Link from "next/link";

export default function DashboardPage() {
  // TODO: Replace with real data fetching via React Query
  const isLoading = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <motion.div {...slideUp}>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">Welcome back! Here&apos;s your progress overview.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" {...staggerContainer}>
            {/* Quick Stats */}
            <motion.div {...staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Tasks Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete tasks to build your passport</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ScoreRing score={0} label="Score" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Trust Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressBar value={0} label="Trust" />
                  <p className="text-xs text-muted-foreground mt-2">Complete tasks honestly to build trust</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div className="mt-8 flex gap-4" {...slideUp}>
          <Link href="/tasks">
            <Button>Browse Tasks</Button>
          </Link>
          <Link href="/passport">
            <Button variant="secondary">View Passport</Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
