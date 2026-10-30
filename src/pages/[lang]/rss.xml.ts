/** Feed RSS del blog por idioma: /es/rss.xml y /en/rss.xml */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '../../lib/content';
import { useTranslations, getResume, path, langStaticPaths, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return langStaticPaths();
}

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const t = useTranslations(lang);
  const posts = await getPosts(lang);
  return rss({
    title: `${t('blog.title')} — ${getResume(lang).basics.name}`,
    description: t('blog.note'),
    site: site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: path(lang, 'blog', p.id),
      categories: p.data.tags,
    })),
    customData: `<language>${lang === 'es' ? 'es-co' : 'en-us'}</language>`,
  });
};
