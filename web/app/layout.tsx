import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import OfflineIndicator from "@/components/OfflineIndicator";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: {
    default: "Civil 3D Master Guide",
    template: "%s — Civil 3D Master Guide",
  },
  description:
    "A working reference for land surveyors and civil engineers using Autodesk Civil 3D, with Indiana jurisdictional content, calculators, and an AI assistant.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink-900 antialiased">
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
            <OfflineIndicator />
          </div>
        </header>
        <ServiceWorkerRegistrar />
        <main>{children}</main>
        <footer className="border-t border-ink-100 py-6 text-center text-xs text-ink-500">
          Civil 3D Master Guide. Original content licensed CC BY-SA 4.0.
        </footer>
      </body>
    </html>
  );
}
