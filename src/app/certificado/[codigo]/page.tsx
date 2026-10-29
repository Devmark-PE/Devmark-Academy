import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { fechaLarga } from "@/lib/academia";
import { verificarCertificado } from "@/lib/erp";

// Cada consulta pregunta al ERP (con cache de un minuto): un certificado se puede anular.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ codigo: string }> }): Promise<Metadata> {
  const { codigo } = await params;
  return { title: `Certificado ${decodeURIComponent(codigo).toUpperCase()}`, robots: { index: false, follow: false } };
}

/** Resultado de la verificacion: a quien, que curso, cuando y si sigue vigente. */
export default async function Certificado({ params }: { params: Promise<{ codigo: string }> }) {
  const codigo = decodeURIComponent((await params).codigo).trim().toUpperCase();
  const r = await verificarCertificado(codigo);
  const c = r.estado === "ok" ? r.datos : null;
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Verificar certificado", href: "/certificado/" }, { nombre: codigo, href: `/certificado/${codigo}/` }]}>
        {c ? (c.vigente ? <>Certificado <em>válido</em></> : <>Certificado <em>anulado</em></>) : r.estado === "caida" ? "No pudimos verificar ahora" : <>Código <em>no encontrado</em></>}
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner">
          {c ? (
            <div className={`certificado-ficha${c.vigente ? "" : " anulado"}`}>
              <p className="pastilla">{c.vigente ? "✓ Emitido por DEVMARK Academy" : "✕ Este certificado fue anulado"}</p>
              <dl>
                <div>
                  <dt>Alumno</dt>
                  <dd>{c.alumno}</dd>
                </div>
                <div>
                  <dt>Curso</dt>
                  <dd>{c.curso}</dd>
                </div>
                <div>
                  <dt>Duración</dt>
                  <dd>{c.horas} horas académicas</dd>
                </div>
                {c.notaFinal !== null && (
                  <div>
                    <dt>Nota final</dt>
                    <dd>{c.notaFinal} sobre 20</dd>
                  </div>
                )}
                <div>
                  <dt>Emitido</dt>
                  <dd>{fechaLarga(new Date(c.emitidoEn).toLocaleDateString("en-CA", { timeZone: "America/Lima" }), true)}</dd>
                </div>
                <div>
                  <dt>Código</dt>
                  <dd>
                    <code>{c.codigo}</code>
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="certificado-ficha anulado">
              <p className="blando">
                {r.estado === "caida"
                  ? "El sistema de verificación no responde en este momento. Intenta en unos minutos o escríbenos por WhatsApp."
                  : `No existe un certificado con el código ${codigo}. Revisa que esté bien escrito (los códigos no usan 0, O, 1, I ni L).`}
              </p>
            </div>
          )}
          <p style={{ marginTop: 24 }}>
            <Link href="/certificado/">Verificar otro código</Link>
          </p>
        </div>
      </section>
    </>
  );
}
