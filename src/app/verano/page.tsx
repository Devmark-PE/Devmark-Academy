import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { Boton } from "@/components/piezas";
import { NOMBRE_PUBLICO, fechaLarga, formatoPrecio, textoDias, type Curso, type Grupo } from "@/lib/academia";
import { obtenerCursos } from "@/lib/erp";
import { CICLOS, DESCUENTOS } from "@/lib/contenido";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cursos de verano 2027",
  description: "Cursos de verano 2027 de inteligencia artificial y programación para niños, adolescentes y adultos, online y en vivo: del 4 de enero al 27 de marzo, con todos los horarios y precios.",
  alternates: { canonical: "/verano/" },
};

/** El calendario completo del verano 2027: cada ciclo con todos sus grupos, por hora. */
export default async function Verano() {
  const { cursos } = await obtenerCursos();
  const filas: { curso: Curso; grupo: Grupo }[] = cursos.flatMap((curso) => curso.grupos.map((grupo) => ({ curso, grupo })));

  return (
    <>
      <CabeceraPagina
        migas={[{ nombre: "Verano 2027", href: "/verano/" }]}
        bajada="Tres ciclos de cuatro semanas, del 4 de enero al 27 de marzo. Online y en vivo por Google Meet, con la grabación de cada clase."
        acciones={
          <Boton href="/inscripcion/" variante="light">
            Inscribirme
          </Boton>
        }
      >
        Verano 2027, <em>de enero a marzo</em>
      </CabeceraPagina>
      {CICLOS.map((ciclo) => {
        const delCiclo = filas
          .filter(({ grupo }) => grupo.ciclo?.endsWith(ciclo.nombre))
          .sort((a, b) => (a.grupo.horaInicio + a.grupo.inicio).localeCompare(b.grupo.horaInicio + b.grupo.inicio));
        return (
          <section key={ciclo.nombre} className="panel panel-mist">
            <div className="panel-inner">
              <div className="cabeza-seccion">
                <h2 className="headline">
                  {ciclo.nombre}: <em>{fechaLarga(ciclo.inicio)} al {fechaLarga(ciclo.fin)}</em>
                </h2>
                <p className="lead blando">{ciclo.nota}</p>
              </div>
              {delCiclo.length === 0 ? (
                <p className="blando">Pronto publicamos los grupos de este ciclo.</p>
              ) : (
                <div className="tabla-wrap">
                  <table className="tabla">
                    <thead>
                      <tr>
                        <th scope="col">Curso</th>
                        <th scope="col">Para</th>
                        <th scope="col">Días y hora (Lima)</th>
                        <th scope="col">Fechas</th>
                        <th scope="col">Desde</th>
                        <th scope="col">
                          <span className="sr">Inscripción</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {delCiclo.map(({ curso, grupo }) => (
                        <tr key={grupo.id}>
                          <td>
                            <Link href={`/cursos/${curso.slug}/`}>{curso.nombre}</Link>
                          </td>
                          <td>{NOMBRE_PUBLICO[curso.publico]}</td>
                          <td>
                            {textoDias(grupo.dias)}
                            <br />
                            <span className="blando">
                              {grupo.horaInicio} a {grupo.horaFin}
                            </span>
                          </td>
                          <td>
                            {fechaLarga(grupo.inicio)} al {fechaLarga(grupo.fin)}
                          </td>
                          <td>{formatoPrecio(grupo.plan.pagoCompleto, grupo.plan.moneda)}</td>
                          <td>
                            {grupo.aceptaInscripciones ? (
                              <Link href={`/inscripcion/?curso=${curso.slug}&grupo=${encodeURIComponent(grupo.id)}`}>Inscribirme</Link>
                            ) : (
                              <span className="blando">Sin cupos</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        );
      })}
      <section className="panel panel-paper">
        <div className="panel-inner">
          <div className="cabeza-seccion">
            <h2 className="headline">
              Descuentos del <em>verano</em>
            </h2>
            <p className="lead blando">No se suman: se aplica el mayor. Se confirman al coordinar el pago por WhatsApp.</p>
          </div>
          <div className="rejilla-3">
            {DESCUENTOS.map(([t, d]) => (
              <div key={t} className="card">
                <h3>{t}</h3>
                <p className="blando">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
