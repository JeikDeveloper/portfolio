import { ui, defaultLang, languages, type Lang, type UIKey } from './ui';
import resumeEs from '../data/resume.es.json';
import resumeEn from '../data/resume.en.json';

export { languages, defaultLang, type Lang };

export const locales = Object.keys(languages) as Lang[];

/** Devuelve una función t() para el idioma dado. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Extrae el idioma del pathname. Cae al idioma por defecto si no reconoce el segmento. */
export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  return locales.includes(segment as Lang) ? (segment as Lang) : defaultLang;
}

/** Construye una ruta con prefijo de idioma. path('es', 'proyectos') -> '/es/proyectos/' */
export function path(lang: Lang, ...segments: string[]): string {
  const tail = segments.filter(Boolean).join('/');
  return tail ? `/${lang}/${tail}/` : `/${lang}/`;
}

/** Misma página en el otro idioma, preservando el resto de la ruta. */
export function alternatePath(url: URL, target: Lang): string {
  const parts = url.pathname.split('/').filter(Boolean);
  if (locales.includes(parts[0] as Lang)) parts[0] = target;
  else parts.unshift(target);
  return `/${parts.join('/')}/`.replace(/\/+$/, '/');
}

/** El CV completo del idioma pedido. Única fuente de verdad del contenido. */
export function getResume(lang: Lang) {
  return lang === 'en' ? resumeEn : resumeEs;
}

export type Resume = ReturnType<typeof getResume>;

/** Enlace a WhatsApp con el teléfono del CV y un mensaje inicial en el idioma de la página. */
export function whatsappUrl(lang: Lang): string {
  const number = getResume(lang).basics.phone.replace(/\D/g, '');
  const text = useTranslations(lang)('cta.whatsappMessage');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** URL de un perfil del CV por red ("LinkedIn", "GitHub"). */
export function profileUrl(lang: Lang, network: string): string | undefined {
  return getResume(lang).basics.profiles.find((p) => p.network === network)?.url;
}

/** Rutas estáticas para las páginas [lang]. */
export function langStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
