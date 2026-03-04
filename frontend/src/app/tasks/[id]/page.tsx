/**
 * Individual task page — code editor + problem statement.
 */
"use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  // TODO: Fetch task by params.id via React Query
  // TODO: Integrate Monaco Editor for code editing
  const isLoading = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem statement */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Task: {params.id}</CardTitle>
                  <Badge variant="warning">Medium</Badge>
                </div>
              </CardHeader>
              <CardContent className="prose prose-invert prose-sm max-w-none">
                <p className="text-muted-foreground">
                  Task description will be loaded here...
                </p>
              </CardContent>
            </Card>

            {/* Code editor area */}
            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
                <CardTitle className="text-sm">Code Editor</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">30 min</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-[400px] p-0">
                {/* TODO: Monaco Editor goes here */}
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Monaco Editor will be integrated here
                </div>
              </CardContent>
              <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                <Button variant="secondary">Run Tests</Button>
                <Button>Submit Solution</Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
