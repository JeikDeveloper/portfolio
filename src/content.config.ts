/**
 * Colecciones de contenido. Astro valida cada archivo contra estos esquemas al compilar:
 * si a un artículo o proyecto le falta un campo obligatorio, el build falla con un
 * mensaje claro en vez de publicar una página rota.
 *
 * Los campos coinciden con keystatic.config.ts (el panel de administración).
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lang = z.enum(['es', 'en']);
/** Keystatic deja `null` en los campos vacíos; aquí se tratan como "no hay". */
const optionalText = z.string().nullish().transform((v) => v || undefined);
const optionalUrl = z.string().url().or(z.literal('')).nullish().transform((v) => v || undefined);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(200),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().nullish().transform((v) => v ?? undefined),
      lang,
      /** Dirección (slug) del mismo artículo en el otro idioma, si existe. */
      translation: optionalText,
      category: z.enum(['ia', 'web', 'backend', 'tutoriales', 'carrera']),
      tags: z.array(z.string()).default([]),
      cover: image().nullish(),
      coverAlt: optionalText,
      draft: z.boolean().default(false),
      example: z.boolean().default(false),
    }),
});

const projectCopy = z.object({
  title: z.string(),
  tagline: z.string(),
  client: optionalText,
  role: optionalText,
  problem: z.string().default(''),
  built: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  decisions: z.array(z.object({ label: z.string(), body: z.string() })).default([]),
  demoNote: optionalText,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      year: z.string(),
      kind: z.enum(['empleo', 'freelance', 'personal', 'emprendimiento']),
      featured: z.boolean().default(true),
      order: z.number().nullish().transform((v) => v ?? 10),
      example: z.boolean().default(false),
      stack: z.array(z.string()).default([]),
      image: image().nullish(),
      imageAlt: optionalText,
      live: optionalUrl,
      repo: optionalUrl,
      demo: z.enum(['none', 'scrape', 'endpoint', 'viewport']).default('none'),
      es: projectCopy,
      en: projectCopy,
    }),
});

export const collections = { posts, projects };
