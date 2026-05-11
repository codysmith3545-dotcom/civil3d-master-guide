import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import Footer from "@/components/Footer";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig();

export const metadata: Metadata = {
  title: {
    default: config.brand.name,
    template: `%s — ${config.brand.name}`,
  },
  description: config.knowledge.scope,
  openGraph: {
    title: config.brand.name,
    description: config.knowledge.scope,
    type: "website",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: config.brand.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.brand.name,
    description: config.knowledge.scope,
    images: ["/og-default.svg"],
  },
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
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
