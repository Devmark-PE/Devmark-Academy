import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hostinger ejecuta un unico "node server.js": el standalone se empaqueta con scripts/empaquetar-standalone.mjs.
  output: "standalone",
  // Todas las rutas terminan en "/", como devi.devmarkpe.com: una sola direccion canonica por pagina.
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Sin scripts ni conexiones de terceros: todo sale del propio sitio (el ERP se llama desde el servidor).
          { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
