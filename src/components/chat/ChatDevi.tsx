"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { enviarMensaje, leerConversacion, pedirAsesor, type EstadoChat, type MensajeChat } from "./acciones";

const CLAVE = "devi-chat-academia";
type Guardado = { visitante: string; conversacionId: string | null; estado: EstadoChat; mensajes: MensajeChat[] };

const PREGUNTAS = ["¿Qué curso le recomiendas a mi hijo de 9 años?", "¿Cuánto cuesta y cómo se paga?", "¿Cuándo empiezan las clases?"];

function token(): string {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function cargar(): Guardado {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE) ?? "null") as Guardado | null;
    if (g && /^[A-Za-z0-9_-]{20,100}$/.test(g.visitante)) return { ...g, mensajes: (g.mensajes ?? []).slice(-40) };
  } catch {
    // Sin almacenamiento: conversacion de una sola visita.
  }
  return { visitante: token(), conversacionId: null, estado: "IA", mensajes: [] };
}

/**
 * Devi en la esquina del sitio: responde con la IA del ERP (catalogo, precios, horarios y cupos reales) y, si la
 * persona quiere, pasa la conversacion a un asesor del equipo. Sigue estando el WhatsApp, dentro del chat.
 */
export function ChatDevi({ whatsapp }: { whatsapp: string }) {
  const [abierto, setAbierto] = useState(false);
  const [g, setG] = useState<Guardado | null>(null);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formAsesor, setFormAsesor] = useState(false);
  const [contacto, setContacto] = useState({ nombre: "", telefono: "" });
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!g) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ ...g, mensajes: g.mensajes.slice(-40) }));
    } catch {
      // Modo privado: no pasa nada.
    }
  }, [g]);
  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: "smooth" });
  }, [g?.mensajes.length, pensando, abierto]);
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [abierto]);

  // Con un asesor (o esperandolo), se consultan los mensajes nuevos cada pocos segundos mientras el chat esta abierto.
  const conPersona = g?.estado === "ESPERANDO_ASESOR" || g?.estado === "CON_ASESOR";
  const leer = useCallback(async () => {
    if (!g?.conversacionId) return;
    const ultimo = [...g.mensajes].reverse().find((m) => !m.id.startsWith("local-"))?.creadoEn ?? null;
    const r = await leerConversacion({ visitante: g.visitante, conversacionId: g.conversacionId, despues: ultimo });
    if (!r.ok) return;
    setG((p) => (p ? { ...p, estado: r.estado, mensajes: [...p.mensajes, ...r.mensajes.filter((m) => m.autor !== "VISITANTE" && !p.mensajes.some((x) => x.id === m.id))] } : p));
  }, [g]);
  useEffect(() => {
    if (!abierto || !conPersona) return;
    const t = setInterval(() => void leer(), 5000);
    return () => clearInterval(t);
  }, [abierto, conPersona, leer]);

  async function enviar(pregunta: string) {
    if (!g || pensando || !pregunta.trim()) return;
    // Lo propio se pinta al momento; su hora no sirve para pedir lo nuevo (es la del navegador, no la del servidor).
    const propio: MensajeChat = { id: `local-${g.mensajes.length}`, autor: "VISITANTE", texto: pregunta.trim(), creadoEn: "" };
    setG({ ...g, mensajes: [...g.mensajes, propio] });
    setTexto("");
    setError(null);
    setPensando(true);
    const r = await enviarMensaje({ visitante: g.visitante, conversacionId: g.conversacionId, texto: pregunta, pagina: window.location.pathname });
    setPensando(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setG((p) => (p ? { ...p, conversacionId: r.conversacionId, estado: r.estado, mensajes: r.respuesta ? [...p.mensajes, r.respuesta] : p.mensajes } : p));
  }

  async function asesor(e: React.FormEvent) {
    e.preventDefault();
    if (!g?.conversacionId) return;
    setPensando(true);
    const r = await pedirAsesor({ visitante: g.visitante, conversacionId: g.conversacionId, ...contacto });
    setPensando(false);
    if (!r.ok) return setError(r.error);
    setFormAsesor(false);
    setG({ ...g, estado: r.estado });
  }

  return (
    <>
      <button type="button" className="chat-boton" aria-expanded={abierto} aria-controls="chat-devi" onClick={() => {
          if (!g) setG(cargar());
          setAbierto((v) => !v);
        }} data-abierto={abierto}>
        {!abierto && (
          <span className="flotante-burbuja">
            <b>¿Dudas?</b>
            <span>Pregúntale a Devi</span>
          </span>
        )}
        <span className="flotante-devi chat-boton-devi">
          {abierto ? (
            <span className="chat-cerrar" aria-hidden="true">
              ×
            </span>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */
            <img src="/marca/devi/devi-base-saludo.svg" alt="" width={64} height={62} />
          )}
        </span>
        <span className="sr-only">{abierto ? "Cerrar el chat" : "Abrir el chat con Devi"}</span>
      </button>

      <section id="chat-devi" className="chat" hidden={!abierto} aria-label="Chat con Devi">
        <header className="chat-cabeza">
          {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
          <img src={`/marca/devi/devi-base-${pensando ? "pensando" : "reposo"}.svg`} alt="" width={40} height={39} />
          <div>
            <b>Devi</b>
            <span>{g?.estado === "CON_ASESOR" ? "Te atiende una persona del equipo" : g?.estado === "ESPERANDO_ASESOR" ? "Avisamos al equipo: ya te responden" : "Asistente de DEVMARK Academy"}</span>
          </div>
        </header>

        <div className="chat-lista" ref={lista} aria-live="polite">
          <p className="chat-msj chat-msj--ia">¡Hola! Soy Devi 👋 Te ayudo a elegir curso, ver horarios y precios, o resolver cualquier duda sobre la academia.</p>
          {g?.mensajes.map((m) => (
            <p key={m.id} className={`chat-msj chat-msj--${m.autor === "VISITANTE" ? "yo" : m.autor === "ASESOR" ? "asesor" : "ia"}`}>
              {m.autor === "ASESOR" && <b className="chat-quien">{m.asesor ?? "Equipo"}</b>}
              {m.texto}
            </p>
          ))}
          {pensando && (
            <p className="chat-msj chat-msj--ia chat-pensando" aria-label="Devi está escribiendo">
              <span />
              <span />
              <span />
            </p>
          )}
          {error && <p className="chat-error">{error}</p>}
          {g && g.mensajes.length === 0 && (
            <div className="chat-sugerencias">
              {PREGUNTAS.map((p) => (
                <button key={p} type="button" onClick={() => enviar(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {formAsesor ? (
          <form className="chat-asesor" onSubmit={asesor}>
            <p>Deja tu nombre y celular (opcional) y alguien del equipo sigue esta conversación.</p>
            <input value={contacto.nombre} onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })} placeholder="Tu nombre" maxLength={120} aria-label="Tu nombre" autoComplete="name" />
            <input value={contacto.telefono} onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })} placeholder="Celular" maxLength={30} inputMode="tel" aria-label="Tu celular" autoComplete="tel" />
            <div className="chat-fila">
              <button type="button" className="chat-enlace" onClick={() => setFormAsesor(false)}>
                Volver
              </button>
              <button type="submit" className="chat-enviar" disabled={pensando}>
                Llamar a un asesor
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="chat-acciones">
              {g?.estado === "IA" && g.conversacionId && (
                <button type="button" className="chat-enlace" onClick={() => setFormAsesor(true)}>
                  Hablar con un asesor
                </button>
              )}
              <a className="chat-enlace" href={whatsapp} target="_blank" rel="noopener noreferrer">
                Seguir por WhatsApp
              </a>
            </div>
            <form
              className="chat-escribir"
              onSubmit={(e) => {
                e.preventDefault();
                void enviar(texto);
              }}
            >
              <input value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={1000} placeholder="Escribe tu pregunta…" aria-label="Tu pregunta" />
              <button type="submit" className="chat-enviar" disabled={pensando || !texto.trim()}>
                Enviar
              </button>
            </form>
          </>
        )}
      </section>
    </>
  );
}
