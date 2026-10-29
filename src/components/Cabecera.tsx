"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RUTAS, WHATSAPP_CONSULTA } from "@/lib/datos";
import { WhatsAppIcono } from "./iconos-marca";

/** Barra flotante blanca y opaca, fija arriba, como la de devi.devmarkpe.com. En movil, hamburguesa y panel de tinta. */
export function Cabecera() {
  const ruta = usePathname();
  // Se guarda en que pagina se abrio el menu: al navegar queda cerrado solo, sin un efecto que lo cierre.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === ruta;
  const setAbierto = (valor: boolean | ((v: boolean) => boolean)) => setAbiertoEn((v) => ((typeof valor === "function" ? valor(v === ruta) : valor) ? ruta : null));
  const caja = useRef<HTMLElement>(null);
  const actual = (href: string) => (ruta === href || ruta === href.slice(0, -1) || (href !== "/" && ruta.startsWith(href)) ? "page" : undefined);

  // Cierra con Escape y al tocar fuera.
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbiertoEn(null);
    const fuera = (e: PointerEvent) => !caja.current?.contains(e.target as Node) && setAbiertoEn(null);
    document.addEventListener("keydown", tecla);
    document.addEventListener("pointerdown", fuera);
    return () => {
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("pointerdown", fuera);
    };
  }, [abierto]);

  return (
    <header className="cabecera" ref={caja}>
      <Link href="/" className="marca" aria-label="DEVMARK Academy, inicio">
        {/* eslint-disable-next-line @next/next/no-img-element -- logo SVG fijo */}
        <img src="/marca/academia/devmarkacademy-logotipo-sin-lema.svg" alt="" width={187} height={34} />
      </Link>
      <nav className="nav" aria-label="Principal">
        {RUTAS.map((r) => (
          <Link key={r.href} href={r.href} aria-current={actual(r.href)}>
            {r.nombre}
          </Link>
        ))}
      </nav>
      <Link className="btn btn-ink btn-sm cab-cta" href="/inscripcion/">
        <span className="btn-tile">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        Inscríbete
      </Link>
      <button type="button" className="hamburguesa" aria-label={abierto ? "Cerrar menú" : "Abrir menú"} aria-expanded={abierto} aria-controls="menu-movil" onClick={() => setAbierto((v) => !v)}>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div id="menu-movil" className="panel-movil" data-abierto={abierto} hidden={!abierto}>
        <nav aria-label="Principal, móvil">
          {RUTAS.map((r) => (
            <Link key={r.href} href={r.href} aria-current={actual(r.href)}>
              {r.nombre}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-light" href="/inscripcion/">
          <span className="btn-tile">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          Inscríbete
        </Link>
        <a className="btn btn-glass" href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer">
          <span className="btn-tile">
            <WhatsAppIcono />
          </span>
          Escríbenos por WhatsApp
        </a>
      </div>
    </header>
  );
}
