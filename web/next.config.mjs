import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Build the CSP `frame-ancestors` value for /embed/* routes.
 * Implemented inline (rather than importing from web/lib/config.ts)
 * because Next reads this config in a pure-Node context that does
 * not run through the TS path alias resolver.
 */
function embedFrameAncestors() {
  const raw = process.env.EMBED_ALLOWED_FRAME_ANCESTORS ?? "";
  const extra = raw
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const set = new Set(["'self'", ...extra]);
  return Array.from(set).join(" ");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Content lives one level above the web/ app.
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    typedRoutes: false,
  },
  async headers() {
    const ancestors = embedFrameAncestors();
    return [
      {
        // Permit embedding /embed/* widgets in iframes hosted by any
        // origin listed in EMBED_ALLOWED_FRAME_ANCESTORS. 'self' is
        // always included.
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${ancestors};`,
          },
        ],
      },
      {
        // Site-wide clickjacking protection for everything EXCEPT
        // /embed/*. Uses a path-to-regexp negative lookahead so the
        // header is not emitted on embed routes (otherwise no browser
        // would honour the CSP frame-ancestors above).
        source: "/:path((?!embed/).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
