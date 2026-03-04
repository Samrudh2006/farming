/**
 * Task card for the task listing page.
 */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardHover } from "@/lib/animations";
import type { Task } from "@/types";

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

const TYPE_LABELS: Record<string, string> = {
  api: "API Design",
  data_processing: "Data Processing",
  debugging: "Debugging",
  algorithm: "Algorithm",
  code_review: "Code Review",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <motion.div {...cardHover}>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">{task.title}</CardTitle>
            <Badge variant={DIFFICULTY_VARIANT[task.difficulty] || "default"}>
              {task.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge variant="purple">{TYPE_LABELS[task.task_type] || task.task_type}</Badge>
            <Badge variant="outline">{task.time_limit_minutes} min</Badge>
            <Badge variant="outline">{task.language}</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/tasks/${task.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              Start Task
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
