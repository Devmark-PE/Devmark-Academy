import Link from "next/link";
import type { ReactNode } from "react";
import { URL_BASE } from "@/lib/datos";
import { JsonLd } from "./JsonLd";

type Miga = { nombre: string; href: string };

/** Cabecera de cada pagina interna, como la de devmarkpe.com: migas de pan y titulo sobre un panel de tinta. */
export function CabeceraPagina({ migas, bajada, acciones, aparte, children }: { migas: Miga[]; bajada?: ReactNode; acciones?: ReactNode; aparte?: ReactNode; children: ReactNode }) {
  const todas = [{ nombre: "Inicio", href: "/" }, ...migas];
  return (
    <section className="panel panel-ink pagina-cab">
      <JsonLd
        datos={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: todas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: `${URL_BASE}${m.href}` })),
        }}
      />
      <div className="panel-inner">
        <div className={aparte ? "cab-con-aparte" : undefined}>
          <div className="cab-texto">
            <nav aria-label="Migas de pan" className="migas">
              <ol>
                {todas.map((m, i) => (
                  <li key={m.href} aria-current={i === todas.length - 1 ? "page" : undefined}>
                    {i === todas.length - 1 ? m.nombre : <Link href={m.href}>{m.nombre}</Link>}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="display">{children}</h1>
            {bajada && <p className="lead blando">{bajada}</p>}
            {acciones && <div className="fila">{acciones}</div>}
          </div>
          {aparte && <div className="cab-aparte">{aparte}</div>}
        </div>
      </div>
    </section>
  );
}
