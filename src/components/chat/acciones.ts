"use server";

import { headers } from "next/headers";
import { chatErp } from "@/lib/erp";

// El chat de Devi habla con el ERP desde el servidor del sitio (firmado); el navegador solo guarda su token anonimo.

export type MensajeChat = { id: string; autor: "VISITANTE" | "IA" | "ASESOR"; texto: string; creadoEn: string; asesor?: string };
export type EstadoChat = "IA" | "ESPERANDO_ASESOR" | "CON_ASESOR" | "CERRADA";

const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function ip(): Promise<string | null> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
}

const SIN_SERVICIO = "No pude conectarme ahora. Escríbenos por WhatsApp y te respondemos enseguida.";

export async function enviarMensaje(e: { visitante: string; conversacionId: string | null; texto: string; pagina: string }): Promise<{ ok: true; conversacionId: string; estado: EstadoChat; respuesta: MensajeChat | null } | { ok: false; error: string }> {
  const texto = e.texto.trim().slice(0, 2000);
  if (!TOKEN.test(e.visitante) || !texto) return { ok: false, error: "Mensaje no válido" };
  const r = await chatErp<{ conversacionId: string; estado: EstadoChat; respuesta: MensajeChat | null; message?: string }>("/mensajes", {
    ip: await ip(),
    cuerpo: { visitante: e.visitante, ...(e.conversacionId && UUID.test(e.conversacionId) ? { conversacionId: e.conversacionId } : {}), texto, idioma: "es", pagina: e.pagina.slice(0, 300).replace(/[<>]/g, "") },
  });
  // Si la conversacion guardada ya no existe (se borro), empieza una nueva.
  if (r?.estado === 404 && e.conversacionId) return enviarMensaje({ ...e, conversacionId: null });
  if (!r || r.estado >= 400) return { ok: false, error: r?.estado === 429 ? "Vas muy rápido: espera un momento." : SIN_SERVICIO };
  return { ok: true, conversacionId: r.datos.conversacionId, estado: r.datos.estado, respuesta: r.datos.respuesta };
}

export async function leerConversacion(e: { visitante: string; conversacionId: string; despues: string | null }): Promise<{ ok: true; estado: EstadoChat; asesor: string | null; mensajes: MensajeChat[] } | { ok: false }> {
  if (!TOKEN.test(e.visitante) || !UUID.test(e.conversacionId)) return { ok: false };
  const filtro = e.despues && !Number.isNaN(Date.parse(e.despues)) ? `?despues=${encodeURIComponent(e.despues)}` : "";
  const r = await chatErp<{ estado: EstadoChat; asesor: string | null; mensajes: MensajeChat[] }>(`/${e.conversacionId}${filtro}`, { metodo: "GET", ip: await ip(), visitante: e.visitante });
  if (!r || r.estado >= 400) return { ok: false };
  return { ok: true, ...r.datos };
}

export async function pedirAsesor(e: { visitante: string; conversacionId: string; nombre: string; telefono: string }): Promise<{ ok: true; estado: EstadoChat } | { ok: false; error: string }> {
  if (!TOKEN.test(e.visitante) || !UUID.test(e.conversacionId)) return { ok: false, error: "Escribe primero tu consulta" };
  const nombre = e.nombre.replace(/[<>]/g, "").trim().slice(0, 120);
  const telefono = e.telefono.trim().slice(0, 30);
  if (telefono && !/^[0-9+()\s-]{6,30}$/.test(telefono)) return { ok: false, error: "Revisa el número de celular" };
  const r = await chatErp<{ estado: EstadoChat }>(`/${e.conversacionId}/asesor`, { ip: await ip(), cuerpo: { visitante: e.visitante, ...(nombre ? { nombre } : {}), ...(telefono ? { telefono } : {}) } });
  if (!r || r.estado >= 400) return { ok: false, error: r?.estado === 429 ? "Ya avisamos al equipo. En un momento te responden." : SIN_SERVICIO };
  return { ok: true, estado: r.datos.estado };
}
