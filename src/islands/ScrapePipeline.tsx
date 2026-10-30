import { useEffect, useRef, useState } from 'react';

type Lang = 'es' | 'en';

const copy = {
  es: {
    run: 'Ejecutar corrida',
    running: 'Ejecutando…',
    reset: 'Reiniciar',
    stages: ['Descarga', 'Render', 'Extracción', 'Normalización', 'Carga'],
    rows: 'filas',
    retries: 'reintentos',
    dropped: 'descartadas',
    elapsed: 'duración',
    idle: 'En espera. La corrida usa un conjunto de datos de ejemplo.',
    done: 'Corrida completa.',
  },
  en: {
    run: 'Run pipeline',
    running: 'Running…',
    reset: 'Reset',
    stages: ['Fetch', 'Render', 'Extract', 'Normalize', 'Load'],
    rows: 'rows',
    retries: 'retries',
    dropped: 'dropped',
    elapsed: 'elapsed',
    idle: 'Idle. The run uses a sample dataset.',
    done: 'Run complete.',
  },
} as const;

/** Perfil de la corrida simulada: filas que entran y salen de cada etapa. */
const profile = [
  { in: 480, out: 480, retries: 12, ms: 900 },
  { in: 480, out: 471, retries: 5, ms: 1200 },
  { in: 471, out: 463, retries: 0, ms: 700 },
  { in: 463, out: 458, retries: 0, ms: 500 },
  { in: 458, out: 458, retries: 1, ms: 600 },
];

export default function ScrapePipeline({ lang = 'es' }: { lang?: Lang }) {
  const t = copy[lang];
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setStage(-1);
    setElapsed(0);

    let acc = 0;
    profile.forEach((step, i) => {
      acc += step.ms;
      const id = window.setTimeout(() => {
        setStage(i);
        setElapsed(acc);
        if (i === profile.length - 1) setRunning(false);
      }, acc);
      timers.current.push(id);
    });
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setRunning(false);
    setStage(-1);
    setElapsed(0);
  }

  const totals = profile.slice(0, stage + 1).reduce(
    (a, s) => ({ retries: a.retries + s.retries, dropped: a.dropped + (s.in - s.out) }),
    { retries: 0, dropped: 0 }
  );
  const rows = stage >= 0 ? profile[stage].out : 0;
  const finished = stage === profile.length - 1 && !running;

  return (
    <div className="console">
      <div className="console__bar">
        <span className="console__status">
          <i className={`console__dot ${running ? 'is-run' : finished ? 'is-ok' : ''}`} />
          {running ? t.running : finished ? t.done : t.idle}
        </span>
        <span className="console__actions">
          <button className="btn btn--primary btn--sm" onClick={run} disabled={running}>
            {t.run}
          </button>
          <button className="btn btn--secondary btn--sm" onClick={reset} disabled={running || stage < 0}>
            {t.reset}
          </button>
        </span>
      </div>

      <ol className="stages">
        {t.stages.map((name, i) => {
          const state = i < stage || finished ? 'done' : i === stage ? 'active' : 'idle';
          return (
            <li key={name} className={`stage stage--${state}`}>
              <span className="stage__idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="stage__name">{name}</span>
              <span className="stage__count">
                {i <= stage ? `${profile[i].out} ${t.rows}` : '—'}
              </span>
            </li>
          );
        })}
      </ol>

      <dl className="meters">
        <div>
          <dt>{t.rows}</dt>
          <dd>{rows}</dd>
        </div>
        <div>
          <dt>{t.retries}</dt>
          <dd>{totals.retries}</dd>
        </div>
        <div>
          <dt>{t.dropped}</dt>
          <dd className={totals.dropped > 0 ? 'is-warn' : ''}>{totals.dropped}</dd>
        </div>
        <div>
          <dt>{t.elapsed}</dt>
          <dd>{(elapsed / 1000).toFixed(1)}s</dd>
        </div>
      </dl>
    </div>
  );
}
