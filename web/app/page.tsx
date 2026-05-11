import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import matter from "gray-matter";
import SearchBox from "@/components/SearchBox";
import HomeNumbers from "@/components/HomeNumbers";
import AudienceTabs from "@/components/AudienceTabs";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig();

export const metadata: Metadata = {
  title: config.brand.name,
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

// --- "What's new" data fetching ----------------------------------------------

type WhatsNewItem = {
  title: string;
  section: string;
  href: string;
  updated: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "..", "content");

async function walkMd(root: string): Promise<string[]> {
  const out: string[] = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: import("node:fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith(".md")) out.push(full);
    }
  }
  return out;
}

async function loadWhatsNew(limit = 6): Promise<WhatsNewItem[]> {
  const files = await walkMd(CONTENT_ROOT);
  const items: WhatsNewItem[] = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(file, "utf8");
      const parsed = matter(raw);
      const fm = parsed.data as Record<string, unknown>;
      if (fm.visibility === "invite") continue;
      const updated = typeof fm.updated === "string" ? fm.updated : "";
      if (!updated) continue;
      const slug = path
        .relative(CONTENT_ROOT, file)
        .replace(/\\/g, "/")
        .replace(/\.md$/, "");
      const href = "/docs/" + slug.replace(/\/index$/, "");
      const title =
        (typeof fm.title === "string" && fm.title) ||
        slug.split("/").pop() ||
        slug;
      const section =
        (typeof fm.section === "string" && fm.section) ||
        slug.split("/")[0] ||
        "";
      items.push({ title, section, href, updated });
    } catch {
      // ignore unreadable files
    }
  }
  items.sort((a, b) => (a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : 0));
  return items.slice(0, limit);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// --- Feature surface cards ---------------------------------------------------

type FeatureCard = {
  title: string;
  body: string;
  href: string;
  available: boolean;
};

const featureCards: FeatureCard[] = [
  {
    title: "Deed Decoder",
    body: "Paste a metes-and-bounds description and get a plottable coordinate list, with closure stats.",
    href: "/tools/metes-and-bounds",
    available: true,
  },
  {
    title: "Jurisdiction GPS lookup",
    body: "Geolocate to the right county and city page so you can read the exact local requirement, fast.",
    href: "/docs/jurisdictions/indiana",
    available: true,
  },
  {
    title: "AutoLISP library",
    body: "Reference patterns, loading at startup, and how to call Civil 3D objects from Visual LISP.",
    href: "/docs/customization/lisp",
    available: true,
  },
  {
    title: "AI project companion",
    body: "A retrieval-grounded assistant that scopes answers to your active project files. Coming soon.",
    href: "#",
    available: false,
  },
  {
    title: "Calculators",
    body: "Seventeen survey and engineering calculators, each with the formula and a citation to the source.",
    href: "/tools",
    available: true,
  },
  {
    title: "Playbooks",
    body: "Step-by-step workflow scripts that string commands and standards into a single run. Coming soon.",
    href: "#",
    available: false,
  },
];

// --- Page --------------------------------------------------------------------

export default async function HomePage() {
  const whatsNew = await loadWhatsNew(6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-ink-500">
          {config.knowledge.focus || "Civil 3D reference"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-900 md:text-6xl">
          {config.brand.name}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-600">
          {config.knowledge.scope}
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBox size="large" placeholder="Search 460+ pages, 17 calculators, and every command." />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/docs" className="btn btn-primary">
            Browse the knowledge base
          </Link>
          <Link href="/tools" className="btn">
            Try a tool
          </Link>
        </div>
      </section>

      {/* By the numbers */}
      <HomeNumbers />

      {/* What's new */}
      <section aria-labelledby="whats-new-heading" className="mt-20">
        <div className="mb-6 flex items-baseline justify-between">
          <h2
            id="whats-new-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            What's new
          </h2>
          <Link
            href="/docs"
            className="text-sm font-medium text-[--accent] hover:underline"
          >
            All pages
          </Link>
        </div>
        {whatsNew.length === 0 ? (
          <p className="text-sm text-ink-500">
            No dated pages yet. Add an <code>updated:</code> field to a
            page's frontmatter to surface it here.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whatsNew.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-lg border border-ink-100 p-4 transition hover:border-ink-300 hover:shadow-sm"
                >
                  <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
                    {item.section}
                  </div>
                  <div className="mt-1 text-base font-semibold text-ink-900">
                    {item.title}
                  </div>
                  <div className="mt-2 text-xs text-ink-500">
                    Updated {formatDate(item.updated)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Feature surface */}
      <section aria-labelledby="features-heading" className="mt-20">
        <h2
          id="features-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          The whole surface
        </h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          Six entry points into the platform. The greyed cards are scaffolded
          and on the roadmap.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-ink-900">
                    {card.title}
                  </h3>
                  {!card.available ? (
                    <span className="rounded-full border border-ink-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-500">
                      Coming soon
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-ink-600">{card.body}</p>
              </>
            );
            if (!card.available) {
              return (
                <div
                  key={card.title}
                  aria-disabled="true"
                  className="block h-full cursor-not-allowed rounded-lg border border-dashed border-ink-200 bg-ink-50/40 p-5 opacity-70"
                >
                  {inner}
                </div>
              );
            }
            return (
              <Link
                key={card.title}
                href={card.href}
                className="block h-full rounded-lg border border-ink-100 p-5 transition hover:border-ink-300 hover:shadow-sm"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Audience switcher */}
      <AudienceTabs />
    </div>
  );
}
