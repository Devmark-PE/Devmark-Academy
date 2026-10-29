import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { TarjetaCurso } from "@/components/TarjetaCurso";
import { NOMBRE_PUBLICO, NOMBRE_TEMA, PUBLICOS, type Publico, type Tema } from "@/lib/academia";
import { obtenerCursos } from "@/lib/erp";

export const metadata: Metadata = {
  title: "Cursos de IA y programación",
  description: "Todos los cursos de DEVMARK Academy para niños, adolescentes y adultos: inteligencia artificial, programación y finanzas con IA, online y en vivo.",
  alternates: { canonical: "/cursos/" },
};

const TEMAS: Tema[] = ["IA", "PROGRAMACION", "ECONOMIA"];

/** Catalogo con filtros por edad y tema (por la direccion: ?para=NINOS&tema=IA, se pueden compartir). */
export default async function Cursos({ searchParams }: { searchParams: Promise<{ para?: string; tema?: string }> }) {
  const { para, tema } = await searchParams;
  const publico = PUBLICOS.some((p) => p.clave === para) ? (para as Publico) : null;
  const filtroTema = TEMAS.includes(tema as Tema) ? (tema as Tema) : null;
  const { cursos } = await obtenerCursos();
  const lista = cursos.filter((c) => (!publico || c.publico === publico) && (!filtroTema || c.tema === filtroTema));
  const enlace = (p: Publico | null, t: Tema | null) => {
    const q = new URLSearchParams();
    if (p) q.set("para", p);
    if (t) q.set("tema", t);
    return `/cursos/${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Cursos", href: "/cursos/" }]} bajada="Online y en vivo, con grupos pequeños por edad, proyecto final y certificado. Elige por edad o por tema.">
        Cursos de <em>IA y programación</em>
      </CabeceraPagina>
      <section className="panel panel-mist">
        <div className="panel-inner">
          <div className="filtros" role="group" aria-label="Filtrar cursos">
            <div className="seg-enlaces" aria-label="Para quién">
              <Link href={enlace(null, filtroTema)} aria-current={!publico ? "true" : undefined}>
                Todas las edades
              </Link>
              {PUBLICOS.map((p) => (
                <Link key={p.clave} href={enlace(p.clave, filtroTema)} aria-current={publico === p.clave ? "true" : undefined}>
                  {p.nombre} <span className="blando">{p.edades}</span>
                </Link>
              ))}
            </div>
            <div className="seg-enlaces" aria-label="Tema">
              <Link href={enlace(publico, null)} aria-current={!filtroTema ? "true" : undefined}>
                Todos los temas
              </Link>
              {TEMAS.map((t) => (
                <Link key={t} href={enlace(publico, t)} aria-current={filtroTema === t ? "true" : undefined}>
                  {NOMBRE_TEMA[t]}
                </Link>
              ))}
            </div>
          </div>
          <p className="blando" style={{ margin: "20px 0" }} aria-live="polite">
            {lista.length} curso{lista.length === 1 ? "" : "s"}
            {publico ? ` para ${NOMBRE_PUBLICO[publico].toLowerCase()}` : ""}
            {filtroTema ? ` de ${NOMBRE_TEMA[filtroTema].toLowerCase()}` : ""}
          </p>
          {lista.length === 0 ? (
            <div className="vacio">
              {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
              <img src="/marca/devi/devi-patitas-buscando.svg" alt="" width={140} height={135} />
              <p>No encontramos cursos con esos filtros.</p>
              <Link href="/cursos/">Ver todos los cursos</Link>
            </div>
          ) : (
            <div className="rejilla-cursos">
              {lista.map((c) => (
                <TarjetaCurso key={c.slug} curso={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
