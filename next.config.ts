import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ccdn.lezhin.com',
        port: '',
        pathname: '/v2/comics/**',
      },
    ],
  },
};

export default nextConfig;
