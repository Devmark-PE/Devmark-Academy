import Link from "next/link";
import { Boton, Titular } from "@/components/piezas";
import { JsonLd, preguntasLd } from "@/components/JsonLd";
import { TarjetaCurso } from "@/components/TarjetaCurso";
import { WhatsAppIcono } from "@/components/iconos-marca";
import { PUBLICOS, fechaLarga } from "@/lib/academia";
import { WHATSAPP_CONSULTA } from "@/lib/datos";
import { obtenerCursos } from "@/lib/erp";
import { CICLOS, PREGUNTAS } from "@/lib/contenido";

export const revalidate = 300;

const BANDA = ["IA para tu trabajo", "Python e IA", "Scratch", "IA para tus estudios", "Finanzas con IA", "Crea tu videojuego", "Automatiza con IA", "Excel con IA"];

const COMO = [
  ["En vivo por Google Meet", "Clases con el docente, no videos sueltos: preguntas, práctica y correcciones en el momento."],
  ["Grupos pequeños", "De 6 a 10 niños, de 6 a 12 adolescentes y hasta 20 adultos, para que nadie se quede atrás."],
  ["Cada clase grabada", "Si faltas, ves la grabación. Tareas, notas y avance quedan en tu portal."],
  ["Proyecto y certificado", "Cada curso termina con algo hecho por ti y un certificado de DEVMARK Academy."],
] as const;

/** Portada: que es la academia, rutas por edad, cursos destacados, el verano 2027, como son las clases y preguntas. */
export default async function Portada() {
  const { cursos } = await obtenerCursos();
  const destacados = cursos.filter((c) => c.destacado).slice(0, 6);
  const lista = destacados.length >= 3 ? destacados : cursos.slice(0, 6);
  const cuantos = (p: string) => cursos.filter((c) => c.publico === p).length;

  return (
    <>
      <JsonLd datos={preguntasLd(PREGUNTAS)} />
      <section className="panel panel-ink hero">
        <div className="panel-inner">
          <div className="hero-grid">
            <div className="hero-texto">
              <span className="chip entra">
                <span className="chip-ficha" aria-hidden="true">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                  </svg>
                </span>
                Verano 2027 · inscripciones abiertas
              </span>
              <h1 className="display entra-2">
                Aprende <em>inteligencia artificial</em> en vivo, con proyectos reales.
              </h1>
              <p className="lead blando entra-3">Cursos online para niños, adolescentes y adultos: IA para el trabajo y los estudios, programación y finanzas, con docentes de DEVMARK y grupos pequeños.</p>
              <div className="fila entra-3">
                <Boton href="/cursos/" variante="light">
                  Ver los cursos
                </Boton>
                <Boton href="/verano/" variante="glass" icono="calendario">
                  Calendario del verano
                </Boton>
              </div>
            </div>
            <div className="escena-hero">
              {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
              <img className="devi-hero flota-a" src="/marca/devi/devi-completo-saludo.svg" alt="Devi, la mascota de DEVMARK Academy, saludando" width={330} height={319} />
              <div className="vidrio vidrio-1 flota-b">
                {/* eslint-disable-next-line @next/next/no-img-element -- icono de Devi */}
                <img src="/marca/devi/devi-patitas-exito.svg" alt="" width={44} height={43} />
                <div>
                  <b>Clases en vivo</b>
                  <span>por Google Meet, con grabación</span>
                </div>
              </div>
              <div className="vidrio vidrio-2 flota-a">
                {/* eslint-disable-next-line @next/next/no-img-element -- icono de Devi */}
                <img src="/marca/devi/devi-patitas-pensando.svg" alt="" width={44} height={43} />
                <div>
                  <b>Primer día: 4 de enero</b>
                  <span>Grupos pequeños por edad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="banda" aria-hidden="true">
        <div className="banda-pista">
          {[...BANDA, ...BANDA].map((t, i) => (
            <span key={i} className={`banda-item${i >= BANDA.length ? " banda-dup" : ""}`}>
              <span className="banda-ficha">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                </svg>
              </span>
              {t}
            </span>
          ))}
        </div>
      </div>

      <section className="panel panel-paper" id="para-quien">
        <div className="panel-inner">
          <Titular bajada="Cada edad tiene su ruta: los niños crean jugando, los adolescentes estudian y programan, y los adultos aplican la IA en su trabajo y su negocio.">
            Un curso para <em>cada edad</em>
          </Titular>
          <div className="rejilla-3">
            {PUBLICOS.map((p) => (
              <Link key={p.clave} href={`/cursos/?para=${p.clave}`} className="ruta-edad aparece">
                {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
                <img src={p.devi} alt="" width={120} height={116} />
                <div>
                  <span className="pastilla">{p.edades}</span>
                  <h3>{p.nombre}</h3>
                  <p className="blando">{p.texto}</p>
                </div>
                <span className="tc-ver">
                  {cuantos(p.clave)} cursos <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel panel-mist">
        <div className="panel-inner">
          <Titular bajada="Los más pedidos: IA para el trabajo y los estudios, y programación desde cero.">
            Cursos <em>destacados</em>
          </Titular>
          <div className="rejilla-cursos">
            {lista.map((c) => (
              <TarjetaCurso key={c.slug} curso={c} />
            ))}
          </div>
          <div className="fila" style={{ marginTop: 28 }}>
            <Boton href="/cursos/" variante="ink">
              Ver los {cursos.length} cursos
            </Boton>
          </div>
        </div>
      </section>

      <section className="panel panel-ink">
        <div className="panel-inner">
          <Titular bajada="Tres ciclos de cuatro semanas. En enero y febrero, los niños y adolescentes en las mañanas; en marzo pasan a sábado. Los adultos, de noche.">
            Verano 2027, <em>de enero a marzo</em>
          </Titular>
          <ol className="ciclos">
            {CICLOS.map((c) => (
              <li key={c.nombre} className="ciclo aparece">
                <span className="ciclo-n">{c.nombre}</span>
                <b>
                  {fechaLarga(c.inicio)} al {fechaLarga(c.fin)}
                </b>
                <span className="blando">{c.nota}</span>
              </li>
            ))}
          </ol>
          <div className="fila" style={{ marginTop: 28 }}>
            <Boton href="/verano/" variante="light" icono="calendario">
              Ver todos los horarios
            </Boton>
          </div>
        </div>
      </section>

      <section className="panel panel-paper">
        <div className="panel-inner">
          <Titular bajada="Lo que hace la diferencia frente a un curso grabado.">
            Así son las <em>clases</em>
          </Titular>
          <div className="rejilla-como">
            {COMO.map(([t, d], i) => (
              <div key={t} className="card aparece">
                <span className="paso-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p className="blando" style={{ fontSize: 15 }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
          <div className="fila" style={{ marginTop: 28 }}>
            <Boton href="/como-funciona/" variante="line">
              Cómo funciona la inscripción y el pago
            </Boton>
          </div>
        </div>
      </section>

      <section className="panel panel-ink" id="preguntas">
        <div className="panel-inner">
          <Titular>
            Preguntas <em>frecuentes</em>
          </Titular>
          <div className="faq">
            {PREGUNTAS.map(([p, r]) => (
              <details key={p}>
                <summary>{p}</summary>
                <p>{r}</p>
              </details>
            ))}
          </div>
          <div className="fila" style={{ marginTop: 32 }}>
            <a className="btn btn-light" href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer">
              <span className="btn-tile">
                <WhatsAppIcono />
              </span>
              Otra pregunta por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
