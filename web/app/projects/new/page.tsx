"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = slug.trim() || autoSlug(name);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: effectiveSlug || undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        setError(body.message ?? `Request failed (${res.status}).`);
        setSubmitting(false);
        return;
      }
      const created = (await res.json()) as { id: string };
      router.push(`/projects/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <nav className="mb-4 text-sm text-ink-500">
        <Link href="/projects" className="hover:text-ink-900">
          Projects
        </Link>{" "}
        / New
      </nav>
      <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
      <p className="mt-2 text-ink-600">
        A project is a folder of documents (deeds, plats, scope, field notes)
        that the assistant retrieves from before answering. Documents stay
        scoped to the project.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Project name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Smith Tract — boundary &amp; topo"
            className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Slug{" "}
            <span className="font-normal text-ink-500">
              (optional; auto-generated from the name)
            </span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={autoSlug(name) || "smith-tract-boundary-topo"}
            className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 font-mono text-sm outline-none focus:border-ink-400"
          />
          {effectiveSlug ? (
            <p className="mt-1 font-mono text-xs text-ink-500">
              {effectiveSlug}
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            {error}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="btn btn-primary disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create project"}
          </button>
          <Link href="/projects" className="btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function autoSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}
