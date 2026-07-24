import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Явно фіксуємо корінь проєкту (поруч є інші lockfile у батьківських теках)
  turbopack: { root: path.join(__dirname) },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sense-house.com" }],
        destination: "https://sense-house.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
