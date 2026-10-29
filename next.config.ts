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
          // Sin scripts ni conexiones de terceros: todo sale del propio sitio (el ERP se llama desde el servidor). Las fotos
          // de los docentes vienen firmadas del almacenamiento del ERP (Supabase).
          { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'") + "; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co" + (process.env.NODE_ENV === "production" ? "" : " http://localhost:3001") + "; font-src 'self'; connect-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
