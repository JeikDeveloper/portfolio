/**
 * Lee los repositorios públicos de GitHub al compilar el sitio (una sola llamada).
 *
 * - Sin GITHUB_TOKEN funciona igual, pero GitHub limita a 60 consultas por hora por IP;
 *   en Vercel la IP es compartida, así que conviene configurar el token.
 * - Si GitHub no responde, devuelve null y la sección simplemente no aparece:
 *   el build nunca falla por esto.
 */
import { GITHUB_TOKEN } from 'astro:env/server';
import { github } from '../data/github';

export type Repo = {
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  stars: number;
  pushedAt: Date;
};

export type GitHubData = {
  profileUrl: string;
  publicRepos: number;
  repos: Repo[];
  /** Lenguaje principal de cada repo, contado por número de repositorios. */
  languages: { name: string; count: number; share: number }[];
};

type ApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

let cache: Promise<GitHubData | null> | undefined;

/** Datos de GitHub, pedidos una sola vez por build. */
export function getGitHub() {
  cache ??= load();
  return cache;
}

async function load(): Promise<GitHubData | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-build',
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/users/${github.user}/repos?per_page=100&type=owner&sort=pushed`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`GitHub respondió ${res.status}`);
    const all = (await res.json()) as ApiRepo[];

    // Forks, archivados, ocultos y el repo de perfil (usuario/usuario) no cuentan.
    const own = all.filter(
      (r) => !r.fork && !r.archived && !github.hidden.includes(r.name) && r.name.toLowerCase() !== github.user.toLowerCase()
    );

    const rank = (r: ApiRepo) => {
      const i = github.pinned.indexOf(r.name);
      return i === -1 ? Infinity : i;
    };
    const repos = [...own]
      .sort((a, b) => rank(a) - rank(b) || Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, github.limit)
      .map<Repo>((r) => ({
        name: r.name,
        description: r.description || undefined,
        url: r.html_url,
        homepage: r.homepage || undefined,
        language: r.language || undefined,
        stars: r.stargazers_count,
        pushedAt: new Date(r.pushed_at),
      }));

    const counts = new Map<string, number>();
    own.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    const languages = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([name, count]) => ({ name, count, share: count / total }));

    return { profileUrl: `https://github.com/${github.user}`, publicRepos: own.length, repos, languages };
  } catch (err) {
    console.warn(`[github] No se pudieron leer los repositorios: ${(err as Error).message}. Se omite la sección.`);
    return null;
  }
}
