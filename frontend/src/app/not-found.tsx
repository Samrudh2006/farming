/**
 * Custom 404 page.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        This page doesn&apos;t exist. Maybe the URL is wrong, or the page was moved.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
