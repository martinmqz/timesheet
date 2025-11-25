import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["martinstack.dev"], // allow external pixel/image host
  },
};

export default nextConfig;
