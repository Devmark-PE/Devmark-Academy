# DEVMARK Academy · academy.devmarkpe.com

Sitio de **DEVMARK Academy**: cursos online y en vivo de inteligencia artificial y programación para niños,
adolescentes y adultos. Diseño y plan completos en el ERP: `Devmark-PE/ERP-Devmark`, `docs/academia.md`.

- **Sin base de datos** (decisión 0007 del ERP): el catálogo, los grupos y los precios salen de la API del ERP, y las
  inscripciones se guardan allí. Las llamadas van firmadas desde el servidor con `SITIO_SIGNING_SECRET`; el secreto
  nunca llega al navegador.
- **El pago se coordina por WhatsApp** (+51 975 646 074): al enviar la inscripción se abre WhatsApp con todos los datos
  y el código de la inscripción (`ACA-0001`). El sitio no cobra.
- Si la API no responde, el catálogo sale de `src/data/catalogo-respaldo.json` (copia del verano 2027) y la
  inscripción igual abre WhatsApp con todos los datos.
- Mismo sistema de diseño que devmarkpe.com y devi.devmarkpe.com; Devi es la mascota de la academia.

## Páginas

`/` portada · `/cursos/` catálogo con filtros (`?para=NINOS&tema=IA`) · `/cursos/<slug>/` ficha con grupos y precios ·
`/verano/` calendario 2027 · `/clases-privadas/` · `/como-funciona/` · `/docentes/` · `/inscripcion/` ·
`/terminos/` · `/privacidad/`. Las páginas se regeneran cada 5 minutos con lo que haya en el ERP.

## Variables (`.env.example`)

| Variable | Valor |
|---|---|
| `ERP_API_URL` | `https://api.devmarkpe.com` |
| `SITIO_SIGNING_SECRET` | El mismo de la web (devmarkpe.com) |
| `ACADEMIA_SITIO_SLUG` | `academia` (el sitio que crea `scripts/importar-academia.mjs` del ERP) |

## Comandos

```bash
npm install
npm run dev:local  # http://localhost:3400 contra el ERP local (encender antes "npm run dev:local" en ERP-Devmark)
npm run dev        # http://localhost:3400 con las variables de .env.local
npm run lint
npm run typecheck
npm run build      # build standalone + estáticos copiados (para Hostinger)
npm start          # node .next/standalone/server.js
```

## Publicar en Hostinger

Aplicación Node.js (22 o superior) conectada a este repositorio. Comando de build: `npm run build`; archivo de
arranque: `.next/standalone/server.js`. Dominio `academy.devmarkpe.com` con su SSL y las variables de arriba en hPanel.
Antes, en el ERP: aplicar la migración de la academia (`npm run db:deploy`) y cargar el catálogo
(`node scripts/importar-academia.mjs --docente <correo>`).
