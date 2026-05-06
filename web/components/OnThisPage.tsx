import type { Heading } from "@/lib/content";

export default function OnThisPage({ headings }: { headings: Heading[] }) {
  if (!headings.length) return null;
  return (
    <nav
      aria-label="On this page"
      className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pl-3 text-xs"
    >
      <p className="mb-2 font-medium uppercase tracking-wider text-ink-500">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.depth - 2) * 0.75}rem` }}
            className={h.depth <= 2 ? "" : "text-ink-500"}
          >
            <a className="hover:text-ink-900" href={`#${h.id}`}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
