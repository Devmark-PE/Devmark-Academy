import type { MetadataRoute } from "next";
import { URL_BASE } from "@/lib/datos";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${URL_BASE}/sitemap.xml`, host: URL_BASE };
}
