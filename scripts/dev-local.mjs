// Sitio de la academia contra el ERP local (el de `npm run dev:local` en ERP-Devmark), igual en Windows, Mac y Linux:
//
//   npm run dev:local   ->  http://localhost:3400
//
// Usa la API en http://localhost:3001 y la firma de desarrollo (no es una credencial: solo vale contra el ERP local).
// Si la API no esta encendida, el sitio igual abre con el catalogo de respaldo.
import { spawn } from "node:child_process";

const entorno = {
  ...process.env,
  ERP_API_URL: process.env.ERP_API_URL ?? "http://localhost:3001",
  SITIO_SIGNING_SECRET: process.env.SITIO_SIGNING_SECRET ?? "dev-sitio-secreto",
  ACADEMIA_SITIO_SLUG: process.env.ACADEMIA_SITIO_SLUG ?? "academia",
};

try {
  const r = await fetch(`${entorno.ERP_API_URL}/api/v1/salud`, { signal: AbortSignal.timeout(3000) });
  console.warn(r.ok ? `[academia] API del ERP encendida en ${entorno.ERP_API_URL}` : `[academia] La API respondio ${r.status}`);
} catch {
  console.warn(`[academia] La API del ERP no responde en ${entorno.ERP_API_URL}: se vera el catalogo de respaldo y la inscripcion solo abrira WhatsApp. Enciendela con "npm run dev:local" en ERP-Devmark.`);
}

const next = spawn("npx", ["next", "dev", "-p", "3400"], { env: entorno, stdio: "inherit", shell: true });
next.on("exit", (codigo) => process.exit(codigo ?? 0));
