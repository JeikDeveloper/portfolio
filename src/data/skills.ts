/**
 * Habilidades de la web, agrupadas por categoría.
 *
 * Los años tienen que poder sustentarse en una entrevista, así que cada uno sale de
 * una experiencia concreta de resume.*.json:
 * - `since` / `until`: mes ("AAAA-MM") en que empezaste y, si ya no la usas, en que
 *   dejaste de usarla. Se cuentan meses reales: 4 años y 10 meses se muestra
 *   "casi 5 años"; menos de 12 meses, "menos de 1 año".
 * - `years`: años fijos, cuando el número lo diste tú y no sale de una fecha.
 * - `featured`: sale en "Tecnologías principales" del inicio (unas 10). El resto
 *   queda en la vista completa y en la hoja de vida.
 * - `projects`: slugs de src/content/projects/ donde la aplicaste. Solo se muestran
 *   mientras la sección de proyectos esté visible.
 *
 * El PDF del CV sigue usando la lista `skills` de resume.*.json.
 */
import type { Lang } from '../i18n/ui';

export type Skill = {
  name: string;
  since?: string;
  until?: string;
  years?: number;
  featured?: boolean;
  projects?: string[];
};
export type SkillGroup = {
  id: 'frontend' | 'backend' | 'data' | 'ai' | 'tools' | 'soft';
  title: Record<Lang, string>;
  skills: Skill[];
  /** Pendiente de completar. Solo se ve en desarrollo (npm run dev). */
  todo?: string;
};

// Fechas de cada experiencia (iguales a resume.*.json).
const TIC_SOCIAL = '2021-12';
const LISA = '2022-06';
const LISA_END = '2024-01';
const TCS = '2023-12';
const NEXOR = '2026-03';

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: { es: 'Backend', en: 'Backend' },
    skills: [
      { name: 'Python', since: TIC_SOCIAL, featured: true },
      // Tic Social y LISA.
      { name: 'Django / DRF', since: TIC_SOCIAL, until: LISA_END, featured: true },
      { name: 'Celery', since: TIC_SOCIAL, until: LISA_END },
      { name: 'FastAPI', years: 3, featured: true },
      { name: 'Flask', years: 3 },
      { name: 'Node.js / Fastify', since: NEXOR, projects: ['nexor-one'] },
      // Herramientas internas en TCS.
      { name: 'Java', since: TCS },
      { name: 'APIs REST', since: TIC_SOCIAL, projects: ['nexor-one'] },
    ],
  },
  {
    id: 'frontend',
    title: { es: 'Frontend', en: 'Frontend' },
    skills: [
      { name: 'React', years: 1, projects: ['nexor-one'] },
      { name: 'Next.js', since: NEXOR, projects: ['nexor-one'] },
      { name: 'TypeScript', since: NEXOR, projects: ['nexor-one'] },
      { name: 'Tailwind CSS', since: NEXOR, projects: ['nexor-one'] },
      { name: 'Astro', since: NEXOR },
    ],
  },
  {
    id: 'data',
    title: { es: 'Bases de datos y datos', en: 'Databases & data' },
    skills: [
      { name: 'SQL', since: TIC_SOCIAL, featured: true },
      { name: 'PostgreSQL', since: NEXOR, projects: ['nexor-one'] },
      { name: 'Redis', since: NEXOR, projects: ['nexor-one'] },
      { name: 'NoSQL', years: 3 },
      { name: 'ETL (AWS Glue)', since: TCS },
      { name: 'Power BI', since: TCS },
    ],
  },
  {
    id: 'ai',
    title: { es: 'IA, agentes y automatización', en: 'AI, agents & automation' },
    skills: [
      // Agentes con Bedrock + LangChain en TCS. Bedrock salió al público en sep 2023.
      { name: 'Agentes con LLM', since: TCS, featured: true, projects: ['nexor-one'] },
      { name: 'Claude API (tool use)', since: NEXOR, projects: ['nexor-one'] },
      { name: 'LangChain / LlamaIndex', since: TCS, featured: true },
      { name: 'n8n', years: 1, featured: true },
      { name: 'Automatización de procesos', since: TCS },
      { name: 'AWS Bedrock / SageMaker', since: TCS },
      // LISA y después TCS (SageMaker).
      { name: 'Visión por computadora', since: LISA, featured: true },
      { name: 'OCR', since: LISA, featured: true, projects: ['nexor-one'] },
      { name: 'NLP', since: LISA },
      { name: 'MLOps', since: LISA },
    ],
  },
  {
    id: 'tools',
    title: { es: 'Cloud y herramientas', en: 'Cloud & tools' },
    skills: [
      { name: 'AWS (Lambda, S3, CloudWatch, API Gateway, RDS)', since: TCS, featured: true },
      { name: 'Docker', years: 2 },
      { name: 'Git', since: TIC_SOCIAL, projects: ['nexor-one'] },
      { name: 'CI/CD', years: 2 },
      { name: 'Vercel / Railway', since: NEXOR, projects: ['nexor-one'] },
      { name: 'Playwright', years: 2, projects: ['nexor-one'] },
      { name: 'Selenium', years: 2 },
      { name: 'k6', since: NEXOR, projects: ['nexor-one'] },
    ],
  },
  {
    id: 'soft',
    title: { es: 'Habilidades blandas', en: 'Soft skills' },
    // Las mismas de la hoja de vida (resume.*.json → "Habilidades blandas").
    skills: [
      { name: 'Liderazgo técnico' },
      { name: 'Comunicación con clientes y negocio' },
      { name: 'Traducir necesidades de negocio en soluciones técnicas' },
      { name: 'Trabajo en equipo' },
      { name: 'Resolución de problemas' },
      { name: 'Autonomía y responsabilidad por la entrega' },
      { name: 'Aprendizaje continuo' },
    ],
  },
];

/** Las tecnologías principales, en el orden de los grupos. */
export const featuredSkills = skillGroups.flatMap((g) => g.skills.filter((s) => s.featured));

/** Meses de uso de una habilidad, o null si no tiene fecha. */
export function skillMonths(s: Skill, now = new Date()) {
  if (s.years) return s.years * 12;
  if (!s.since) return null;
  const toMonths = (v: string) => {
    const [y, m] = v.split('-').map(Number);
    return y * 12 + (m - 1);
  };
  const end = s.until ? toMonths(s.until) : now.getFullYear() * 12 + now.getMonth();
  return Math.max(0, end - toMonths(s.since));
}

/** Traducciones de los nombres que cambian entre idiomas. */
const skillNamesEn: Record<string, string> = {
  'APIs REST': 'REST APIs',
  'Agentes con LLM': 'LLM agents',
  'Visión por computadora': 'Computer vision',
  'Automatización de procesos': 'Process automation',
  'Liderazgo técnico': 'Technical leadership',
  'Comunicación con clientes y negocio': 'Client and business communication',
  'Traducir necesidades de negocio en soluciones técnicas': 'Turning business needs into technical solutions',
  'Trabajo en equipo': 'Teamwork',
  'Resolución de problemas': 'Problem solving',
  'Autonomía y responsabilidad por la entrega': 'Ownership and autonomy',
  'Aprendizaje continuo': 'Continuous learning',
};

export function skillName(name: string, lang: Lang) {
  return lang === 'en' ? (skillNamesEn[name] ?? name) : name;
}
