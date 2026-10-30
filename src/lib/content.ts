/** Lectura del contenido (proyectos, blog) con el orden y los filtros del sitio. */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'posts'>;

/** Marcador de dato pendiente. Ver isTodo(). */
export const TODO = '[COMPLETAR';

/**
 * Un texto con [COMPLETAR] se muestra en desarrollo (para que lo veas y lo llenes)
 * y se oculta en producción, para no publicar marcadores.
 */
export function isTodo(text?: string | null) {
  return Boolean(text?.includes(TODO));
}
export function visible(text?: string | null): text is string {
  return Boolean(text) && (import.meta.env.DEV || !isTodo(text));
}

/** Proyectos ordenados: primero los reales, después por `order` y año. */
export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort(
    (a, b) => Number(a.data.example) - Number(b.data.example) || a.data.order - b.data.order || b.data.year.localeCompare(a.data.year)
  );
}

/** Artículos publicados (los borradores solo aparecen en desarrollo), del más nuevo al más viejo. */
export async function getPosts(lang?: Lang) {
  const all = await getCollection('posts', (p) => (import.meta.env.DEV || !p.data.draft) && (!lang || p.data.lang === lang));
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Un artículo es traducción de otro si cualquiera de los dos apunta al otro en `translation`. */
export function isTranslation(a: Post, b: Post) {
  return a.data.lang !== b.data.lang && (a.data.translation === b.id || b.data.translation === a.id);
}

/** Minutos de lectura a 200 palabras por minuto (ritmo habitual en texto técnico). */
export function readingTime(post: Post) {
  const words = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ') // el código se lee distinto: no cuenta
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Artículos relacionados: los que más etiquetas comparten, y de desempate la misma categoría. */
export function relatedPosts(post: Post, all: Post[], limit = 3) {
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      p,
      score:
        p.data.tags.filter((t) => post.data.tags.includes(t)).length * 2 + (p.data.category === post.data.category ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.getTime() - a.p.data.pubDate.getTime())
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Etiqueta → segmento de URL ("Machine Learning" → "machine-learning"). */
export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
