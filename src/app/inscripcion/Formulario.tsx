"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { WhatsAppIcono } from "@/components/iconos-marca";
import { MAYORIA_DE_EDAD, NOMBRE_PUBLICO, edadEn, fechaLarga, formatoPrecio, hoyEnLima, textoDias, totalEnCuotas, type Curso, type FormaPago } from "@/lib/academia";
import { inscribir, type ResultadoInscripcion } from "./acciones";

const PARENTESCOS = ["Madre", "Padre", "Abuela o abuelo", "Tía o tío", "Otro apoderado"];
const ORIGENES = ["Instagram", "Facebook", "TikTok", "Google", "Un amigo o familiar", "El colegio", "devmarkpe.com", "Otro"];

/** Formulario de inscripcion. La API valida de verdad; aqui se ayuda a llenarlo bien (menor = datos del apoderado). */
export default function Formulario({ cursos, cursoInicial, grupoInicial }: { cursos: Curso[]; cursoInicial: string | null; grupoInicial: string | null }) {
  const [slug, setSlug] = useState(cursos.some((c) => c.slug === cursoInicial) ? cursoInicial! : "");
  const curso = cursos.find((c) => c.slug === slug) ?? null;
  const abiertos = useMemo(() => curso?.grupos.filter((g) => g.aceptaInscripciones) ?? [], [curso]);
  const [grupoId, setGrupoId] = useState(grupoInicial ?? "");
  const grupo = abiertos.find((g) => g.id === grupoId) ?? (abiertos.length === 1 ? abiertos[0]! : null);
  const [forma, setForma] = useState<FormaPago>("CUOTAS");
  const [nacimiento, setNacimiento] = useState("");
  const [clave] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState<ResultadoInscripcion | null>(null);
  const [enviando, iniciar] = useTransition();
  const hoy = hoyEnLima();
  const edad = nacimiento ? edadEn(nacimiento, hoy) : null;
  const menor = edad !== null && edad < MAYORIA_DE_EDAD;
  const fueraDeRango = curso && edad !== null && ((curso.edadMin !== null && edad < curso.edadMin) || (curso.edadMax !== null && edad > curso.edadMax));

  function enviar(f: FormData) {
    setError(null);
    if (!curso) return setError("Elige un curso.");
    if (abiertos.length > 0 && !grupo) return setError("Elige el grupo (horario) que prefieres.");
    const v = (k: string) => String(f.get(k) ?? "").trim();
    iniciar(async () => {
      const r = await inscribir({
        claveIdempotencia: clave,
        curso: curso.slug,
        grupoId: grupo?.id,
        formaPago: forma,
        alumnoNombre: v("alumnoNombre"),
        alumnoFechaNacimiento: nacimiento,
        alumnoCorreo: menor ? undefined : v("alumnoCorreo"),
        alumnoTelefono: menor ? undefined : v("alumnoTelefono"),
        apoderadoNombre: menor ? v("apoderadoNombre") : undefined,
        apoderadoDni: menor ? v("apoderadoDni") : undefined,
        apoderadoCorreo: menor ? v("apoderadoCorreo") : undefined,
        apoderadoTelefono: menor ? v("apoderadoTelefono") : undefined,
        parentesco: menor ? v("parentesco") : undefined,
        comoSeEntero: v("comoSeEntero"),
        comentario: v("comentario"),
        aceptaTerminos: f.get("acepta") === "on",
      });
      if (r.ok || r.caida) {
        setListo(r);
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Se abre en otra pestana; si el navegador la bloquea (paso tras esperar a la API), se va directo a WhatsApp.
        const ventana = window.open(r.enlace, "_blank");
        if (ventana) ventana.opener = null;
        else window.location.href = r.enlace;
      } else setError(r.error);
    });
  }

  if (listo && (listo.ok || listo.caida)) {
    return (
      <div className="listo" role="status">
        {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
        <img src="/marca/devi/devi-completo-exito.svg" alt="" width={200} height={193} />
        <h2 className="headline">{listo.ok ? <>¡Listo! Tu código es <em>{listo.codigo}</em></> : <>Casi listo: <em>envíanos el WhatsApp</em></>}</h2>
        <p className="lead blando">
          {listo.ok
            ? "Recibimos tu inscripción. Se abrió WhatsApp con todos tus datos: envía el mensaje y te respondemos con los medios de pago."
            : "Nuestro sistema no respondió, pero no pierdes nada: se abrió WhatsApp con todos tus datos. Envía el mensaje y seguimos por ahí."}
        </p>
        <div className="fila">
          <a className="btn btn-ink" href={listo.enlace} target="_blank" rel="noopener noreferrer">
            <span className="btn-tile">
              <WhatsAppIcono />
            </span>
            Abrir WhatsApp
          </a>
          <Link className="btn btn-line" href="/cursos/">
            <span className="btn-tile" aria-hidden="true">
              ←
            </span>
            Volver a los cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={enviar} className="form-ins" noValidate={false}>
      <fieldset className="bloque">
        <legend>1. Curso y horario</legend>
        <label className="campo">
          <span>Curso</span>
          <select required value={slug} onChange={(e) => (setSlug(e.target.value), setGrupoId(""))}>
            <option value="" disabled>
              Elige un curso
            </option>
            {(["NINOS", "ADOLESCENTES", "ADULTOS"] as const).map((p) => (
              <optgroup key={p} label={NOMBRE_PUBLICO[p]}>
                {cursos
                  .filter((c) => c.publico === p)
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nombre}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        {curso && abiertos.length === 0 && (
          <p className="nota">Este curso aún no tiene grupos abiertos. Envía la inscripción igual y te avisamos por WhatsApp cuando abra.</p>
        )}
        {abiertos.length > 0 && (
          <div className="opciones" role="radiogroup" aria-label="Grupo">
            {abiertos.map((g) => (
              <label key={g.id} className={`opcion${grupo?.id === g.id ? " activa" : ""}`}>
                <input type="radio" name="grupo" value={g.id} checked={grupo?.id === g.id} onChange={() => setGrupoId(g.id)} />
                <span>
                  <b>{g.ciclo ?? "Grupo"}</b>
                  <span>
                    Desde el {fechaLarga(g.inicio)} · {textoDias(g.dias)} de {g.horaInicio} a {g.horaFin}
                  </span>
                  <span className="blando">{g.cuposLibres} cupos libres</span>
                </span>
              </label>
            ))}
          </div>
        )}
        {grupo && (
          <div className="opciones" role="radiogroup" aria-label="Forma de pago">
            <label className={`opcion${forma === "CUOTAS" ? " activa" : ""}`}>
              <input type="radio" name="forma" checked={forma === "CUOTAS"} onChange={() => setForma("CUOTAS")} />
              <span>
                <b>Matrícula y cuotas: {formatoPrecio(totalEnCuotas(grupo.plan), grupo.plan.moneda)}</b>
                <span className="blando">
                  Matrícula {formatoPrecio(grupo.plan.matricula, grupo.plan.moneda)} + {grupo.plan.cuotas.length} cuotas de {formatoPrecio(grupo.plan.cuotas[0]?.monto ?? 0, grupo.plan.moneda)}
                </span>
              </span>
            </label>
            <label className={`opcion${forma === "COMPLETO" ? " activa" : ""}`}>
              <input type="radio" name="forma" checked={forma === "COMPLETO"} onChange={() => setForma("COMPLETO")} />
              <span>
                <b>Pago completo: {formatoPrecio(grupo.plan.pagoCompleto, grupo.plan.moneda)}</b>
                <span className="blando">Ahorras {formatoPrecio(Math.max(0, totalEnCuotas(grupo.plan) - grupo.plan.pagoCompleto), grupo.plan.moneda)}</span>
              </span>
            </label>
          </div>
        )}
      </fieldset>

      <fieldset className="bloque">
        <legend>2. Alumno</legend>
        <div className="dos-campos">
          <label className="campo">
            <span>Nombre completo del alumno</span>
            <input name="alumnoNombre" required minLength={3} maxLength={120} autoComplete="off" />
          </label>
          <label className="campo">
            <span>Fecha de nacimiento</span>
            <input type="date" required value={nacimiento} max={hoy} onChange={(e) => setNacimiento(e.target.value)} />
          </label>
        </div>
        {edad !== null && (
          <p className="nota">
            {edad} años.{" "}
            {menor ? "Como es menor de edad, se inscribe con su madre, padre o apoderado, que tendrá la cuenta del portal." : "Te inscribes con tus propios datos."}
            {fueraDeRango && ` Ojo: este curso es para ${curso!.edadMin ?? ""}${curso!.edadMax ? ` a ${curso!.edadMax}` : "+"} años; te ayudamos a elegir el mejor por WhatsApp.`}
          </p>
        )}
        {edad !== null && !menor && (
          <div className="dos-campos">
            <label className="campo">
              <span>Tu WhatsApp</span>
              <input name="alumnoTelefono" type="tel" required pattern="[0-9+()\s-]{6,30}" placeholder="999 888 777" autoComplete="tel" />
            </label>
            <label className="campo">
              <span>Tu correo</span>
              <input name="alumnoCorreo" type="email" required maxLength={160} autoComplete="email" />
            </label>
          </div>
        )}
      </fieldset>

      {menor && (
        <fieldset className="bloque">
          <legend>3. Madre, padre o apoderado</legend>
          <p className="nota">Debe ser mayor de edad. Es quien gestiona el portal, recibe los avisos y coordina los pagos.</p>
          <div className="dos-campos">
            <label className="campo">
              <span>Nombre completo</span>
              <input name="apoderadoNombre" required minLength={3} maxLength={120} autoComplete="name" />
            </label>
            <label className="campo">
              <span>Parentesco</span>
              <select name="parentesco" defaultValue="Madre">
                {PARENTESCOS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="campo">
              <span>DNI o carné de extranjería</span>
              <input name="apoderadoDni" required pattern="[A-Za-z0-9]{8,12}" inputMode="numeric" maxLength={12} />
            </label>
            <label className="campo">
              <span>WhatsApp</span>
              <input name="apoderadoTelefono" type="tel" required pattern="[0-9+()\s-]{6,30}" placeholder="999 888 777" autoComplete="tel" />
            </label>
            <label className="campo">
              <span>Correo (será su usuario del portal)</span>
              <input name="apoderadoCorreo" type="email" required maxLength={160} autoComplete="email" />
            </label>
          </div>
        </fieldset>
      )}

      <fieldset className="bloque">
        <legend>{menor ? "4" : "3"}. Para terminar</legend>
        <div className="dos-campos">
          <label className="campo">
            <span>¿Cómo nos conociste? (opcional)</span>
            <select name="comoSeEntero" defaultValue="">
              <option value="">Elige una opción</option>
              {ORIGENES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Comentario (opcional)</span>
            <input name="comentario" maxLength={1000} placeholder="Algo que debamos saber" />
          </label>
        </div>
        <label className="check">
          <input type="checkbox" name="acepta" required />
          <span>
            Acepto los <Link href="/terminos/" target="_blank">términos</Link> y el <Link href="/privacidad/" target="_blank">tratamiento de datos</Link>
            {menor ? " del menor, como su madre, padre o apoderado" : ""}.
          </span>
        </label>
      </fieldset>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="fila">
        <button type="submit" className="btn btn-ink" disabled={enviando}>
          <span className="btn-tile">
            <WhatsAppIcono />
          </span>
          {enviando ? "Enviando…" : "Inscribirme y coordinar el pago"}
        </button>
      </div>
      <p className="nota">Al enviar se abre WhatsApp (+51 975 646 074) con todos los datos. No se cobra nada en esta página.</p>
    </form>
  );
}
