import type { NextConfig } from "next";

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getApiBaseUrl() {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL!);
}

function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/v1$/, "");
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${getApiBaseUrl()}/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${getApiOrigin()}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
