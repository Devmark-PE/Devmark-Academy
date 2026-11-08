import { NOMBRE_PUBLICO, duracion, formatoPrecio, precioDesde, rangoEdad } from "@/lib/academia";
import { CONTACTO, RUTAS, URL_BASE, WEB } from "@/lib/datos";
import { obtenerCursos } from "@/lib/erp";

export const revalidate = 3600;

// Resumen del sitio para asistentes de IA (llmstxt.org). Los cursos salen del ERP, igual que las paginas.
export async function GET() {
  const { cursos } = await obtenerCursos();
  const cuerpo = `# DEVMARK Academy

> Academia peruana de cursos online y en vivo de inteligencia artificial, programación y finanzas con IA, para niños, adolescentes y adultos. Es parte de DEVMARK (${WEB}), agencia de desarrollo web y software con sede en Lima, Perú. Hay cursos regulares, cursos de verano y clases privadas.

## Datos

- Modalidad: online en vivo, con grupos y fechas de inicio por curso
- Público: niños, adolescentes y adultos (la edad de cada curso está en su ficha)
- Contacto: ${CONTACTO.email}, WhatsApp ${CONTACTO.telefono}. ${CONTACTO.horario}
- Inscripción: formulario en ${URL_BASE}/inscripcion/; el pago se coordina por WhatsApp

## Cursos

${cursos
  .map((c) => {
    const desde = precioDesde(c);
    return `- [${c.nombre}](${URL_BASE}/cursos/${c.slug}/): ${c.resumen} ${duracion(c)}. ${NOMBRE_PUBLICO[c.publico]}, ${rangoEdad(c)}.${desde ? ` Desde ${formatoPrecio(desde.pagoCompleto, desde.moneda)}.` : ""}`;
  })
  .join("\n")}

## Secciones

${RUTAS.map((r) => `- [${r.nombre}](${URL_BASE}${r.href})`).join("\n")}
- [Inscripción](${URL_BASE}/inscripcion/)
- [Términos y condiciones](${URL_BASE}/terminos/)
- [Privacidad y datos de menores](${URL_BASE}/privacidad/)
`;
  return new Response(cuerpo, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
