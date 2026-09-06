import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: allow loading the site from the LAN IP as well as localhost.
  // Without this, /_next/* dev assets 403 and the page never hydrates.
  allowedDevOrigins: ["192.168.86.34"],
};

export default nextConfig;
