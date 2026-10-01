import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  images: {
    remotePatterns: [
      { hostname: "**.r2.dev" },
      { hostname: "img.spoonacular.com" },
      { hostname: "www.edamam.com" },
      { hostname: "images.openfoodfacts.org" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
