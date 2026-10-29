import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { JsonLd } from "@/components/JsonLd";
import { Boton } from "@/components/piezas";
import { TablaGrupos } from "@/components/TablaGrupos";
import { WhatsAppIcono } from "@/components/iconos-marca";
import { NOMBRE_PUBLICO, NOMBRE_TEMA, duracion, enlaceWhatsapp, formatoPrecio, precioDesde, rangoEdad } from "@/lib/academia";
import { URL_BASE } from "@/lib/datos";
import { obtenerCurso, obtenerCursos } from "@/lib/erp";

export const revalidate = 300;

export async function generateStaticParams() {
  const { cursos } = await obtenerCursos();
  return cursos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await obtenerCurso(slug);
  if (!c) return { title: "Curso no encontrado" };
  return { title: c.nombre, description: `${c.resumen} ${duracion(c)}, online y en vivo. ${NOMBRE_PUBLICO[c.publico]}, ${rangoEdad(c)}.`, alternates: { canonical: `/cursos/${c.slug}/` } };
}

/** Ficha de un curso: para quien, que aprende, temario, proyecto, grupos con fechas y precios, e inscripcion. */
export default async function FichaCurso({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await obtenerCurso(slug);
  if (!c) notFound();
  const plan = precioDesde(c);
  const abiertos = c.grupos.filter((g) => g.aceptaInscripciones);
  const preguntar = enlaceWhatsapp(`Hola DEVMARK Academy, tengo una pregunta sobre el curso «${c.nombre}».`);

  return (
    <>
      <JsonLd
        datos={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: c.nombre,
          description: c.resumen,
          url: `${URL_BASE}/cursos/${c.slug}/`,
          inLanguage: "es",
          educationalLevel: c.nivel ?? undefined,
          provider: { "@type": "EducationalOrganization", name: "DEVMARK Academy", sameAs: URL_BASE },
          hasCourseInstance: c.grupos.map((g) => ({ "@type": "CourseInstance", courseMode: "Online", startDate: g.inicio, endDate: g.fin, instructor: g.docente ? { "@type": "Person", name: g.docente } : undefined })),
          offers: plan ? { "@type": "Offer", price: plan.pagoCompleto, priceCurrency: plan.moneda, category: "Paid", availability: abiertos.length ? "https://schema.org/InStock" : "https://schema.org/PreOrder" } : undefined,
        }}
      />
      <CabeceraPagina
        migas={[
          { nombre: "Cursos", href: "/cursos/" },
          { nombre: c.nombre, href: `/cursos/${c.slug}/` },
        ]}
        bajada={c.resumen}
        acciones={
          <>
            <Boton href={abiertos.length ? "#grupos" : "/inscripcion/"} variante="light">
              {abiertos.length ? "Ver horarios e inscribirme" : "Avísame cuando abra"}
            </Boton>
            <a className="btn btn-glass" href={preguntar} target="_blank" rel="noopener noreferrer">
              <span className="btn-tile">
                <WhatsAppIcono />
              </span>
              Preguntar por WhatsApp
            </a>
          </>
        }
        aparte={
          <dl className="ficha-datos">
            <div>
              <dt>Para</dt>
              <dd>
                {NOMBRE_PUBLICO[c.publico]} · {rangoEdad(c)}
              </dd>
            </div>
            <div>
              <dt>Duración</dt>
              <dd>{duracion(c)}</dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>Online en vivo por Google Meet</dd>
            </div>
            <div>
              <dt>Tema</dt>
              <dd>
                {NOMBRE_TEMA[c.tema]}
                {c.nivel ? ` · ${c.nivel}` : ""}
              </dd>
            </div>
            <div>
              <dt>Desde</dt>
              <dd className="ficha-precio">{plan ? formatoPrecio(plan.pagoCompleto, plan.moneda) : "Consultar"}</dd>
            </div>
          </dl>
        }
      >
        {c.nombre}
      </CabeceraPagina>

      <section className="panel panel-paper">
        <div className="panel-inner ficha">
          <div className="ficha-principal">
            {c.descripcion && (
              <div className="prosa">
                {c.descripcion.split(/\n\s*\n/).map((p, i) => (
                  <p key={i} className="lead">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {c.aprendizajes.length > 0 && (
              <section>
                <h2 className="subtitulo">Lo que te llevas</h2>
                <ul className="lista-checks">
                  {c.aprendizajes.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </section>
            )}
            {c.temario.length > 0 && (
              <section>
                <h2 className="subtitulo">Temario</h2>
                <ol className="temario">
                  {c.temario.map((m, i) => (
                    <li key={m.titulo}>
                      <span className="paso-n">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{m.titulo}</h3>
                        {m.temas.length > 0 && <p className="blando">{m.temas.join(" · ")}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
          <aside className="ficha-lateral">
            {c.proyectoFinal && (
              <div className="card">
                {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
                <img src="/marca/devi/devi-patitas-exito.svg" alt="" width={80} height={77} />
                <h3>Proyecto final</h3>
                <p className="blando">{c.proyectoFinal}</p>
              </div>
            )}
            {c.requisitos && (
              <div className="card">
                <h3>Qué necesitas</h3>
                <p className="blando">{c.requisitos}</p>
              </div>
            )}
            {c.publico !== "ADULTOS" && (
              <div className="card">
                <h3>Para padres</h3>
                <p className="blando">Te inscribes tú como apoderado: recibes los avisos, ves tareas y notas en el portal y coordinas los pagos.</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="panel panel-mist" id="grupos">
        <div className="panel-inner">
          <div className="cabeza-seccion">
            <h2 className="headline">
              Horarios y <em>precios</em>
            </h2>
            <p className="lead blando">Elige tu grupo. Puedes pagar matrícula y cuotas, o todo junto con 10 % menos. El pago se coordina por WhatsApp.</p>
          </div>
          {c.grupos.length > 0 ? (
            <TablaGrupos curso={c.slug} grupos={c.grupos} />
          ) : (
            <div className="vacio">
              {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
              <img src="/marca/devi/devi-patitas-pensando.svg" alt="" width={140} height={135} />
              <p>Las próximas fechas de este curso salen en abril, con el año regular.</p>
              <a href={enlaceWhatsapp(`Hola DEVMARK Academy, avísenme cuando abran «${c.nombre}».`)} target="_blank" rel="noopener noreferrer">
                Avísame por WhatsApp cuando abra
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
