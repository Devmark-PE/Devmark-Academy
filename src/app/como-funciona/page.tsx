import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { JsonLd, preguntasLd } from "@/components/JsonLd";
import { Boton } from "@/components/piezas";
import { DESCUENTOS, PREGUNTAS } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: "Cómo inscribirte en DEVMARK Academy, cómo se paga (matrícula y cuotas, o pago completo), cómo son las clases en vivo, el portal para padres y alumnos y los certificados.",
  alternates: { canonical: "/como-funciona/" },
};

const PASOS = [
  ["Eliges tu curso y tu grupo", "En el catálogo ves las fechas, el horario, los cupos y el precio de cada grupo."],
  ["Llenas la inscripción", "Datos del alumno y, si es menor de edad, de su madre, padre o apoderado, que es quien gestiona la cuenta."],
  ["Coordinamos el pago por WhatsApp", "Al enviar se abre WhatsApp con todos tus datos. Ahí te pasamos los medios de pago: Yape, Plin, depósito o transferencia."],
  ["Recibes tu acceso", "Con el pago confirmado, te enviamos el enlace de Google Meet de tu grupo y tu acceso al portal."],
  ["Clases en vivo y portal", "Clases en vivo con el docente; en el portal quedan las grabaciones, las tareas, las notas y tus pagos."],
  ["Proyecto y certificado", "Al final presentas tu proyecto y recibes el certificado de DEVMARK Academy."],
] as const;

/** Inscripcion, pagos, clases, portal y certificados, explicados en una sola pagina. */
export default function ComoFunciona() {
  return (
    <>
      <JsonLd datos={preguntasLd(PREGUNTAS)} />
      <CabeceraPagina
        migas={[{ nombre: "Cómo funciona", href: "/como-funciona/" }]}
        bajada="De la inscripción al certificado, en seis pasos. Sin pagos en línea por ahora: todo se coordina por WhatsApp con una persona del equipo."
        acciones={
          <Boton href="/inscripcion/" variante="light">
            Inscribirme
          </Boton>
        }
      >
        Cómo <em>funciona</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner">
          <ol className="pasos pasos-grid">
            {PASOS.map(([t, d], i) => (
              <li key={t} className="aparece">
                <span className="paso-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{t}</h3>
                  <p className="blando" style={{ fontSize: 15 }}>
                    {d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="panel panel-mist">
        <div className="panel-inner dos-col" style={{ alignItems: "start" }}>
          <div>
            <div className="cabeza-seccion">
              <h2 className="headline">
                Formas de <em>pago</em>
              </h2>
            </div>
            <div className="apilado-chico">
              <div className="card">
                <h3>Matrícula y cuotas</h3>
                <p className="blando">La matrícula (S/ 50) reserva tu cupo. Las cuotas vencen al inicio del curso y cada dos semanas, siempre antes de la última clase.</p>
              </div>
              <div className="card">
                <h3>Pago completo</h3>
                <p className="blando">Un solo pago antes del inicio, sin matrícula y con 10 % menos que la matrícula y las cuotas.</p>
              </div>
              {DESCUENTOS.map(([t, d]) => (
                <div key={t} className="card">
                  <h3>{t}</h3>
                  <p className="blando">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="cabeza-seccion">
              <h2 className="headline">
                El <em>portal</em>
              </h2>
              <p className="lead blando">
                Cada familia y cada alumno adulto tiene su cuenta en <b>portal.devmarkpe.com</b>.
              </p>
            </div>
            <ul className="lista-checks">
              <li>Las clases del grupo, con su grabación</li>
              <li>Tareas: verlas y subirlas</li>
              <li>Notas, asistencia y avance</li>
              <li>Avisos del docente</li>
              <li>Lo pagado y lo pendiente</li>
              <li>El certificado al terminar</li>
            </ul>
            <p className="blando" style={{ marginTop: 16, fontSize: 15 }}>
              Si el alumno es menor de edad, la cuenta es de su madre, padre o apoderado: es quien ve todo y sube las tareas.
            </p>
          </div>
        </div>
      </section>
      <section className="panel panel-ink">
        <div className="panel-inner">
          <div className="cabeza-seccion">
            <h2 className="headline">
              Preguntas <em>frecuentes</em>
            </h2>
          </div>
          <div className="faq">
            {PREGUNTAS.map(([p, r]) => (
              <details key={p}>
                <summary>{p}</summary>
                <p>{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
