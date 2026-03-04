/**
 * ISIN Landing Page — Hero + Features + CTA.
 */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/footer";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  slideUp,
  floatingNode,
  pulseGlow,
} from "@/lib/animations";

const FEATURES = [
  {
    title: "AI-Verified Skills",
    description:
      "Complete real-world coding tasks evaluated by GPT-4o-mini across 6 dimensions. No self-reported skills.",
    icon: "🧠",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Anti-Cheat Intelligence",
    description:
      "Behavioral analysis detects paste-dumps, tab-switching, typing anomalies, and code similarity.",
    icon: "🛡️",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Skill Passport",
    description:
      "A verified, portable credential with a trust score. Share it anywhere — no resume needed.",
    icon: "🎫",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Recruiter Dashboard",
    description:
      "Search candidates by verified skill scores, not keywords. Filter by trust, skill, and college.",
    icon: "🔍",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Built for Tier-2/3 India",
    description:
      "Designed for students at non-elite colleges. Your code speaks louder than your college brand.",
    icon: "🇮🇳",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Open & Cost-Optimized",
    description:
      "$5/day AI budget cap, free tier for students, open passport protocol. Built for scale.",
    icon: "💡",
    gradient: "from-sky-500 to-indigo-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              IS
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ISIN
            </span>
          </Link>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-background to-background" />
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"
            {...floatingNode(0)}
          />
          <motion.div
            className="absolute top-40 right-1/4 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl"
            {...floatingNode(1.5)}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 lg:py-40 text-center">
            <motion.div {...pageTransition}>
              <Badge variant="purple" className="mb-6">
                🚀 Building India&apos;s Skill Future
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Your Skills,{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Verified by AI
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                ISIN replaces resumes with AI-verified Skill Passports. Complete real coding tasks,
                get evaluated across 6 dimensions, and share a trusted credential with recruiters.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/register">
                  <Button size="xl">Start Building Your Passport</Button>
                </Link>
                <Link href="/recruiter">
                  <Button variant="secondary" size="xl">I&apos;m a Recruiter</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Features ────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <motion.div {...slideUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How ISIN Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A new standard for skill verification — built on real-world demonstrations, not self-reported claims.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            {...staggerContainer}
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} {...staggerItem}>
                <Card className="h-full hover-lift">
                  <CardContent className="pt-6">
                    <motion.div
                      className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-2xl mb-4`}
                      {...pulseGlow}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── How It Works Steps ──────────────────── */}
        <section className="bg-white/[0.02] border-y border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
            <motion.div {...slideUp} className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Three Simple Steps</h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" {...staggerContainer}>
              {[
                { step: "01", title: "Sign Up", desc: "Create your free account in 30 seconds. No resume needed." },
                { step: "02", title: "Complete Tasks", desc: "Solve real-world Python challenges with a built-in code editor." },
                { step: "03", title: "Share Passport", desc: "Get your AI-verified Skill Passport and share it with recruiters." },
              ].map((item) => (
                <motion.div key={item.step} {...staggerItem} className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-2xl font-bold text-indigo-400 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 text-center">
          <motion.div {...slideUp}>
            <h2 className="text-3xl font-bold mb-4">Ready to Prove Your Skills?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students building verified skill profiles that speak louder than any resume.
            </p>
            <Link href="/register">
              <Button size="xl">Get Started — It&apos;s Free</Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
