import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { CONTACTO } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Privacidad y datos de menores",
  description: "Cómo DEVMARK Academy trata los datos personales de alumnos, madres, padres y apoderados, según la Ley 29733 de Protección de Datos Personales.",
  alternates: { canonical: "/privacidad/" },
};

/** Politica de privacidad (Ley 29733 y su reglamento), con el tratamiento de datos de menores de edad. */
export default function Privacidad() {
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Privacidad", href: "/privacidad/" }]} bajada="Qué datos pedimos, para qué y cómo los cuidamos.">
        Privacidad y <em>datos de menores</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner prosa legal">
          <h2>Quién trata tus datos</h2>
          <p>DEVMARK Academy es una marca de DEVMARK. Los datos que nos das en la inscripción los trata DEVMARK, con domicilio en Lima, Perú, conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento.</p>
          <h2>Qué datos pedimos</h2>
          <ul>
            <li>Del alumno: nombre completo y fecha de nacimiento; si es mayor de edad, también su correo y su WhatsApp.</li>
            <li>Si el alumno es menor de edad: nombre, parentesco, DNI o carné de extranjería, correo y WhatsApp de su madre, padre o apoderado.</li>
            <li>Lo que el alumno o su apoderado sube al portal: tareas, entregas y mensajes; y las notas y la asistencia que registra el docente.</li>
          </ul>
          <h2>Para qué los usamos</h2>
          <ul>
            <li>Gestionar la inscripción, la matrícula, los pagos y el acceso a las clases y al portal.</li>
            <li>Enviar avisos del curso: horarios, tareas, notas y recordatorios de pago.</li>
            <li>Emitir comprobantes y el certificado del curso.</li>
          </ul>
          <p>No vendemos ni cedemos tus datos. Solo los usan las personas del equipo que atienden la academia y los proveedores que nos dan el servicio (alojamiento, base de datos y correo), con las mismas obligaciones de confidencialidad.</p>
          <h2>Menores de edad</h2>
          <p>Todo alumno menor de 18 años se inscribe con su madre, padre o apoderado, que es mayor de edad, da el consentimiento para tratar los datos del menor y es quien tiene la cuenta del portal. El menor no tiene cuenta propia. Las grabaciones de clase solo las ven los alumnos y apoderados del mismo grupo y el equipo de la academia.</p>
          <h2>Cuánto tiempo los guardamos</h2>
          <p>Mientras dure la relación con la academia y, después, el tiempo que exijan las normas tributarias y contables. Luego se eliminan o se anonimizan.</p>
          <h2>Tus derechos</h2>
          <p>
            Puedes pedir acceso, rectificación, cancelación u oposición sobre tus datos (o los del menor que representas) escribiendo a <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>. Te respondemos en los plazos de la ley. También puedes acudir a la Autoridad Nacional de Protección de Datos Personales.
          </p>
        </div>
      </section>
    </>
  );
}
