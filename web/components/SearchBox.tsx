"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { search, type SearchHit } from "@/lib/search-index";
import { trackSearch } from "@/lib/analytics";

interface SearchBoxProps {
  size?: "default" | "large";
  placeholder?: string;
}

export default function SearchBox({
  size = "default",
  placeholder = "Search docs",
}: SearchBoxProps) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!q.trim()) {
      setHits([]);
      return;
    }
    setBusy(true);
    const start =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    search(q, 10)
      .then((r) => {
        if (!cancelled) {
          setHits(r);
          const end =
            typeof performance !== "undefined"
              ? performance.now()
              : Date.now();
          trackSearch(q, r.length, end - start);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHits([]);
          const end =
            typeof performance !== "undefined"
              ? performance.now()
              : Date.now();
          trackSearch(q, 0, end - start);
        }
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div ref={containerRef} className="relative">
      <label
        className={
          size === "large"
            ? "flex items-center gap-3 rounded-lg border border-ink-300 bg-white px-4 py-3 text-base shadow-sm focus-within:border-ink-500 focus-within:ring-2 focus-within:ring-ink-200"
            : "flex items-center gap-2 rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm focus-within:border-ink-400"
        }
      >
        <Search className={size === "large" ? "h-5 w-5 text-ink-500" : "h-4 w-4 text-ink-500"} />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder:text-ink-400"
          aria-label="Search the knowledge base"
        />
      </label>
      {open && q.trim() ? (
        <div className="absolute right-0 top-full z-40 mt-1 w-[28rem] max-w-[90vw] rounded-md border border-ink-200 bg-white shadow-lg">
          {busy ? (
            <div className="p-3 text-sm text-ink-500">Searching…</div>
          ) : hits.length === 0 ? (
            <div className="p-3 text-sm text-ink-500">No results.</div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {hits.map((h) => (
                <li key={h.doc.id}>
                  <Link
                    href={h.doc.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 hover:bg-ink-50"
                  >
                    <div className="text-sm font-medium text-ink-900">
                      {h.doc.title}
                    </div>
                    <div className="truncate text-xs text-ink-500">
                      {h.doc.href}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-ink-600">
                      {h.excerpt}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
