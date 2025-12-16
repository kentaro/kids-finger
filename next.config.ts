import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/kids-finger",
  assetPrefix: "/kids-finger/",
};

export default nextConfig;
