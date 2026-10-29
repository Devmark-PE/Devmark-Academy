import { enlaceWhatsapp } from "./academia";

export const URL_BASE = "https://academy.devmarkpe.com";
export const WEB = "https://devmarkpe.com";

/** Contacto y redes de DEVMARK (los mismos de devmarkpe.com). */
export const CONTACTO = {
  email: "contacto@devmarkpe.com",
  telefono: "+51 975 646 074",
  whatsapp: "51975646074",
  horario: "Lunes a viernes, 9:00 a 18:00 (hora de Lima)",
  lugar: "Lima, Perú · clases online en vivo",
} as const;

export const REDES = [
  { href: "https://www.instagram.com/devmark.pe/", nombre: "Instagram" },
  { href: "https://www.facebook.com/devmark.pe/", nombre: "Facebook" },
  { href: "https://www.linkedin.com/company/devmark.pe/", nombre: "LinkedIn" },
] as const;

export const RUTAS = [
  { href: "/cursos/", nombre: "Cursos" },
  { href: "/verano/", nombre: "Verano 2027" },
  { href: "/clases-privadas/", nombre: "Clases privadas" },
  { href: "/como-funciona/", nombre: "Cómo funciona" },
  { href: "/docentes/", nombre: "Docentes" },
] as const;

export const WHATSAPP_CONSULTA = enlaceWhatsapp("Hola DEVMARK Academy, quiero información sobre los cursos.");
