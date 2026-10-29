import Link from "next/link";
import { NOMBRE_PUBLICO, duracion, fechaLarga, formatoPrecio, precioDesde, rangoEdad, type Curso } from "@/lib/academia";

const DEVI_PUBLICO = { NINOS: "/marca/devi/devi-patitas-saludo.svg", ADOLESCENTES: "/marca/devi/devi-patitas-pensando.svg", ADULTOS: "/marca/devi/devi-base-escribiendo.svg" } as const;

/** Tarjeta del catalogo: para quien, duracion, proximo inicio y precio desde. */
export function TarjetaCurso({ curso }: { curso: Curso }) {
  const plan = precioDesde(curso);
  const proximo = curso.grupos.find((g) => g.aceptaInscripciones) ?? null;
  return (
    <Link href={`/cursos/${curso.slug}/`} className="tarjeta-curso aparece" data-publico={curso.publico}>
      <div className="tc-cab">
        <span className="pastilla">{NOMBRE_PUBLICO[curso.publico]} · {rangoEdad(curso)}</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
        <img src={DEVI_PUBLICO[curso.publico]} alt="" width={64} height={62} className="tc-devi" />
      </div>
      <h3>{curso.nombre}</h3>
      <p className="blando tc-resumen">{curso.resumen}</p>
      <dl className="tc-datos">
        <div>
          <dt>Duración</dt>
          <dd>{duracion(curso)}</dd>
        </div>
        <div>
          <dt>Próximo inicio</dt>
          <dd>{proximo ? fechaLarga(proximo.inicio) : "Próximamente"}</dd>
        </div>
        <div>
          <dt>Desde</dt>
          <dd>{plan ? formatoPrecio(plan.pagoCompleto, plan.moneda) : "Consultar"}</dd>
        </div>
      </dl>
      <span className="tc-ver">
        Ver el curso <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
