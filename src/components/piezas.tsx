import Link from "next/link";
import type { ReactNode } from "react";

type NombreIcono = "flecha" | "descargar" | "jugar" | "libro" | "calendario";

/** Iconos propios y pocos: lineas de 2 px, hereda el color. */
export function Icono({ nombre, tamano = 18 }: { nombre: NombreIcono; tamano?: number }) {
  const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" aria-hidden="true" {...trazo}>
      {nombre === "flecha" && <path d="M5 12h14M13 6l6 6-6 6" />}
      {nombre === "descargar" && <path d="M12 4v11m0 0-5-5m5 5 5-5M5 20h14" />}
      {nombre === "jugar" && <path d="M8 5v14l11-7z" />}
      {nombre === "libro" && <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10" />}
      {nombre === "calendario" && <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />}
    </svg>
  );
}

type PropsBoton = { href: string; children: ReactNode; variante?: "light" | "ink" | "glass" | "line" | "indigo"; icono?: NombreIcono; pequeno?: boolean; descarga?: boolean };

/** Boton de devmarkpe.com: rectangular, con una ficha de icono a la izquierda. */
export function Boton({ href, children, variante = "ink", icono = "flecha", pequeno = false, descarga = false }: PropsBoton) {
  const clase = `btn btn-${variante}${pequeno ? " btn-sm" : ""}`;
  const contenido = (
    <>
      <span className="btn-tile">
        <Icono nombre={icono} tamano={pequeno ? 16 : 18} />
      </span>
      {children}
    </>
  );
  // Un archivo se descarga con una etiqueta normal; una pagina, con el enrutador.
  return descarga || href.startsWith("http") ? (
    <a className={clase} href={href} {...(descarga ? { download: "" } : { target: "_blank", rel: "noopener noreferrer" })}>
      {contenido}
    </a>
  ) : (
    <Link className={clase} href={href}>
      {contenido}
    </Link>
  );
}

/** Cabecera de una seccion: titular con una frase en cursiva y, opcional, una bajada. */
export function Titular({ children, bajada, nivel = 2 }: { children: ReactNode; bajada?: ReactNode; nivel?: 1 | 2 }) {
  const Etiqueta = nivel === 1 ? "h1" : "h2";
  return (
    <div className="cabeza-seccion aparece">
      <Etiqueta className={nivel === 1 ? "display" : "headline"}>{children}</Etiqueta>
      {bajada && <p className="lead blando">{bajada}</p>}
    </div>
  );
}
