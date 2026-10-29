import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import { Cabecera } from "@/components/Cabecera";
import { Pie } from "@/components/Pie";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { CONTACTO, REDES, URL_BASE, WEB } from "@/lib/datos";
import "./globals.css";
import "./academia.css";

// Las mismas tipografias de devmarkpe.com: Schibsted Grotesk para todo e Instrument Serif cursiva solo dentro de un titular.
const cuerpo = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif", display: "swap" });

const DESCRIPCION =
  "Cursos online y en vivo de inteligencia artificial y programación para niños, adolescentes y adultos: IA para tu trabajo, IA para tus estudios, Python, Scratch, finanzas con IA y más. Verano 2027 desde el 4 de enero.";

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: { default: "DEVMARK Academy · Cursos de IA y programación en vivo", template: "%s · DEVMARK Academy" },
  description: DESCRIPCION,
  keywords: ["cursos de inteligencia artificial", "curso de IA para el trabajo", "IA para niños", "cursos de verano 2027 Lima", "vacaciones útiles programación", "curso de Python", "Scratch para niños", "cursos online en vivo Perú", "DEVMARK Academy"],
  applicationName: "DEVMARK Academy",
  authors: [{ name: "DEVMARK", url: WEB }],
  publisher: "DEVMARK",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "DEVMARK Academy · Educación con IA",
    description: DESCRIPCION,
    url: URL_BASE,
    siteName: "DEVMARK Academy",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/marca/academia/devmarkacademy-logotipo.png", alt: "DEVMARK Academy" }],
  },
};

export const viewport: Viewport = { themeColor: "#110c29" };

// Quien ensena y que es este sitio, para buscadores y asistentes de IA.
const GRAFO = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${WEB}/#organizacion`,
      name: "DEVMARK",
      url: WEB,
      email: CONTACTO.email,
      telephone: CONTACTO.telefono,
      sameAs: REDES.map((r) => r.href),
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${URL_BASE}/#academia`,
      name: "DEVMARK Academy",
      url: URL_BASE,
      logo: `${URL_BASE}/marca/academia/devmarkacademy-logotipo.png`,
      slogan: "Educación con IA",
      parentOrganization: { "@id": `${WEB}/#organizacion` },
      areaServed: "PE",
    },
    { "@type": "WebSite", "@id": `${URL_BASE}/#sitio`, name: "DEVMARK Academy", url: URL_BASE, inLanguage: "es-PE", publisher: { "@id": `${URL_BASE}/#academia` } },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${cuerpo.variable} ${serif.variable}`}>
      <body>
        <JsonLd datos={GRAFO} />
        <Cabecera />
        <main>{children}</main>
        <Pie />
        <WhatsAppFlotante />
      </body>
    </html>
  );
}
