import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Content lives one level above the web/ app.
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
