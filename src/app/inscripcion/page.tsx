import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { obtenerCursos } from "@/lib/erp";
import Formulario from "./Formulario";

export const metadata: Metadata = {
  title: "Inscripción",
  description: "Inscríbete en un curso de DEVMARK Academy. Al enviar, coordinamos el pago contigo por WhatsApp.",
  alternates: { canonical: "/inscripcion/" },
};

/** Inscripcion: se guarda en el ERP y abre WhatsApp con todos los datos para coordinar el pago. */
export default async function Inscripcion({ searchParams }: { searchParams: Promise<{ curso?: string; grupo?: string }> }) {
  const { curso, grupo } = await searchParams;
  const { cursos } = await obtenerCursos();
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Inscripción", href: "/inscripcion/" }]} bajada="Te toma dos minutos. Al enviar se abre WhatsApp con tus datos y ahí coordinamos el pago con una persona del equipo.">
        Inscríbete <em>en tu curso</em>
      </CabeceraPagina>
      <section className="panel panel-mist">
        <div className="panel-inner">
          <Formulario cursos={cursos} cursoInicial={curso ?? null} grupoInicial={grupo ?? null} />
        </div>
      </section>
    </>
  );
}
