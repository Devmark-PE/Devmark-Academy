import Link from "next/link";

/** 404 con Devi buscando la pagina. */
export default function NoEncontrado() {
  return (
    <section className="panel panel-ink pagina-cab">
      <div className="panel-inner no-encontrado">
        {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
        <img src="/marca/devi/devi-patitas-buscando.svg" alt="Devi buscando la página" width={180} height={174} />
        <h1 className="display">
          No encontramos <em>esta página</em>
        </h1>
        <p className="lead blando">Quizá el curso cambió de nombre. Mira el catálogo completo.</p>
        <div className="fila">
          <Link className="btn btn-light" href="/cursos/">
            <span className="btn-tile" aria-hidden="true">
              →
            </span>
            Ver los cursos
          </Link>
        </div>
      </div>
    </section>
  );
}
