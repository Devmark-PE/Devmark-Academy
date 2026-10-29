import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { CONTACTO, WEB } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos de inscripción, pago y participación en los cursos de DEVMARK Academy.",
  alternates: { canonical: "/terminos/" },
};

/** Terminos de inscripcion y participacion. Lo que no esta aqui se conversa con el equipo por WhatsApp. */
export default function Terminos() {
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Términos", href: "/terminos/" }]} bajada="Las reglas de inscripción, pago y clases de DEVMARK Academy.">
        Términos y <em>condiciones</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner prosa legal">
          <h2>Inscripción</h2>
          <p>La inscripción se hace en este sitio y se confirma cuando el equipo registra el pago de la matrícula o el pago completo. Un menor de edad solo puede inscribirse a través de su madre, padre o apoderado mayor de edad.</p>
          <h2>Precios y pagos</h2>
          <ul>
            <li>Los precios están en soles y se muestran en la ficha de cada curso.</li>
            <li>Se puede pagar matrícula y cuotas, o todo junto antes del inicio con un descuento. Las cuotas vencen en las fechas que se indican al inscribirte.</li>
            <li>El pago se coordina por WhatsApp (+51 975 646 074) con el equipo de DEVMARK Academy. Este sitio no cobra ni guarda datos de tarjetas.</li>
            <li>Los descuentos no se suman entre sí: se aplica el mayor.</li>
          </ul>
          <h2>Grupos y clases</h2>
          <ul>
            <li>Las clases son online y en vivo por Google Meet, en el horario del grupo (hora de Lima). Cada clase queda grabada en el portal.</li>
            <li>Cada grupo abre con un número mínimo de alumnos. Si no se alcanza, avisamos al menos tres días antes del inicio y la familia elige otro grupo o recibe la devolución de todo lo pagado.</li>
            <li>Si DEVMARK Academy tuviera que suspender o mover una clase, se avisa con anticipación y se recupera.</li>
            <li>Los casos de retiro o cambio de grupo se revisan con el equipo por WhatsApp.</li>
          </ul>
          <h2>Convivencia</h2>
          <p>Pedimos respeto en las clases y en el portal. Las grabaciones y materiales son para uso personal de los alumnos del grupo: no se pueden compartir ni publicar.</p>
          <h2>Libro de Reclamaciones</h2>
          <p>
            Puedes dejar un reclamo o una queja en el <a href={`${WEB}/libro-de-reclamaciones`}>Libro de Reclamaciones</a> de DEVMARK, o escribirnos a <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
