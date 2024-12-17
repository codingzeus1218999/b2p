import withPWA from "next-pwa";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["ru"],
    defaultLocale: "ru",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.b2pshop.click",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "chart.googleapis.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = join(__dirname, ".");
    return config;
  },
};

// Create a configuration that combines PWA and bundle analyzer
const combinedConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // Enable the bundle analyzer when ANALYZE environment variable is set to "true"
})(nextConfig);

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(combinedConfig);
