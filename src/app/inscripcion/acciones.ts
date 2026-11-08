"use server";

import { headers } from "next/headers";
import { enlaceWhatsapp, hoyEnLima, mensajeWhatsapp, type DatosInscripcion } from "@/lib/academia";
import { enviarVoucher, obtenerCurso, registrarInscripcion } from "@/lib/erp";

export type ResultadoInscripcion =
  | { ok: true; codigo: string; enlace: string }
  /** La API no respondio: la inscripcion sigue por WhatsApp con todos los datos (sin codigo). */
  | { ok: false; caida: true; error: string; enlace: string }
  | { ok: false; caida: false; error: string };

/**
 * El voucher es opcional y va aparte de la inscripcion: si falla, la inscripcion ya quedo y se sigue por WhatsApp.
 * El ERP reconoce la inscripcion por la misma clave con la que se creo.
 */
export async function adjuntarVoucher(datos: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const clave = String(datos.get("claveIdempotencia") ?? "");
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(clave)) return { ok: false, error: "No pudimos guardar el voucher." };
  const archivo = datos.get("voucher");
  if (archivo instanceof File && archivo.size > 5 * 1024 * 1024) return { ok: false, error: "El voucher pesa más de 5 MB." };
  if (archivo instanceof File && archivo.size === 0) datos.delete("voucher");
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  return enviarVoucher(datos, ip);
}

const texto = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined) || undefined;

/**
 * Envia la inscripcion al ERP desde el servidor (firmada). La validacion de verdad la hace la API (regla 7 del ERP):
 * aqui solo se limpian los campos y se arma la respuesta.
 */
export async function inscribir(entrada: DatosInscripcion & { claveIdempotencia: string; aceptaTerminos: boolean }): Promise<ResultadoInscripcion> {
  const d: DatosInscripcion = {
    curso: texto(entrada.curso, 80) ?? "",
    grupoId: texto(entrada.grupoId, 120),
    formaPago: entrada.formaPago === "COMPLETO" ? "COMPLETO" : "CUOTAS",
    alumnoNombre: texto(entrada.alumnoNombre, 120) ?? "",
    alumnoFechaNacimiento: texto(entrada.alumnoFechaNacimiento, 10) ?? "",
    alumnoDni: texto(entrada.alumnoDni, 12),
    alumnoSexo: entrada.alumnoSexo === "F" || entrada.alumnoSexo === "M" ? entrada.alumnoSexo : undefined,
    alumnoCorreo: texto(entrada.alumnoCorreo, 160),
    alumnoTelefono: texto(entrada.alumnoTelefono, 30),
    apoderadoNombre: texto(entrada.apoderadoNombre, 120),
    apoderadoDni: texto(entrada.apoderadoDni, 12),
    apoderadoCorreo: texto(entrada.apoderadoCorreo, 160),
    apoderadoTelefono: texto(entrada.apoderadoTelefono, 30),
    parentesco: texto(entrada.parentesco, 40),
    comoSeEntero: texto(entrada.comoSeEntero, 120),
    comentario: texto(entrada.comentario, 1000),
  };
  if (!entrada.aceptaTerminos) return { ok: false, caida: false, error: "Para inscribirte tienes que aceptar los términos y el tratamiento de datos." };

  // Un grupo del catalogo de respaldo no existe en el ERP: se manda sin grupo y el horario va en el comentario.
  const curso = await obtenerCurso(d.curso);
  const grupo = curso?.grupos.find((g) => g.id === d.grupoId) ?? null;
  const respaldo = d.grupoId?.startsWith("respaldo-") ?? false;
  const cuerpo = {
    ...d,
    grupoId: respaldo ? undefined : d.grupoId,
    comentario: respaldo && grupo ? [d.comentario, `Grupo elegido: ${grupo.ciclo ?? ""} ${grupo.inicio} ${grupo.dias.join("-")} ${grupo.horaInicio}`].filter(Boolean).join(" · ") : d.comentario,
    claveIdempotencia: /^[A-Za-z0-9_-]{8,80}$/.test(entrada.claveIdempotencia) ? entrada.claveIdempotencia : crypto.randomUUID(),
    aceptaTerminos: true,
    origen: "academy.devmarkpe.com/inscripcion",
  };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const r = await registrarInscripcion(cuerpo, ip);
  if (r.ok) return { ok: true, codigo: r.datos.codigo, enlace: r.datos.whatsapp.enlace };
  if (r.caida) return { ok: false, caida: true, error: r.error, enlace: enlaceWhatsapp(mensajeWhatsapp(d, curso, grupo, hoyEnLima())) };
  return { ok: false, caida: false, error: r.error };
}
