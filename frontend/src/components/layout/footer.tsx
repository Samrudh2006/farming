/**
 * Footer component.
 */
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[10px]">
              IS
            </div>
            <span className="text-sm text-muted-foreground">
              India&apos;s Skill Intelligence Network
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-default">About</Link>
            <Link href="/privacy" className="hover:text-foreground transition-default">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-default">Terms</Link>
            <a
              href="https://github.com/Samrudh2006/farming"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-default"
            >
              GitHub
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ISIN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
