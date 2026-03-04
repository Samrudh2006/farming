/**
 * Tasks listing page.
 */
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TaskCard } from "@/components/task/task-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, staggerItem, slideUp } from "@/lib/animations";
import type { Task } from "@/types";

// TODO: Replace with React Query data fetching
const MOCK_TASKS: Task[] = [];

const FILTERS = ["All", "Easy", "Medium", "Hard"];
const TYPES = ["All", "API", "Data Processing", "Debugging", "Algorithm", "Code Review"];

export default function TasksPage() {
  const isLoading = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <motion.div {...slideUp}>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground mb-6">Complete real-world coding challenges to build your skill profile.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <Badge key={f} variant={f === "All" ? "default" : "outline"} className="cursor-pointer">
                {f}
              </Badge>
            ))}
          </div>
          <div className="w-px bg-white/10 mx-2" />
          <div className="flex gap-1 flex-wrap">
            {TYPES.map((t) => (
              <Badge key={t} variant={t === "All" ? "purple" : "outline"} className="cursor-pointer">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : MOCK_TASKS.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No tasks available yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" {...staggerContainer}>
            {MOCK_TASKS.map((task) => (
              <motion.div key={task.id} {...staggerItem}>
                <TaskCard task={task} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
