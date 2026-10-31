# Portafolio — Jeiber I. Jiménez Bojacá

Portafolio bilingüe (español/inglés) con blog, proyectos y panel de
administración para publicar sin tocar código.

**Stack:** Astro 5 · TypeScript · MDX · Keystatic (CMS) · React (solo los demos) · Vercel.

---

## Índice

1. [Arrancar en local](#arrancar-en-local)
2. [Publicar contenido (sin código)](#publicar-contenido-sin-código)
3. [Desplegar en Vercel](#desplegar-en-vercel)
4. [Hoja de vida (PDF)](#hoja-de-vida-pdf)
5. [Dónde se edita cada cosa](#dónde-se-edita-cada-cosa)
6. [Disponibilidad, cifras y GitHub](#disponibilidad-cifras-y-github)
7. [Rendimiento (Lighthouse)](#rendimiento-lighthouse)
8. [Estructura del proyecto](#estructura-del-proyecto)
9. [Datos pendientes: `[COMPLETAR]`](#datos-pendientes-completar)

---

## Arrancar en local

Requisitos: Node.js 22 (o 20+).

```bash
npm install
npm run dev          # http://localhost:4321  ·  panel: http://localhost:4321/keystatic
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática. |
| `npm run build` | Compila el sitio para producción. |
| `npm run preview` | Sirve el build para revisarlo. |
| `npm run check` | Revisa tipos y errores en todos los archivos. |
| `npm run release` | Build + regenera los 4 PDF del CV. |
| `npm run og` | Regenera la imagen para compartir en redes (`public/og/default.png`). |

Los scripts de PDF e imagen usan Chromium. Se instala una sola vez con
`npx playwright install chromium`.

---

## Publicar contenido (sin código)

Todo se hace desde el panel **`/keystatic`**: artículos y proyectos.

- **En tu computador** (`npm run dev` → <http://localhost:4321/keystatic>): los cambios
  se guardan como archivos en tu disco. Después haces commit y push.
- **En el sitio publicado** (`https://tu-sitio/keystatic`): entras con tu cuenta de
  GitHub, y cada vez que guardas se hace un commit automático. Vercel vuelve a publicar
  el sitio en uno o dos minutos. No necesitas abrir el editor de código.

### Publicar un artículo, paso a paso

1. Abre `/keystatic` y entra en **Blog**.
2. Pulsa **Add** (Agregar).
3. A la derecha llena:
   - **Título**. La dirección (URL) se genera sola a partir del título.
   - **Descripción corta**: aparece en el listado, en Google y al compartir en LinkedIn.
   - **Fecha**, **Idioma** (español o inglés), **Categoría** y **Etiquetas** (en minúsculas).
   - **Traducción** (opcional): si escribes el mismo artículo en los dos idiomas, pon aquí
     la dirección del otro. Así el selector de idioma lleva de uno al otro y no sale repetido.
   - **Imagen de portada** (opcional), con su descripción para lectores de pantalla.
4. Escribe en el editor de la izquierda. La barra de arriba tiene:
   - **Negrita, cursiva, listas, enlaces, citas y tablas.**
   - **Imagen** (ícono de foto): súbela desde tu computador. Se optimiza sola (WebP y
     varios tamaños).
   - **Bloque de código** (ícono `</>`): elige el lenguaje (`python`, `js`, `bash`…) para
     tener resaltado de sintaxis.
   - **＋ → Video de YouTube**: pega solo el ID del video. En
     `youtube.com/watch?v=dsTXcSeAZq8` el ID es `dsTXcSeAZq8`.
   - **＋ → Nota destacada**: un recuadro de Nota, Consejo o Advertencia.
5. ¿No está listo? Marca **Borrador**: se guarda, pero no se publica.
6. Pulsa **Save**. En local, el artículo aparece al instante en `/es/blog/`. En producción,
   en uno o dos minutos, después de que Vercel termina de publicar.

El tiempo de lectura, los artículos relacionados, la página de cada etiqueta, el RSS
(`/es/rss.xml`) y el sitemap se generan solos.

### Agregar un proyecto (incluye sitios web)

> **Hoy la sección de proyectos está oculta.** Todo sigue construido, pero no se publica:
> ni el menú, ni el bloque del inicio, ni las páginas `/proyectos`. Para mostrarla, cambia
> `showProjects` a `true` en `src/data/site.ts`. Mientras tanto puedes cargar proyectos en
> el panel y verlos en local cambiando ese valor.

**Proyectos → Add.** Los textos van en español y en inglés (dos bloques). Las
**tecnologías** que pongas son las que aparecen en el filtro de `/proyectos`.
"Destacado" lo muestra en el inicio, y "Orden" decide la posición (menor número = primero).

Un sitio web es un proyecto más: pon su URL en **Demo en vivo** y una captura en
**Imagen**, y la tarjeta muestra el botón "Ver en vivo".

### Conectar el panel con GitHub (una sola vez)

Para que `/keystatic` funcione en el sitio publicado:

1. Sube el repositorio a GitHub como **`JeikDeveloper/portfolio`**. Si usas otro nombre,
   cámbialo en `REPO` dentro de `keystatic.config.ts`.
2. En tu computador crea un archivo `.env` con esta línea:
   `PUBLIC_KEYSTATIC_STORAGE=github`
3. Corre `npm run dev` y abre <http://localhost:4321/keystatic>. Keystatic te guía para
   crear una **GitHub App**. Al terminar, escribe en `.env` cuatro variables:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` y
   `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
4. Copia esas cuatro variables en Vercel (**Settings → Environment Variables**).
5. En la GitHub App (github.com → Settings → Developer settings → GitHub Apps), agrega
   como *Callback URL*: `https://tu-dominio/api/keystatic/github/oauth/callback`.
6. Borra la línea `PUBLIC_KEYSTATIC_STORAGE=github` de tu `.env` para volver al modo
   local, y vuelve a desplegar.

---

## Desplegar en Vercel

El plan Hobby de Vercel es gratis y alcanza de sobra.

1. Sube el código a GitHub. Repositorio personal: usa el remoto
   `https://JeikDeveloper@github.com/JeikDeveloper/portfolio.git`.
2. En [vercel.com](https://vercel.com) entra con GitHub → **Add New → Project** → elige el
   repositorio. Vercel detecta Astro solo: pulsa **Deploy**.
3. Carga las variables de entorno (ver `.env.example`) en **Settings → Environment
   Variables** y vuelve a desplegar.
4. Si el dominio final no es `jeikdeveloper.vercel.app`, cámbialo en tres lugares:
   `SITE` en `astro.config.mjs`, la línea `Sitemap:` de `public/robots.txt` y
   `basics.url` de los dos `resume.*.json`.

Desde ahí, **cada push a `main` publica solo**, y cada rama o PR recibe una URL de
vista previa.

Cómo queda montado: todo el sitio se genera estático (rápido y barato). Solo el panel
(`/keystatic`) corre como función en Vercel.

---

## Hoja de vida (PDF)

Todo el CV sale de `src/data/resume.es.json` y `resume.en.json`. De ahí se generan las
páginas `/es/cv/` y `/en/cv/`, y los 4 PDF:

| Archivo | Para qué |
|---|---|
| `jeiber-jimenez-es.pdf` / `-en.pdf` | Versión ATS: una columna, Arial, títulos estándar y fechas MM/AAAA, para que los filtros automáticos de las empresas la lean bien. Es la que bajan todos los botones. |
| `jeiber-jimenez-es-visual.pdf` / `-en-visual.pdf` | Versión con diseño. Solo se ofrece como segunda opción en `/cv`. |

Las fechas de cada empleo van en `resume.*.json` como `"AAAA-MM"` (p. ej. `"2023-12"`).

Cuando cambies el CV, corre `npm run release` y haz commit de `public/cv/`. Los PDF se
generan en tu computador, no en Vercel: así el build en la nube no necesita Chromium.

---

## Dónde se edita cada cosa

| Quiero cambiar… | Dónde |
|---|---|
| Artículos y proyectos | Panel `/keystatic` (o `src/content/`) |
| Experiencia, educación, contacto, CV | `src/data/resume.es.json` y `resume.en.json` |
| Habilidades de la web: las 10 principales (`featured`) y los años (`since`/`until` en meses o `years` fijos; ver el comentario del archivo) | `src/data/skills.ts` |
| Texto de "Sobre mí" y "Qué busco" | `src/data/about.ts` |
| Estado de disponibilidad (disponible / limitado / sin cupo) | `availability` en `src/data/about.ts` |
| Qué repos de GitHub se muestran | `src/data/github.ts` |
| Mostrar u ocultar la sección de proyectos | `showProjects` en `src/data/site.ts` |
| Textos de la interfaz (botones, títulos) | `src/i18n/ui.ts` |
| Colores, tipografía, espaciado | `src/styles/tokens.css` |
| Estilo de los artículos | `src/styles/prose.css` |
| Demos interactivos | `src/islands/*.tsx` |

---

## Disponibilidad, cifras y GitHub

**Disponibilidad.** En `src/data/about.ts` cambia `availability` a `'open'`, `'limited'`
o `'closed'`. Se actualizan solos la insignia de la portada, el bloque "¿Trabajamos
juntos?" del inicio, la tarjeta de "Sobre mí" y el cierre de cada página.

**Cifras del inicio.** Se calculan solas, nada se escribe a mano:

| Cifra | De dónde sale |
|---|---|
| Años de experiencia | Años completos desde el primer empleo de `resume.*.json`, con "+" (p. ej. "4+"). |
| Empresas | Cantidad de empleos del CV. |
| Proyectos y artículos | Lo publicado en el panel, **sin contar el contenido de ejemplo**. |
| Repositorios públicos | GitHub. |

Una cifra en 0 no se muestra. Un artículo escrito en los dos idiomas cuenta una vez.

**GitHub.** La página de proyectos muestra tus repos públicos más recientes y los
lenguajes que más usas. Se leen de la API de GitHub **cada vez que se publica el sitio**
(no en cada visita), así que la página sigue siendo estática y rápida.

- Para elegir cuáles salen, edita `src/data/github.ts`: `pinned` (van primero, en ese
  orden) y `hidden` (nunca salen). Los forks y los archivados no se muestran.
- Recomendado: en Vercel agrega `GITHUB_TOKEN`. Sin token, GitHub permite 60 consultas
  por hora por IP, y Vercel comparte IPs. Créalo en github.com → Settings → Developer
  settings → *Fine-grained tokens*, con acceso de solo lectura a repositorios públicos.
- Si GitHub no responde, la sección no aparece y el build sigue normal.

**Demos interactivos.** En cada proyecto, el campo *Demo interactivo* agrega uno al caso
de estudio: *Vista en dispositivos* carga el sitio real (la URL de *Demo en vivo*) en
tamaño móvil, tableta o escritorio; *Pipeline de extracción* y *Consola de API* son
simulaciones. NEXOR ONE usa la vista en dispositivos.

---

## Rendimiento (Lighthouse)

Medido en local sobre el build de producción (perfil móvil de Lighthouse 13):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Inicio | 100 | 100 | 100 | 100 |
| Proyectos | 99 | 100 | 100 | 100 |
| Caso de estudio (NEXOR ONE) | 99 | 100 | 100 | 100 |
| Artículo del blog | 100 | 100 | 100 | 100 |
| Sobre mí / Contacto | 100 | 100 | 100 | 100 |

Para medir de nuevo: `npm run build`, sirve `dist/client` (por ejemplo
`npx serve dist/client`) y corre `npx lighthouse http://localhost:3000/es/`.

---

## Estructura del proyecto

```
src/
├── content/              contenido editable desde el panel
│   ├── blog/*.mdx        artículos
│   └── projects/*.json   proyectos (textos ES/EN)
├── content.config.ts     esquemas: el build falla si a algo le falta un campo
├── assets/               imágenes (se optimizan en el build)
├── data/                 resume.*.json, skills.ts, about.ts, github.ts
├── i18n/                 textos de interfaz y utilidades de idioma
├── lib/content.ts        lectura del contenido, tiempo de lectura, relacionados
├── lib/github.ts         repos y lenguajes de GitHub (al compilar)
├── components/           componentes Astro (ui/ = piezas base del sistema de diseño)
├── islands/              demos en React (se cargan solo al verlos)
├── layouts/Base.astro    <head>, SEO, tema claro/oscuro, navegación
├── pages/
│   ├── [lang]/           inicio, sobre-mi, proyectos, blog, cv, contacto
│   └── print/            plantillas de los PDF
└── styles/               tokens.css, base.css, prose.css, console.css
keystatic.config.ts       campos del panel de administración
```

**Idiomas.** Cada página existe en `/es/…` y `/en/…`, enlazadas entre sí con `hreflang`.
Los artículos se escriben en un solo idioma (campo *Idioma*). Cada blog muestra primero
los suyos y debajo los del otro idioma.

**Modo claro/oscuro.** Sigue la preferencia del sistema y recuerda la elección del botón.
Todos los colores salen de las variables de `tokens.css`.

---

## Datos pendientes: `[COMPLETAR]`

Donde faltaba información real, el contenido dice `[COMPLETAR: …]`. Esos textos **se ven
resaltados en desarrollo** (`npm run dev`) y **se ocultan solos en producción**, así
nunca se publica un marcador. Para encontrarlos todos:

```bash
grep -rn "COMPLETAR" src
```
