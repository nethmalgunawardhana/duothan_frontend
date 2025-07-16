import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better development experience
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  
  // Configure rewrites for API proxy (optional - for development)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },
  
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  
  // Optimize images
  images: {
    domains: ['ik.imagekit.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/Aditha/**',
      },
    ],
  },
};

export default nextConfig;
