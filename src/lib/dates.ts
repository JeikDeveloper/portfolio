/**
 * Fechas de la hoja de vida. En resume.*.json van como "AAAA-MM" (formato de JSON
 * Resume); un texto como "Actualidad" o "En curso" se muestra tal cual.
 *
 *   formatMonth('2023-12', 'es')          -> "dic 2023"
 *   formatMonth('2023-12', 'en')          -> "Dec 2023"
 *   formatMonth('2023-12', 'es', 'ats')   -> "12/2023"  (el formato que mejor leen los ATS)
 */
import type { Lang } from '../i18n/ui';

const months: Record<Lang, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export function formatMonth(value: string, lang: Lang, style: 'short' | 'ats' = 'short') {
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (!m) return value;
  const [, year, month] = m;
  return style === 'ats' ? `${month}/${year}` : `${months[lang][Number(month) - 1]} ${year}`;
}

export function formatRange(start: string | undefined, end: string, lang: Lang, style: 'short' | 'ats' = 'short') {
  const sep = style === 'ats' ? ' - ' : ' — ';
  return start ? `${formatMonth(start, lang, style)}${sep}${formatMonth(end, lang, style)}` : formatMonth(end, lang, style);
}
