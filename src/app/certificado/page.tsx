import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CabeceraPagina } from "@/components/CabeceraPagina";

export const metadata: Metadata = {
  title: "Verificar un certificado",
  description: "Comprueba que un certificado de DEVMARK Academy es auténtico con su código.",
  alternates: { canonical: "/certificado/" },
};

async function buscar(datos: FormData) {
  "use server";
  const codigo = String(datos.get("codigo") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  redirect(`/certificado/${encodeURIComponent(codigo || "-")}/`);
}

/** Para empresas, colegios o quien reciba un certificado: escriben el codigo y ven si es valido. */
export default function VerificarCertificado() {
  return (
    <>
      <CabeceraPagina migas={[{ nombre: "Verificar certificado", href: "/certificado/" }]} bajada="Cada certificado lleva un código como DMA-2027-7K3QX9. Escríbelo para comprobar que es auténtico.">
        Verifica un <em>certificado</em>
      </CabeceraPagina>
      <section className="panel panel-paper">
        <div className="panel-inner">
          <form action={buscar} className="verificar">
            <label htmlFor="codigo">Código del certificado</label>
            <div className="verificar-fila">
              <input id="codigo" name="codigo" required placeholder="DMA-2027-7K3QX9" autoComplete="off" spellCheck={false} maxLength={20} />
              <button type="submit" className="btn btn-ink">
                Verificar
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
