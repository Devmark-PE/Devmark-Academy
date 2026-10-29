import { WHATSAPP_CONSULTA } from "@/lib/datos";

/** Devi en la esquina, sin fondo, con su etiqueta: abre WhatsApp para preguntar. */
export function WhatsAppFlotante() {
  return (
    <a className="flotante" href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer" aria-label="Pregúntanos por WhatsApp">
      <span className="flotante-burbuja">
        <b>¿Dudas?</b>
        <span>Te respondemos por WhatsApp</span>
      </span>
      <span className="flotante-devi">
        {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi */}
        <img src="/marca/devi/devi-base-saludo.svg" alt="" width={64} height={62} />
      </span>
    </a>
  );
}
