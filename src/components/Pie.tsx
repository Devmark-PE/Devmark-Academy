import Link from "next/link";
import { CONTACTO, REDES, RUTAS, WEB, WHATSAPP_CONSULTA } from "@/lib/datos";
import { IconoMarca, WhatsAppIcono } from "./iconos-marca";

const LEGALES = [
  { href: "/terminos/", nombre: "Términos y condiciones" },
  { href: "/privacidad/", nombre: "Privacidad y datos de menores" },
  { href: "/certificado/", nombre: "Verificar un certificado" },
  { href: "https://portal.devmarkpe.com", nombre: "Portal de alumnos y familias" },
] as const;

const DEVMARK = [
  { href: `${WEB}/nosotros`, nombre: "Nosotros" },
  { href: `${WEB}/servicios`, nombre: "Servicios" },
  { href: "https://devi.devmarkpe.com", nombre: "Devi, nuestra mascota" },
  { href: `${WEB}/blog`, nombre: "Blog" },
] as const;

/** Llamada a inscribirse antes del pie, con Devi. */
function LlamadaInscripcion() {
  return (
    <section className="panel panel-band cta-previa" aria-labelledby="cta-titulo">
      <div className="panel-inner">
        <div className="cta-grid">
          <div className="cta-texto">
            <h2 id="cta-titulo" className="headline">
              El verano 2027 empieza el 4 de enero. <em>Separa tu cupo.</em>
            </h2>
            <p style={{ maxWidth: "52ch" }}>Grupos pequeños, clases en vivo por Google Meet y la grabación de cada clase. Te inscribes en minutos y coordinamos el pago por WhatsApp.</p>
            <div className="fila">
              <Link className="btn btn-ink" href="/inscripcion/">
                <span className="btn-tile">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                Inscribirme
              </Link>
              <a className="btn btn-line" href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer">
                <span className="btn-tile">
                  <WhatsAppIcono />
                </span>
                Tengo una pregunta
              </a>
            </div>
          </div>
          <div className="cta-vista">
            {/* eslint-disable-next-line @next/next/no-img-element -- pose fija de Devi en SVG */}
            <img src="/marca/devi/devi-completo-senalando.svg" alt="Devi, la mascota de DEVMARK Academy, señalando la inscripción" width={240} height={232} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pie en dos paneles, como el de devmarkpe.com: marca y redes (niebla) y navegacion con contacto (tinta). */
export function Pie() {
  const anio = new Date().getFullYear();
  return (
    <>
      <LlamadaInscripcion />
      <footer className="pie-grid">
        <div className="pie-marca-panel">
          <Link href="/" aria-label="DEVMARK Academy, inicio" className="pie-logo">
            {/* eslint-disable-next-line @next/next/no-img-element -- logo SVG fijo */}
            <img src="/marca/academia/devmarkacademy-logotipo.svg" alt="DEVMARK Academy" />
          </Link>
          <p className="blando" style={{ maxWidth: "40ch", fontSize: 15 }}>
            Cursos de inteligencia artificial y programación, online y en vivo, para niños, adolescentes y adultos. Educación con IA.
          </p>
          <div>
            <p className="pie-rotulo">Síguenos</p>
            <div className="redes">
              {REDES.map((r) => (
                <a key={r.nombre} href={r.href} target="_blank" rel="noopener noreferrer" aria-label={r.nombre}>
                  <IconoMarca nombre={r.nombre} />
                </a>
              ))}
            </div>
          </div>
          <div className="pie-creacion">
            <span className="blando">Una marca de</span>
            <a href={WEB} aria-label="DEVMARK, agencia de desarrollo web y software">
              {/* eslint-disable-next-line @next/next/no-img-element -- logo SVG fijo */}
              <img src="/marca/devmark-logotipo.svg" alt="DEVMARK" />
            </a>
          </div>
        </div>

        <div className="pie-nav-panel">
          <div className="pie-columnas">
            <nav aria-label="Academia">
              <h3>Academia</h3>
              <ul>
                {RUTAS.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.nombre}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/inscripcion/">Inscripción</Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Legal">
              <h3>Legal</h3>
              <ul>
                {LEGALES.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.nombre}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="DEVMARK">
              <h3>DEVMARK</h3>
              <ul>
                {DEVMARK.map((r) => (
                  <li key={r.href}>
                    <a href={r.href}>{r.nombre}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3>Contacto</h3>
              <ul className="pie-contacto">
                <li>
                  <a href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcono tamano={16} />
                    {CONTACTO.telefono}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACTO.email}`}>
                    <IconoMarca nombre="Correo" tamano={16} />
                    {CONTACTO.email}
                  </a>
                </li>
                <li className="pie-menudo">{CONTACTO.horario}</li>
                <li className="pie-menudo">{CONTACTO.lugar}</li>
              </ul>
            </div>
          </div>
          <div className="pie-legal">
            <p>© {anio} DEVMARK. DEVMARK Academy es una marca de DEVMARK.</p>
            <a className="pie-reclamos" href={`${WEB}/libro-de-reclamaciones`}>
              Libro de Reclamaciones
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
