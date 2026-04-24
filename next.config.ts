// import type { NextConfig } from "next";
// import path from "path";

// const nextConfig: NextConfig = {
//   webpack: (config) => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       "@": path.resolve(__dirname, "src"),
//     };
//     return config;
//   },
// };

// export default nextConfig;
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Allows all paths on this hostname
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
