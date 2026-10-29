import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { DOCENTES } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Docentes",
  description: "Quién enseña en DEVMARK Academy: el equipo de DEVMARK, que usa la inteligencia artificial y la programación en proyectos reales.",
  alternates: { canonical: "/docentes/" },
};

/** Quien ensena. Cada docente completara su perfil desde el portal (fase 2); por ahora, el texto base. */
export default function Docentes() {
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Docentes", href: "/docentes/" }]} bajada="Enseñamos lo que usamos todos los días en DEVMARK, en proyectos reales para empresas.">
        Quién <em>enseña</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner">
          <div className="docentes">
            {DOCENTES.map((d) => (
              <article key={d.nombre} className="docente aparece">
                <div className="docente-vista">
                  {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
                  <img src={d.devi} alt="" width={180} height={174} />
                </div>
                <div className="docente-texto">
                  <h2>{d.nombre}</h2>
                  <p className="pastilla">{d.rol}</p>
                  <p className="blando">{d.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
