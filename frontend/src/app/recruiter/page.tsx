/**
 * Recruiter search page.
 */
"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { slideUp } from "@/lib/animations";

export default function RecruiterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <motion.div {...slideUp}>
          <h1 className="text-3xl font-bold mb-2">Talent Search</h1>
          <p className="text-muted-foreground mb-8">Find verified candidates by their demonstrated skills, not resumes.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Min Score</label>
                <Input type="number" placeholder="0" min={0} max={100} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Min Trust Score</label>
                <Input type="number" placeholder="50" min={0} max={100} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Skills</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {["Python", "API Design", "Data Processing", "Debugging"].map((skill) => (
                    <Badge key={skill} variant="outline" className="cursor-pointer text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full" size="sm">Search</Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="text-center py-16 text-muted-foreground">
              Configure filters and search to find verified candidates.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
