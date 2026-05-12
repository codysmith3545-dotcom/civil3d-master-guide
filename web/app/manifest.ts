import type { MetadataRoute } from "next";

// PWA manifest. Field-day landing page is the start_url so installing the PWA
// drops the user straight into the offline-friendly tools menu. The static
// /public/manifest.json mirror exists so hand-set <link rel="manifest"> tags
// (or static deploys without server-rendered metadata) keep working.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Civil 3D Master Guide",
    short_name: "Civil3D Guide",
    description:
      "Civil 3D, surveying, and Indiana jurisdictional reference with offline-capable calculators and field-day quick references.",
    start_url: "/field",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#0d1f3c",
    categories: ["productivity", "utilities", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Find rules at location", url: "/field" },
      { name: "Calculators", url: "/tools" },
    ],
  };
}
