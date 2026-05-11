import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getNav,
  getPageBySlug,
  listAll,
  renderMarkdown,
} from "@/lib/content";
import { canView } from "@/lib/access";
import Sidebar from "@/components/Sidebar";
import OnThisPage from "@/components/OnThisPage";
import CopyForAI from "@/components/CopyForAI";
import ReportIssue from "@/components/ReportIssue";

type RouteProps = { params: { slug: string[] } };

export async function generateStaticParams() {
  // Pre-render every page (including invite-gated; the runtime gate still
  // blocks rendering content for visitors without a cookie).
  return listAll().map((p) => ({ slug: p.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.frontmatter.title ?? params.slug.join("/"),
  };
}

export default async function DocPage({ params }: RouteProps) {
  const page = getPageBySlug(params.slug);
  if (!page) notFound();

  const allowed = await canView(page);
  const nav = getNav();

  if (!allowed) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Sidebar nav={nav} currentHref={page.href} />
        <div className="rounded-md border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-xl font-semibold">Invite required</h1>
          <p className="mt-2 text-ink-700">
            This page is gated. Open the invite link you were sent to view it.
          </p>
          <p className="mt-4 text-sm text-ink-500">
            If you reached this page from a link in your email and still see
            this notice, your invite may have expired. Ask the operator for a
            fresh link.
          </p>
        </div>
      </div>
    );
  }

  const { html, headings } = await renderMarkdown(page.body);
  const fm = page.frontmatter;

  // Extract TL;DR: first blockquote block from the raw body
  const tldrMatch = page.body.match(/^>\s*.+(?:\n>.*)*$/m);
  const tldr = tldrMatch
    ? tldrMatch[0].replace(/^>\s?/gm, "").trim()
    : "";

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[16rem_minmax(0,1fr)_14rem]">
      <Sidebar nav={nav} currentHref={page.href} />
      <article className="min-w-0">
        <header className="mb-6 border-b border-ink-100 pb-4">
          {fm.section ? (
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
              {fm.section as string}
            </p>
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
              {(fm.title as string) ?? params.slug.join("/")}
            </h1>
            {tldr ? (
              <CopyForAI
                title={(fm.title as string) ?? params.slug.join("/")}
                tldr={tldr}
                section={(fm.section as string) ?? params.slug.join("/")}
              />
            ) : null}
          </div>
          {fm.updated ? (
            <p className="mt-2 text-xs text-ink-500">
              Updated {String(fm.updated)}
            </p>
          ) : null}
        </header>
        <div
          className="prose prose-ink max-w-none prose-headings:scroll-mt-20 prose-a:text-[--accent]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {Array.isArray(fm.sources) && fm.sources.length > 0 ? (
          <section className="mt-10 border-t border-ink-100 pt-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-ink-500">
              Sources
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(fm.sources as { title: string; url: string; verified?: string }[]).map(
                (s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      className="text-[--accent] underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.title}
                    </a>
                    {s.verified ? (
                      <span className="text-ink-500"> (verified {String(s.verified)})</span>
                    ) : null}
                  </li>
                ),
              )}
            </ul>
          </section>
        ) : null}
        <div className="mt-10 flex items-center gap-2 text-sm">
          <Link
            href={`/api/raw/${page.slug}`}
            className="btn"
            prefetch={false}
          >
            View raw markdown
          </Link>
        </div>
        <ReportIssue
          slug={page.slug}
          title={(fm.title as string) ?? params.slug.join("/")}
        />
      </article>
      <aside className="hidden lg:block">
        <OnThisPage headings={headings} />
      </aside>
    </div>
  );
}
