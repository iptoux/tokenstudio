'use client';

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch GitHub star count
    fetch('https://api.github.com/repos/iptoux/tokenstudio')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Silently fail if API is unavailable
      });
  }, []);

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center text-sm text-muted-foreground sm:text-left">
            Made with <span className="text-destructive">❤️</span> using{' '}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Next.js
            </Link>
            {' '}and{' '}
            <Link
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              React
            </Link>
          </div>
          <Link
            href="https://github.com/iptoux/tokenstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>Star</span>
            {starCount !== null && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                {starCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </footer>
  );
}

