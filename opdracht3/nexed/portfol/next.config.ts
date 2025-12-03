import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.istockphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bigfootdigital.co.uk',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
