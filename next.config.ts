import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/home',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://tpyrcne.buzz/api/:path*',
      },
    ];
  }
};

export default nextConfig;
