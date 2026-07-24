import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Явно фіксуємо корінь проєкту (поруч є інші lockfile у батьківських теках)
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
