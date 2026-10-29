import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { WhatsAppIcono } from "@/components/iconos-marca";
import { enlaceWhatsapp } from "@/lib/academia";

export const metadata: Metadata = {
  title: "Clases privadas de IA y programación",
  description: "Clases particulares 1 a 1 de inteligencia artificial, programación, Python, Excel y finanzas con IA, online y en vivo, para cualquier edad. Desde S/ 55 la hora.",
  alternates: { canonical: "/clases-privadas/" },
};

const PRECIOS = [
  ["1 a 1", "S/ 60", "la hora", "Una persona, el tema que necesites."],
  ["Paquete de 8 horas", "S/ 440", "S/ 55 la hora", "Para avanzar un proyecto o preparar un curso."],
  ["Dos alumnos", "S/ 80", "la hora, por los dos", "Hermanos, amigos o compañeros de trabajo."],
] as const;

const TEMAS = [
  "Cualquier curso del catálogo, a tu ritmo",
  "Refuerzo de programación del colegio o la universidad",
  "Tu propio proyecto: una web, una app o una automatización",
  "IA aplicada a tu trabajo o a tu negocio",
  "Excel, datos y finanzas con IA",
  "Preparación para un curso o un examen",
];

const PEDIR = enlaceWhatsapp("Hola DEVMARK Academy, quiero clases privadas. Tema: ");

/** Clases particulares: temas, precios y como agendarlas. */
export default function ClasesPrivadas() {
  return (
    <>
      <CabeceraPagina
        migas={[{ nombre: "Clases privadas", href: "/clases-privadas/" }]}
        bajada="Clases 1 a 1 en vivo por Google Meet, en el horario que te acomode y con el tema que necesites. Para cualquier edad; los menores, con su apoderado."
        acciones={
          <a className="btn btn-light" href={PEDIR} target="_blank" rel="noopener noreferrer">
            <span className="btn-tile">
              <WhatsAppIcono />
            </span>
            Pedir clases privadas
          </a>
        }
      >
        Clases <em>a tu medida</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner">
          <div className="cabeza-seccion">
            <h2 className="headline">
              <em>Precios</em>
            </h2>
          </div>
          <div className="rejilla-3">
            {PRECIOS.map(([t, precio, unidad, d]) => (
              <div key={t} className="card precio-card">
                <h3>{t}</h3>
                <p className="precio-grande">
                  {precio} <span className="blando">{unidad}</span>
                </p>
                <p className="blando">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel panel-mist">
        <div className="panel-inner dos-col">
          <div>
            <div className="cabeza-seccion">
              <h2 className="headline">
                ¿Qué <em>temas</em>?
              </h2>
              <p className="lead blando">Nos cuentas qué necesitas y armamos las clases contigo. Agendamos por WhatsApp según tu disponibilidad.</p>
            </div>
            <ul className="lista-checks">
              {TEMAS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="cta-vista">
            {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
            <img src="/marca/devi/devi-completo-hablando.svg" alt="Devi explicando una clase" width={260} height={251} />
          </div>
        </div>
      </section>
    </>
  );
}
