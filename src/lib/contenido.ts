// Textos fijos del sitio (docs/academia.md del ERP, aprobado el 28 de octubre de 2026). Los cursos, grupos y precios
// salen de la API del ERP; aqui solo va lo que no cambia con cada ciclo.

export const CICLOS = [
  { nombre: "Ciclo 1", inicio: "2027-01-04", fin: "2027-01-29", nota: "Niños y adolescentes en las mañanas; adultos de noche." },
  { nombre: "Ciclo 2", inicio: "2027-02-01", fin: "2027-02-26", nota: "Nuevos cursos para todas las edades, e IA para docentes antes del colegio." },
  { nombre: "Ciclo 3", inicio: "2027-03-01", fin: "2027-03-27", nota: "Niños y adolescentes los sábados (vuelven al colegio); adultos de noche." },
] as const;

export const DESCUENTOS = [
  ["Preventa", "10 % menos si te inscribes hasta el domingo 20 de diciembre de 2026."],
  ["Hermanos", "10 % menos en el curso del segundo hermano."],
  ["Dos cursos", "10 % menos en el segundo curso del mismo alumno."],
] as const;

export const PREGUNTAS: readonly (readonly [string, string])[] = [
  ["¿Las clases son en vivo o grabadas?", "En vivo por Google Meet, con el docente y el grupo. Cada clase queda grabada en el portal por si alguien falta."],
  ["¿Cómo se paga?", "Al terminar la inscripción se abre WhatsApp con todos tus datos y ahí coordinamos el pago: Yape, Plin, depósito o transferencia. Puedes pagar matrícula y cuotas, o todo junto con 10 % menos."],
  ["¿Mi hijo necesita saber programar?", "No. Los cursos de niños y adolescentes empiezan desde cero y van por edades. Solo necesita una computadora con internet, cámara y micrófono."],
  ["¿Quién gestiona la cuenta de un menor de edad?", "Siempre su madre, padre o apoderado (mayor de edad). Es quien se inscribe, recibe los avisos, ve tareas y notas en el portal y coordina los pagos."],
  ["¿Qué pasa si el grupo no se llena?", "Cada grupo abre con un mínimo de alumnos (6 niños o adolescentes, 8 adultos). Si no se llega, te avisamos tres días antes y eliges otro horario o te devolvemos todo lo pagado."],
  ["¿Dan certificado?", "Sí. Al terminar el curso y presentar el proyecto final recibes el certificado de DEVMARK Academy, con un código para verificarlo."],
  ["¿Hay clases particulares?", "Sí, clases privadas 1 a 1 de cualquier tema, para cualquier edad: S/ 60 la hora o S/ 440 el paquete de 8 horas."],
];

export const DOCENTES = [
  {
    nombre: "Jaime Tarazona",
    rol: "Fundador de DEVMARK · Inteligencia artificial y programación",
    texto: "Dirige DEVMARK, la agencia de desarrollo web y software detrás de la academia, y construye a diario sistemas, webs y asistentes con IA. Enseña lo que usa en proyectos reales.",
    devi: "/marca/devi/devi-completo-hablando.svg",
  },
  {
    nombre: "Ambar",
    rol: "Economista · Línea de economía y finanzas con IA",
    texto: "Economista. Dicta los cursos de finanzas personales, finanzas para negocios y análisis económico con IA.",
    devi: "/marca/devi/devi-completo-exito.svg",
  },
] as const;
