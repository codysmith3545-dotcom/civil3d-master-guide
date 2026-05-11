"use client";

/**
 * Site-wide header and footer. Rendered by the root layout and
 * suppressed on `/embed/*` so iframe-embedded calculators render
 * without global nav, search, or footer.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox";

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/embed")) return null;
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Civil 3D Master Guide
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-ink-600 md:flex">
          <Link href="/docs" className="hover:text-ink-900">
            Docs
          </Link>
          <Link href="/tools" className="hover:text-ink-900">
            Calculators
          </Link>
          <Link href="/chat" className="hover:text-ink-900">
            Chat
          </Link>
        </nav>
        <div className="ml-auto w-full max-w-sm">
          <SearchBox />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/embed")) return null;
  return (
    <footer className="border-t border-ink-100 py-6 text-center text-xs text-ink-500">
      Civil 3D Master Guide. Original content licensed CC BY-SA 4.0.
    </footer>
  );
}
