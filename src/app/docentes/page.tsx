import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { DOCENTES } from "@/lib/contenido";
import { obtenerDocentes } from "@/lib/erp";

export const metadata: Metadata = {
  title: "Docentes",
  description: "Quién enseña en DEVMARK Academy: el equipo de DEVMARK, que usa la inteligencia artificial y la programación en proyectos reales.",
  alternates: { canonical: "/docentes/" },
};

// Los perfiles los llena cada docente en el portal y la administracion los publica: se refresca cada 5 minutos.
export const revalidate = 300;

const POSES = ["/marca/devi/devi-completo-hablando.svg", "/marca/devi/devi-completo-exito.svg", "/marca/devi/devi-completo-saludo.svg", "/marca/devi/devi-completo-senalando.svg"];

/** Quien ensena: los perfiles publicados desde el ERP; si aun no hay (o la API no responde), el texto base. */
export default async function Docentes() {
  const publicados = await obtenerDocentes();
  const lista = publicados?.length
    ? publicados.map((d, i) => ({ nombre: d.nombre, rol: d.especialidad ?? "Docente", texto: d.bio ?? "", foto: d.foto, devi: POSES[i % POSES.length]!, cursos: d.cursos }))
    : DOCENTES.map((d) => ({ ...d, foto: null as string | null, cursos: [] as { slug: string; nombre: string }[] }));
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Docentes", href: "/docentes/" }]} bajada="Enseñamos lo que usamos todos los días en DEVMARK, en proyectos reales para empresas.">
        Quién <em>enseña</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner">
          <div className="docentes">
            {lista.map((d) => (
              <article key={d.nombre} className="docente aparece">
                {d.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element -- foto firmada del almacenamiento del ERP
                  <img className="docente-foto" src={d.foto} alt={`Foto de ${d.nombre}`} width={200} height={200} />
                ) : (
                  <div className="docente-vista">
                    {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
                    <img src={d.devi} alt="" width={180} height={174} />
                  </div>
                )}
                <div className="docente-texto">
                  <h2>{d.nombre}</h2>
                  <p className="pastilla">{d.rol}</p>
                  {d.texto && <p className="blando">{d.texto}</p>}
                  {d.cursos.length > 0 && (
                    <p className="docente-cursos">
                      {d.cursos.map((c) => (
                        <Link key={c.slug} href={`/cursos/${c.slug}/`}>
                          {c.nombre}
                        </Link>
                      ))}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
