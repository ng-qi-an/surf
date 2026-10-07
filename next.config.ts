import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.favicon.im',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
