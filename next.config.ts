import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "shuvmarg-kyc-storage-prod.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

