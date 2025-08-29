import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['xlsx'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'xlsx': 'commonjs xlsx'
      });
    }
    return config;
  }
};

export default nextConfig;
