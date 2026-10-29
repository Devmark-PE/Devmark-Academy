// Tipos y reglas del catalogo tal como lo publica la API del ERP (GET /publico/sitios/academia/academia/cursos).
// Los calculos y el mensaje de WhatsApp son copia de packages/core/src/academia.ts del ERP: si cambian alla,
// se cambian aqui (el sitio no importa el codigo del ERP).

export type Publico = "NINOS" | "ADOLESCENTES" | "ADULTOS";
export type Tema = "IA" | "PROGRAMACION" | "ECONOMIA" | "TECNOLOGIA";
export type EstadoGrupo = "ABIERTO" | "LLENO" | "EN_CURSO" | "CERRADO" | "CANCELADO";
export type FormaPago = "CUOTAS" | "COMPLETO";

export type Cuota = { monto: number; vence: string };
export type Plan = { moneda: string; matricula: number; cuotas: Cuota[]; pagoCompleto: number };

export type Grupo = {
  id: string;
  ciclo: string | null;
  inicio: string;
  fin: string;
  dias: string[];
  horaInicio: string;
  horaFin: string;
  docente: string | null;
  cupoMaximo: number;
  cuposLibres: number;
  estado: EstadoGrupo;
  aceptaInscripciones: boolean;
  plan: Plan;
};

export type Curso = {
  slug: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  publico: Publico;
  tema: Tema;
  edadMin: number | null;
  edadMax: number | null;
  nivel: string | null;
  clases: number;
  minutosPorClase: number;
  temario: { titulo: string; temas: string[] }[];
  aprendizajes: string[];
  proyectoFinal: string | null;
  requisitos: string | null;
  imagen: string | null;
  linea: string | null;
  destacado: boolean;
  orden: number;
  grupos: Grupo[];
};

export const PUBLICOS: { clave: Publico; nombre: string; edades: string; texto: string; devi: string }[] = [
  { clave: "NINOS", nombre: "Niños", edades: "8 a 12 años", texto: "Crean cuentos, juegos y su primera IA, jugando y con reglas para usarla seguro.", devi: "/marca/devi/devi-patitas-saludo.svg" },
  { clave: "ADOLESCENTES", nombre: "Adolescentes", edades: "13 a 17 años", texto: "Estudian mejor con IA, programan en Python y publican su primera web o app.", devi: "/marca/devi/devi-patitas-senalando.svg" },
  { clave: "ADULTOS", nombre: "Adultos", edades: "18 años o más", texto: "IA para el trabajo, el negocio y las finanzas, y programación desde cero.", devi: "/marca/devi/devi-completo-saludo.svg" },
];
export const NOMBRE_PUBLICO: Record<Publico, string> = { NINOS: "Niños", ADOLESCENTES: "Adolescentes", ADULTOS: "Adultos" };
export const NOMBRE_TEMA: Record<Tema, string> = { IA: "Inteligencia artificial", PROGRAMACION: "Programación", ECONOMIA: "Economía y finanzas", TECNOLOGIA: "Tecnología" };

const NOMBRE_DIA: Record<string, string> = { LUN: "lunes", MAR: "martes", MIE: "miércoles", JUE: "jueves", VIE: "viernes", SAB: "sábados", DOM: "domingos" };
const ORDEN_DIAS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

/** ["MIE", "LUN"] -> "lunes y miércoles" */
export function textoDias(dias: readonly string[]): string {
  const orden = ORDEN_DIAS.filter((d) => dias.includes(d)).map((d) => NOMBRE_DIA[d]!);
  if (orden.length <= 1) return orden[0] ?? "";
  return `${orden.slice(0, -1).join(", ")} y ${orden[orden.length - 1]}`;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
/** "2027-01-05" -> "5 de enero" (o con el año). Sin Date: no se corre de dia por la zona horaria. */
export function fechaLarga(iso: string, conAnio = false): string {
  const [a, m = 1, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}${conAnio ? ` de ${a}` : ""}`;
}

export function formatoPrecio(monto: number, moneda = "PEN"): string {
  const n = Number.isInteger(monto) ? String(monto) : monto.toFixed(2);
  return moneda === "PEN" ? `S/ ${n}` : moneda === "USD" ? `US$ ${n}` : `${moneda} ${n}`;
}

export function totalEnCuotas(plan: Pick<Plan, "matricula" | "cuotas">): number {
  return Math.round((plan.matricula + plan.cuotas.reduce((s, c) => s + c.monto, 0)) * 100) / 100;
}

export function rangoEdad(c: Pick<Curso, "edadMin" | "edadMax">): string {
  if (c.edadMin && c.edadMax) return `${c.edadMin} a ${c.edadMax} años`;
  if (c.edadMin) return `${c.edadMin} años o más`;
  return "Todas las edades";
}

export function duracion(c: Pick<Curso, "clases" | "minutosPorClase">): string {
  const m = c.minutosPorClase;
  const t = m % 60 === 0 ? `${m / 60} h` : m > 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
  return `${c.clases} clases de ${t}`;
}

/** El precio mas bajo entre los grupos abiertos (o de cualquiera, si no hay abiertos). */
export function precioDesde(c: Curso): Plan | null {
  const grupos = c.grupos.filter((g) => g.aceptaInscripciones);
  const lista = grupos.length ? grupos : c.grupos;
  return lista.map((g) => g.plan).sort((a, b) => a.pagoCompleto - b.pagoCompleto)[0] ?? null;
}

export function hoyEnLima(ahora: Date = new Date()): string {
  return ahora.toLocaleDateString("en-CA", { timeZone: "America/Lima" });
}

export function edadEn(fechaNacimiento: string, hoy: string): number | null {
  const n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaNacimiento);
  const h = /^(\d{4})-(\d{2})-(\d{2})$/.exec(hoy);
  if (!n || !h) return null;
  const [an = 0, mn = 0, dn = 0] = n.slice(1).map(Number);
  const [ah = 0, mh = 0, dh = 0] = h.slice(1).map(Number);
  return ah - an - (mh < mn || (mh === mn && dh < dn) ? 1 : 0);
}

export const MAYORIA_DE_EDAD = 18;

/** Numero de WhatsApp de DEVMARK Academy. */
export const WHATSAPP = "51975646074";
export const enlaceWhatsapp = (texto: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

export type DatosInscripcion = {
  curso: string;
  grupoId?: string;
  formaPago: FormaPago;
  alumnoNombre: string;
  alumnoFechaNacimiento: string;
  alumnoCorreo?: string;
  alumnoTelefono?: string;
  apoderadoNombre?: string;
  apoderadoDni?: string;
  apoderadoCorreo?: string;
  apoderadoTelefono?: string;
  parentesco?: string;
  comoSeEntero?: string;
  comentario?: string;
};

/** Mensaje de WhatsApp con todos los datos, para cuando la API no respondio (el ERP arma el mismo con codigo). */
export function mensajeWhatsapp(d: DatosInscripcion, curso: Curso | null, grupo: Grupo | null, hoy: string): string {
  const edad = edadEn(d.alumnoFechaNacimiento, hoy);
  const menor = edad !== null && edad < MAYORIA_DE_EDAD;
  const l = ["Hola DEVMARK Academy, quiero inscribirme.", "", `*Curso:* ${curso?.nombre ?? d.curso}`];
  if (grupo) l.push(`*Grupo:* ${grupo.ciclo ? `${grupo.ciclo}, ` : ""}desde el ${fechaLarga(grupo.inicio, true)}, ${textoDias(grupo.dias)} de ${grupo.horaInicio} a ${grupo.horaFin}`);
  if (grupo) {
    const p = grupo.plan;
    l.push(
      `*Forma de pago:* ${
        d.formaPago === "COMPLETO"
          ? `pago completo de ${formatoPrecio(p.pagoCompleto, p.moneda)}`
          : `matrícula de ${formatoPrecio(p.matricula, p.moneda)} y ${p.cuotas.length} cuota${p.cuotas.length === 1 ? "" : "s"} (${formatoPrecio(totalEnCuotas(p), p.moneda)} en total)`
      }`,
    );
  } else l.push(`*Forma de pago:* ${d.formaPago === "COMPLETO" ? "pago completo" : "matrícula y cuotas"}`);
  l.push("", `*Alumno:* ${d.alumnoNombre.trim()}${edad !== null ? `, ${edad} años` : ""}`);
  if (menor) {
    l.push(`*Apoderado:* ${d.apoderadoNombre?.trim() ?? ""}${d.parentesco ? ` (${d.parentesco.trim()})` : ""}, DNI ${d.apoderadoDni?.trim() ?? ""}`);
    l.push(`*WhatsApp:* ${d.apoderadoTelefono?.trim() ?? ""} · *Correo:* ${d.apoderadoCorreo?.trim() ?? ""}`);
  } else l.push(`*WhatsApp:* ${d.alumnoTelefono?.trim() ?? ""} · *Correo:* ${d.alumnoCorreo?.trim() ?? ""}`);
  if (d.comentario?.trim()) l.push("", `*Comentario:* ${d.comentario.trim()}`);
  l.push("", "¿Cómo hago el pago?");
  return l.join("\n");
}
