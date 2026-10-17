import type { NextConfig } from "next";

// Export statique (dossier `out/`) servi tel quel par le serveur PHP,
// avec l'API dans `out/api/` (copiée depuis `public/api/`).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
