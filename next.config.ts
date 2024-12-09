import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
