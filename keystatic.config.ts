/**
 * Panel de administración (Keystatic) — https://keystatic.com
 *
 * Abre /keystatic en el navegador para escribir artículos, cargar proyectos
 * sin tocar código. Cada cambio se guarda como archivo dentro del repositorio:
 *   - En local (npm run dev) escribe directo en tu disco.
 *   - En producción hace un commit en GitHub y Vercel vuelve a publicar solo.
 *
 * Los campos de aquí tienen que coincidir con los esquemas de src/content.config.ts.
 */
import { config, collection, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

/** Repositorio de GitHub donde vive el sitio (usuario/repositorio). */
const REPO = 'JeikDeveloper/portfolio' as const;

const langField = fields.select({
  label: 'Idioma',
  options: [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
  ],
  defaultValue: 'es',
});

const exampleField = fields.checkbox({
  label: 'Es contenido de ejemplo',
  description: 'Muestra la etiqueta "Ejemplo". Desmárcalo (o borra la entrada) cuando cargues contenido real.',
  defaultValue: false,
});

/** Textos de un proyecto en un idioma. */
const projectCopy = (lang: string) =>
  fields.object(
    {
      title: fields.text({ label: 'Título', validation: { length: { min: 1 } } }),
      tagline: fields.text({ label: 'Resumen en una frase', validation: { length: { min: 1 } } }),
      client: fields.text({ label: 'Cliente o contexto (opcional)' }),
      role: fields.text({ label: 'Tu rol', description: 'Ej.: "Desarrollador full-stack en un equipo de 3".' }),
      problem: fields.text({ label: 'El problema', multiline: true }),
      built: fields.array(fields.text({ label: 'Pieza' }), {
        label: 'Qué construí',
        itemLabel: (p) => p.value,
      }),
      results: fields.array(fields.text({ label: 'Resultado' }), {
        label: 'Resultados',
        itemLabel: (p) => p.value,
      }),
      decisions: fields.array(
        fields.object({
          label: fields.text({ label: 'Decisión' }),
          body: fields.text({ label: 'Por qué', multiline: true }),
        }),
        { label: 'Decisiones técnicas', itemLabel: (p) => p.fields.label.value }
      ),
      demoNote: fields.text({ label: 'Nota del demo (opcional)', multiline: true }),
    },
    { label: `Textos en ${lang}` }
  );

/**
 * Local en desarrollo; GitHub en producción. Para conectar GitHub la primera vez
 * (crear la GitHub App), corre en local con PUBLIC_KEYSTATIC_STORAGE=github.
 * Paso a paso en el README, sección "Publicar contenido".
 */
const useGitHub = import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github';

export default config({
  storage: useGitHub ? { kind: 'github', repo: REPO } : { kind: 'local' },
  ui: {
    brand: { name: 'Portafolio de Jeiber' },
    navigation: {
      Contenido: ['posts', 'projects'],
    },
  },
  collections: {
    posts: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate', 'lang'],
      schema: {
        title: fields.slug({
          name: { label: 'Título', validation: { length: { min: 1 } } },
          slug: { label: 'Dirección (URL)', description: 'Se genera sola a partir del título.' },
        }),
        description: fields.text({
          label: 'Descripción corta',
          description: 'Aparece en el listado, en Google y al compartir en LinkedIn. Máx. 200 caracteres.',
          multiline: true,
          validation: { length: { min: 1, max: 200 } },
        }),
        pubDate: fields.date({ label: 'Fecha de publicación', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        updatedDate: fields.date({ label: 'Fecha de actualización (opcional)' }),
        lang: langField,
        translation: fields.text({
          label: 'Traducción (opcional)',
          description:
            'Dirección (URL) del mismo artículo en el otro idioma, p. ej. how-to-build-an-ai-agent-with-python. Enlaza las dos versiones y evita que salga repetido.',
        }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Inteligencia artificial', value: 'ia' },
            { label: 'Desarrollo web', value: 'web' },
            { label: 'Backend y datos', value: 'backend' },
            { label: 'Tutoriales', value: 'tutoriales' },
            { label: 'Carrera', value: 'carrera' },
          ],
          defaultValue: 'tutoriales',
        }),
        tags: fields.array(fields.text({ label: 'Etiqueta' }), {
          label: 'Etiquetas',
          description: 'En minúsculas, p. ej.: python, agentes, astro.',
          itemLabel: (p) => p.value,
        }),
        cover: fields.image({
          label: 'Imagen de portada (opcional)',
          directory: 'src/assets/blog',
          publicPath: '../../assets/blog/',
        }),
        coverAlt: fields.text({ label: 'Descripción de la portada (texto alternativo)' }),
        draft: fields.checkbox({
          label: 'Borrador',
          description: 'Los borradores no se publican.',
          defaultValue: false,
        }),
        example: exampleField,
        content: fields.mdx({
          label: 'Contenido',
          options: {
            image: { directory: 'src/assets/blog', publicPath: '../../assets/blog/' },
          },
          components: {
            YouTube: block({
              label: 'Video de YouTube',
              schema: {
                id: fields.text({
                  label: 'ID del video',
                  description: 'La parte después de "v=" en la URL. En youtube.com/watch?v=dsTXcSeAZq8 es dsTXcSeAZq8.',
                }),
                title: fields.text({ label: 'Título del video' }),
              },
            }),
            Callout: wrapper({
              label: 'Nota destacada',
              schema: {
                type: fields.select({
                  label: 'Tipo',
                  options: [
                    { label: 'Información', value: 'info' },
                    { label: 'Consejo', value: 'tip' },
                    { label: 'Advertencia', value: 'warning' },
                  ],
                  defaultValue: 'info',
                }),
              },
            }),
          },
        }),
      },
    }),

    projects: collection({
      label: 'Proyectos',
      slugField: 'name',
      path: 'src/content/projects/*',
      format: { data: 'json' },
      columns: ['name', 'year'],
      schema: {
        name: fields.slug({ name: { label: 'Nombre del proyecto' } }),
        year: fields.text({ label: 'Año', description: '"2026" o "2025–2026".' }),
        kind: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Empleo', value: 'empleo' },
            { label: 'Freelance', value: 'freelance' },
            { label: 'Personal', value: 'personal' },
            { label: 'Emprendimiento', value: 'emprendimiento' },
          ],
          defaultValue: 'personal',
        }),
        featured: fields.checkbox({ label: 'Destacado en el inicio', defaultValue: true }),
        order: fields.integer({ label: 'Orden', description: 'Menor número = aparece primero.', defaultValue: 10 }),
        example: exampleField,
        stack: fields.array(fields.text({ label: 'Tecnología' }), {
          label: 'Tecnologías',
          description: 'Se usan para el filtro de la página de proyectos.',
          itemLabel: (p) => p.value,
        }),
        image: fields.image({
          label: 'Imagen (captura)',
          directory: 'src/assets/projects',
          publicPath: '../../assets/projects/',
        }),
        imageAlt: fields.text({ label: 'Descripción de la imagen' }),
        live: fields.url({ label: 'Demo en vivo (URL)' }),
        repo: fields.url({ label: 'Repositorio (URL)' }),
        demo: fields.select({
          label: 'Demo interactivo dentro del portafolio',
          options: [
            { label: 'Ninguno', value: 'none' },
            { label: 'Pipeline de extracción', value: 'scrape' },
            { label: 'Consola de API', value: 'endpoint' },
            { label: 'Vista en dispositivos (usa la URL de demo)', value: 'viewport' },
          ],
          defaultValue: 'none',
        }),
        es: projectCopy('español'),
        en: projectCopy('inglés'),
      },
    }),

  },
});
