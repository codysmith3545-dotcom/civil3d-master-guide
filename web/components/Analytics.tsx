"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

/**
 * Mounts once at the root layout and emits a page_view event on initial load
 * and on every client-side route change.
 *
 * Implementation note: usePathname + useSearchParams together capture both
 * pathname changes (e.g. /tools -> /tools/inverse) and search-param changes
 * (e.g. /docs?tab=ribbon -> /docs?tab=command). useSearchParams forces a
 * Suspense boundary in Next 14 app router, hence the inner component.
 */
function AnalyticsInner(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}

export function Analytics(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}
