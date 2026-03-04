/**
 * Skill Passport Card — the core display component for a candidate's passport.
 */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getTrustLevel } from "@/lib/utils";
import { cardHover, staggerContainer, staggerItem } from "@/lib/animations";
import type { SkillPassport } from "@/types";

interface PassportCardProps {
  passport: SkillPassport;
}

export function PassportCard({ passport }: PassportCardProps) {
  const trustInfo = getTrustLevel(passport.trust_score);

  return (
    <motion.div {...cardHover}>
      <Card className="overflow-hidden">
        {/* Gradient header stripe */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">{passport.user.full_name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{passport.passport_id}</p>
          </div>
          <Badge variant={passport.is_verified ? "success" : "warning"}>
            {passport.is_verified ? "Verified" : "Pending"}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall score ring */}
          <div className="flex items-center justify-center">
            <ScoreRing score={passport.overall_score} label="Overall" size={140} />
          </div>

          {/* Trust indicator */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted-foreground">Trust Score</span>
            <Badge variant={passport.trust_score >= 80 ? "success" : passport.trust_score >= 50 ? "warning" : "danger"}>
              {trustInfo.label} — {Math.round(passport.trust_score)}%
            </Badge>
          </div>

          {/* Skill breakdown */}
          {passport.skill_breakdown && (
            <motion.div className="space-y-3" {...staggerContainer}>
              {Object.entries(passport.skill_breakdown).map(([skill, score]) => (
                <motion.div key={skill} {...staggerItem}>
                  <ProgressBar
                    label={skill}
                    value={score}
                    max={100}
                    showValue
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-2xl font-bold">{passport.total_tasks_completed}</p>
              <p className="text-xs text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-2xl font-bold">{Math.round(passport.overall_score)}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
