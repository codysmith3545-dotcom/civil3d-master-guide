import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";

export default function Footer() {
  const config = getSiteConfig();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink-50/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-ink-600 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-medium text-ink-900">{config.brand.name}</div>
          <div className="mt-1 text-xs">
            {config.brand.footer} &middot; {config.license ?? "CC BY-SA 4.0"} &middot; &copy;{" "}
            {year}
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-xs">
          <Link href="/docs" className="hover:text-ink-900">
            Docs
          </Link>
          <Link href="/tools" className="hover:text-ink-900">
            Calculators
          </Link>
          <Link href="/chat" className="hover:text-ink-900">
            Chat
          </Link>
          {config.repo_url ? (
            <a
              href={config.repo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-ink-900"
            >
              Source on GitHub
            </a>
          ) : null}
          <span className="text-ink-400">Built with Claude Code</span>
        </nav>
      </div>
    </footer>
  );
}
