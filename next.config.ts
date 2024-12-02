import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  basePath: '/home',
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
