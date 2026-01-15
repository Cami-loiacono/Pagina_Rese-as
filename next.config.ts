import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/API/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;