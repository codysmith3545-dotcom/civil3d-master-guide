import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Civil 3D Master Guide",
    template: "%s — Civil 3D Master Guide",
  },
  description:
    "A working reference for land surveyors and civil engineers using Autodesk Civil 3D, with Indiana jurisdictional content, calculators, and an AI assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink-900 antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
