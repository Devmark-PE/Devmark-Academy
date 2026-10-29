import type { MetadataRoute } from "next";
import { URL_BASE } from "@/lib/datos";
import { obtenerCursos } from "@/lib/erp";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { cursos } = await obtenerCursos();
  const fijas = ["/", "/cursos/", "/verano/", "/clases-privadas/", "/como-funciona/", "/docentes/", "/inscripcion/", "/terminos/", "/privacidad/"];
  return [
    ...fijas.map((r) => ({ url: `${URL_BASE}${r}`, changeFrequency: "weekly" as const, priority: r === "/" ? 1 : 0.7 })),
    ...cursos.map((c) => ({ url: `${URL_BASE}/cursos/${c.slug}/`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
