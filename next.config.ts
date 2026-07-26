import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile higher up the tree makes Turbopack
  // guess wrong about where the project starts.
  turbopack: {
    root: import.meta.dirname,
  },

  // GitHub Pages serves plain static files — no Next.js server.
  output: "export",

  // Emit `/out/index.html` style folders so Pages resolves URLs without a router.
  trailingSlash: true,

  // The Image Optimization API needs a server; ship the source files as-is.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
