"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import clsx from "clsx";
import type { NavNode } from "@/lib/content";

export default function Sidebar({
  nav,
  currentHref,
}: {
  nav: NavNode;
  currentHref?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        <Menu className="h-4 w-4" />
        <span className="ml-2">Contents</span>
      </button>
      <nav
        className={clsx(
          "lg:block",
          open ? "block" : "hidden",
          "lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto",
        )}
      >
        <ul className="space-y-1 text-sm">
          {nav.children.map((node) => (
            <NavItem key={node.name} node={node} currentHref={currentHref} depth={0} />
          ))}
        </ul>
      </nav>
    </>
  );
}

function NavItem({
  node,
  currentHref,
  depth,
}: {
  node: NavNode;
  currentHref?: string;
  depth: number;
}) {
  const isActive = node.href && currentHref === node.href;
  const isAncestor =
    node.href && currentHref?.startsWith(node.href.replace(/\/index$/, "")) === true;
  const hasChildren = node.children.length > 0;
  const [expanded, setExpanded] = useState<boolean>(
    Boolean(isActive || isAncestor || depth === 0),
  );

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mr-1 inline-flex h-5 w-5 items-center justify-center text-ink-500 hover:text-ink-700"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="mr-1 inline-block h-5 w-5" />
        )}
        {node.href ? (
          <Link
            href={node.href}
            className={clsx(
              "block flex-1 truncate rounded px-1.5 py-1",
              isActive
                ? "bg-[--accent-soft] font-medium text-[--accent]"
                : "text-ink-700 hover:bg-ink-50",
            )}
          >
            {node.title ?? node.name}
          </Link>
        ) : (
          <span className="flex-1 truncate px-1.5 py-1 text-ink-500">
            {node.title ?? node.name}
          </span>
        )}
      </div>
      {hasChildren && expanded ? (
        <ul className="ml-3 mt-1 space-y-1 border-l border-ink-100 pl-2">
          {node.children.map((c) => (
            <NavItem
              key={c.name}
              node={c}
              currentHref={currentHref}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
