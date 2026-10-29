import "server-only";
import respaldo from "@/data/catalogo-respaldo.json";
import type { Curso } from "./academia";

// El sitio no tiene base de datos (decision 0007 del ERP): lee el catalogo y envia las inscripciones a la API del
// ERP, firmado desde el servidor con SITIO_SIGNING_SECRET. El secreto nunca llega al navegador.

const API = (process.env.ERP_API_URL ?? "https://api.devmarkpe.com").replace(/\/+$/, "");
const SITIO = process.env.ACADEMIA_SITIO_SLUG ?? "academia";
const base = `${API}/api/v1/publico/sitios/${SITIO}/academia`;

function cabeceras(extra?: Record<string, string>): HeadersInit {
  return { "x-sitio-signature": process.env.SITIO_SIGNING_SECRET ?? "", accept: "application/json", ...extra };
}

/** Catalogo de respaldo (copia del verano 2027): se usa solo si la API no responde. Sus grupos no se pueden elegir. */
const CATALOGO_RESPALDO = (respaldo as { cursos: Curso[] }).cursos;

/** Cursos publicados con sus grupos. Se refresca cada 5 minutos; si la API falla, sale el respaldo. */
export async function obtenerCursos(): Promise<{ cursos: Curso[]; enVivo: boolean }> {
  try {
    const r = await fetch(`${base}/cursos`, { headers: cabeceras(), next: { revalidate: 300, tags: ["catalogo"] }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`API ${r.status}`);
    const { cursos } = (await r.json()) as { cursos: Curso[] };
    return { cursos, enVivo: true };
  } catch (e) {
    console.error("[academia] catalogo de respaldo:", e instanceof Error ? e.message : e);
    return { cursos: CATALOGO_RESPALDO, enVivo: false };
  }
}

export async function obtenerCurso(slug: string): Promise<Curso | null> {
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  try {
    const r = await fetch(`${base}/cursos/${slug}`, { headers: cabeceras(), next: { revalidate: 300, tags: ["catalogo"] }, signal: AbortSignal.timeout(8000) });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`API ${r.status}`);
    return (await r.json()) as Curso;
  } catch (e) {
    console.error("[academia] curso de respaldo:", e instanceof Error ? e.message : e);
    return CATALOGO_RESPALDO.find((c) => c.slug === slug) ?? null;
  }
}

export type RespuestaInscripcion = { id: string; codigo: string; whatsapp: { mensaje: string; enlace: string } };

/** Registra la inscripcion en el ERP. Devuelve el codigo y el enlace de WhatsApp, o el mensaje de error de la API. */
export async function registrarInscripcion(cuerpo: Record<string, unknown>, ipCliente: string | null): Promise<{ ok: true; datos: RespuestaInscripcion } | { ok: false; error: string; caida: boolean }> {
  try {
    const r = await fetch(`${base}/inscripciones`, {
      method: "POST",
      headers: cabeceras({ "content-type": "application/json", ...(ipCliente ? { "x-cliente-ip": ipCliente } : {}) }),
      body: JSON.stringify(cuerpo),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const json = (await r.json().catch(() => ({}))) as { message?: string | string[] } & Partial<RespuestaInscripcion>;
    if (r.ok && json.codigo && json.whatsapp) return { ok: true, datos: json as RespuestaInscripcion };
    const mensaje = Array.isArray(json.message) ? json.message.join(" ") : json.message;
    // 4xx: el dato esta mal (se le muestra a la persona). 5xx o sin respuesta: el sistema esta caido.
    return { ok: false, error: r.status < 500 && mensaje ? mensaje : "No pudimos registrar tu inscripción.", caida: r.status >= 500 };
  } catch {
    return { ok: false, error: "No pudimos registrar tu inscripción.", caida: true };
  }
}
