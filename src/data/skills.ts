/**
 * Habilidades de la web, agrupadas por categoría.
 *
 * - `since`: año desde el que usas la tecnología. Sale de la experiencia de
 *   resume.*.json (p. ej. Python 2021 = Tic Social). Si no hay dato, se deja vacío y
 *   el sitio simplemente no muestra los años.
 * - `projects`: slugs de src/content/projects/ donde la aplicaste. Generan enlaces.
 *
 * El PDF del CV sigue usando la lista `skills` de resume.*.json; esta es la versión
 * detallada para la web.
 */
import type { Lang } from '../i18n/ui';

export type Skill = { name: string; since?: number; projects?: string[] };
export type SkillGroup = {
  id: 'frontend' | 'backend' | 'data' | 'ai' | 'tools' | 'soft';
  title: Record<Lang, string>;
  skills: Skill[];
  /** Pendiente de completar. Solo se ve en desarrollo (npm run dev). */
  todo?: string;
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: { es: 'Backend', en: 'Backend' },
    skills: [
      { name: 'Python', since: 2021 },
      { name: 'Django / DRF', since: 2021 },
      { name: 'Celery', since: 2021 },
      { name: 'FastAPI', since: 2023 },
      { name: 'Flask', since: 2023 },
      { name: 'Node.js / Fastify', since: 2026, projects: ['nexor-one'] },
      { name: 'Java', since: 2023 },
      { name: 'APIs REST', since: 2021, projects: ['nexor-one'] },
    ],
  },
  {
    id: 'frontend',
    title: { es: 'Frontend', en: 'Frontend' },
    skills: [
      { name: 'React', since: 2025, projects: ['nexor-one'] },
      { name: 'Next.js', since: 2026, projects: ['nexor-one'] },
      { name: 'TypeScript', since: 2026, projects: ['nexor-one'] },
      { name: 'Tailwind CSS', since: 2026, projects: ['nexor-one'] },
      { name: 'Astro', since: 2026 },
    ],
  },
  {
    id: 'data',
    title: { es: 'Bases de datos y datos', en: 'Databases & data' },
    skills: [
      { name: 'SQL', since: 2021 },
      { name: 'PostgreSQL', since: 2026, projects: ['nexor-one'] },
      { name: 'Redis', since: 2026, projects: ['nexor-one'] },
      { name: 'NoSQL', since: 2023 },
      { name: 'ETL (AWS Glue)', since: 2023 },
      { name: 'Power BI', since: 2023 },
    ],
  },
  {
    id: 'ai',
    title: { es: 'IA, agentes y automatización', en: 'AI, agents & automation' },
    skills: [
      { name: 'Agentes con LLM', since: 2023, projects: ['nexor-one'] },
      { name: 'Claude API (tool use)', since: 2026, projects: ['nexor-one'] },
      { name: 'LangChain / LlamaIndex', since: 2023 },
      { name: 'n8n', since: 2025 },
      { name: 'Automatización de procesos', since: 2023 },
      { name: 'AWS Bedrock / SageMaker', since: 2023 },
      { name: 'Visión por computadora', since: 2022 },
      { name: 'OCR', since: 2022, projects: ['nexor-one'] },
      { name: 'NLP', since: 2022 },
      { name: 'MLOps', since: 2022 },
    ],
  },
  {
    id: 'tools',
    title: { es: 'Cloud y herramientas', en: 'Cloud & tools' },
    skills: [
      { name: 'AWS (Lambda, S3, CloudWatch, API Gateway, RDS)', since: 2023 },
      { name: 'Docker', since: 2024 },
      { name: 'Git', since: 2021, projects: ['nexor-one'] },
      { name: 'CI/CD', since: 2024 },
      { name: 'Vercel / Railway', since: 2026, projects: ['nexor-one'] },
      { name: 'Playwright', since: 2024, projects: ['nexor-one'] },
      { name: 'Selenium', since: 2024 },
      { name: 'k6', since: 2026, projects: ['nexor-one'] },
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

/** Todas las tecnologías de la web, para contar el indicador "tecnologías". */
export const skillCount = skillGroups.filter((g) => g.id !== 'soft').reduce((n, g) => n + g.skills.length, 0);
