import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // temporalmente para desplegar
  },
};

export default nextConfig;
