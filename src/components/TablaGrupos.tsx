import Link from "next/link";
import { fechaLarga, formatoPrecio, textoDias, totalEnCuotas, type Grupo } from "@/lib/academia";

/** Los grupos de un curso con fechas, horario, cupos y precio, y el boton para inscribirse en cada uno. */
export function TablaGrupos({ curso, grupos }: { curso: string; grupos: Grupo[] }) {
  return (
    <div className="grupos">
      {grupos.map((g) => {
        const p = g.plan;
        return (
          <article key={g.id} className="grupo">
            <div className="grupo-cab">
              <span className="pastilla">{g.ciclo ?? "Grupo"}</span>
              {g.aceptaInscripciones ? (
                <span className={`cupos${g.cuposLibres <= 3 ? " cupos-pocos" : ""}`}>{g.cuposLibres <= 3 ? `¡Quedan ${g.cuposLibres} cupos!` : `${g.cuposLibres} cupos libres`}</span>
              ) : (
                <span className="cupos cupos-cerrado">{g.estado === "EN_CURSO" ? "En curso" : "Cupos agotados"}</span>
              )}
            </div>
            <h3>
              Del {fechaLarga(g.inicio)} al {fechaLarga(g.fin, true)}
            </h3>
            <p className="grupo-horario">
              {textoDias(g.dias)}, de {g.horaInicio} a {g.horaFin} <span className="blando">(hora de Lima)</span>
            </p>
            {g.docente && <p className="blando grupo-docente">Docente: {g.docente}</p>}
            <dl className="grupo-precio">
              <div>
                <dt>En cuotas</dt>
                <dd>{formatoPrecio(totalEnCuotas(p), p.moneda)}</dd>
                <span className="blando">
                  Matrícula {formatoPrecio(p.matricula, p.moneda)} + {p.cuotas.length} × {formatoPrecio(p.cuotas[0]?.monto ?? 0, p.moneda)}
                </span>
              </div>
              <div className="grupo-completo">
                <dt>Pago completo</dt>
                <dd>{formatoPrecio(p.pagoCompleto, p.moneda)}</dd>
                <span className="blando">Ahorras {formatoPrecio(Math.max(0, totalEnCuotas(p) - p.pagoCompleto), p.moneda)}</span>
              </div>
            </dl>
            {g.aceptaInscripciones && (
              <Link className="btn btn-ink btn-sm" href={`/inscripcion/?curso=${curso}&grupo=${encodeURIComponent(g.id)}`}>
                <span className="btn-tile">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                Inscribirme en este grupo
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
