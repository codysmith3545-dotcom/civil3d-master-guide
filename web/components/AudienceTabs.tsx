"use client";

import Link from "next/link";
import { useState } from "react";

type AudienceKey = "surveyors" | "firms" | "educators";

type AudienceLink = {
  title: string;
  href: string;
  body: string;
};

type Audience = {
  key: AudienceKey;
  label: string;
  blurb: string;
  links: AudienceLink[];
};

const AUDIENCES: Audience[] = [
  {
    key: "surveyors",
    label: "Working surveyors",
    blurb:
      "Daily-use tools and reference pages for crew chiefs, party chiefs, and field-to-finish techs.",
    links: [
      {
        title: "Traverse closure",
        href: "/tools/traverse-closure",
        body: "Closure error, precision, Bowditch adjustments.",
      },
      {
        title: "Inverse",
        href: "/tools/inverse",
        body: "Bearings and distances between two points.",
      },
      {
        title: "Metes & bounds writer",
        href: "/tools/metes-and-bounds",
        body: "Build a legal description from a coordinate list.",
      },
      {
        title: "Solar observation",
        href: "/tools/solar-observation",
        body: "Approximate sun azimuth for an astronomic check.",
      },
      {
        title: "Description keys",
        href: "/docs/civil3d/points/description-keys",
        body: "Field codes that drive symbology and figures.",
      },
      {
        title: "Indiana jurisdictions",
        href: "/docs/jurisdictions/indiana",
        body: "County and city standards for the Indy metro.",
      },
    ],
  },
  {
    key: "firms",
    label: "Surveying & engineering firms",
    blurb:
      "Multi-tenant features for shops that want to give their team a single, authoritative reference.",
    links: [
      {
        title: "AutoLISP & customization",
        href: "/docs/customization/lisp",
        body: "Distribute routines and template kits across the firm.",
      },
      {
        title: "Template & kit inventory",
        href: "/docs/customization/templates-and-kits",
        body: "DWT setup, layer standards, label-style audits.",
      },
      {
        title: "MCP server",
        href: "/docs/customization",
        body: "Expose the knowledge base to in-house AI assistants.",
      },
      {
        title: "Standards summaries",
        href: "/docs/standards",
        body: "AASHTO, ALTA/NSPS, INDOT, NCS — cited and current.",
      },
      {
        title: "Invite-only content",
        href: "/invite",
        body: "Gate private playbooks behind an invite code.",
      },
      {
        title: "Engineering reference",
        href: "/docs/engineering",
        body: "Stormwater, grading, road design, utilities.",
      },
    ],
  },
  {
    key: "educators",
    label: "Educators & students",
    blurb:
      "Material to support survey programs, FS/PS exam prep, and continuing-education modules.",
    links: [
      {
        title: "Glossary",
        href: "/docs/glossary",
        body: "Term-by-term definitions with cross-references.",
      },
      {
        title: "Civil 3D fundamentals",
        href: "/docs/civil3d",
        body: "Points, surfaces, alignments, profiles, corridors.",
      },
      {
        title: "Field & boundary practice",
        href: "/docs/field-and-boundary",
        body: "Real-world survey procedures and the legal layer.",
      },
      {
        title: "Engineering basics",
        href: "/docs/engineering",
        body: "Hydraulics, hydrology, geometric design.",
      },
      {
        title: "Calculators for class work",
        href: "/tools",
        body: "Each tool shows the underlying formula and citation.",
      },
      {
        title: "Outside resources",
        href: "/docs/resources",
        body: "Curated reading list and exam-prep links.",
      },
    ],
  },
];

export default function AudienceTabs() {
  const [active, setActive] = useState<AudienceKey>("surveyors");
  const current = AUDIENCES.find((a) => a.key === active) ?? AUDIENCES[0];

  return (
    <section aria-labelledby="audience-heading" className="mt-20">
      <h2
        id="audience-heading"
        className="text-2xl font-semibold tracking-tight"
      >
        Made for the way you actually work
      </h2>
      <p className="mt-2 max-w-2xl text-ink-600">
        Pick the role that fits and we will show you the entry points other
        people in that role use most.
      </p>

      <div
        role="tablist"
        aria-label="Choose an audience"
        className="mt-6 flex flex-wrap gap-2 border-b border-ink-100"
      >
        {AUDIENCES.map((a) => {
          const selected = a.key === active;
          return (
            <button
              key={a.key}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`audience-panel-${a.key}`}
              id={`audience-tab-${a.key}`}
              onClick={() => setActive(a.key)}
              className={
                "rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition " +
                (selected
                  ? "border-[--accent] text-ink-900"
                  : "border-transparent text-ink-500 hover:text-ink-800")
              }
            >
              {a.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`audience-panel-${current.key}`}
        aria-labelledby={`audience-tab-${current.key}`}
        className="mt-6"
      >
        <p className="mb-4 text-sm text-ink-600">{current.blurb}</p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {current.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block h-full rounded-lg border border-ink-100 p-4 transition hover:border-ink-300 hover:shadow-sm"
              >
                <div className="text-sm font-semibold text-ink-900">
                  {l.title}
                </div>
                <p className="mt-1 text-sm text-ink-600">{l.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
