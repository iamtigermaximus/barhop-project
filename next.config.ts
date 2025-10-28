import type { NextConfig } from "next";
import path from "node:path"; // ✅ Correct import for ESM + Node 18+

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // ✅ Your alias
    };
    return config;
  },
};

export default nextConfig;
