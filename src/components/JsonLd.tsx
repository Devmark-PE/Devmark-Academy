/** Datos estructurados (schema.org) para buscadores y asistentes de IA. Escapa "<" para que nada cierre la etiqueta. */
export function JsonLd({ datos }: { datos: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }} />;
}

/** Preguntas y respuestas como FAQPage: es lo que mas citan los asistentes de IA. */
export function preguntasLd(preguntas: readonly (readonly [string, string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map(([pregunta, respuesta]) => ({ "@type": "Question", name: pregunta, acceptedAnswer: { "@type": "Answer", text: respuesta } })),
  };
}
