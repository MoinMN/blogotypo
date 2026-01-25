import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    domains: ["*"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // {
      //   protocol: "http",
      //   hostname: "**",
      // },
    ],
  },
};

export default withPWA(nextConfig);
