import { useState } from 'react';

type Lang = 'es' | 'en';

const copy = {
  es: {
    send: 'Enviar petición',
    sending: 'Enviando…',
    endpoint: 'Endpoint',
    status: 'Estado',
    latency: 'Latencia',
    size: 'Tamaño',
    body: 'Respuesta',
    idle: 'Elige un endpoint y envía la petición.',
    error: 'La petición falló. Revisa la consola del navegador para el detalle.',
  },
  en: {
    send: 'Send request',
    sending: 'Sending…',
    endpoint: 'Endpoint',
    status: 'Status',
    latency: 'Latency',
    size: 'Size',
    body: 'Response',
    idle: 'Pick an endpoint and send the request.',
    error: 'Request failed. Check the browser console for detail.',
  },
} as const;

/**
 * Reemplaza estos endpoints por servicios tuyos desplegados.
 * Cualquier URL pública que responda JSON con CORS abierto funciona aquí.
 */
const endpoints = [
  { method: 'GET', label: 'perfil', url: 'https://api.github.com/users/JeikDeveloper' },
  { method: 'GET', label: 'repos', url: 'https://api.github.com/users/JeikDeveloper/repos?per_page=3' },
];

type Result = { status: number; ms: number; bytes: number; body: string } | null;

export default function EndpointConsole({ lang = 'es' }: { lang?: Lang }) {
  const t = copy[lang];
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [failed, setFailed] = useState(false);

  async function send() {
    setBusy(true);
    setFailed(false);
    const started = performance.now();
    try {
      const res = await fetch(endpoints[selected].url, { headers: { Accept: 'application/json' } });
      const text = await res.text();
      const ms = Math.round(performance.now() - started);
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {}
      setResult({
        status: res.status,
        ms,
        bytes: new Blob([text]).size,
        body: pretty.slice(0, 1400),
      });
    } catch (err) {
      console.error(err);
      setFailed(true);
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  const ok = result && result.status >= 200 && result.status < 300;

  return (
    <div className="console">
      <div className="console__bar">
        <span className="console__status">
          <i className={`console__dot ${busy ? 'is-run' : ok ? 'is-ok' : failed ? 'is-bad' : ''}`} />
          {failed ? t.error : result ? `${result.status} · ${result.ms}ms` : t.idle}
        </span>
        <span className="console__actions">
          <button className="btn btn--primary btn--sm" onClick={send} disabled={busy}>
            {busy ? t.sending : t.send}
          </button>
        </span>
      </div>

      <div className="routes">
        {endpoints.map((e, i) => (
          <button
            key={e.url}
            className={`route ${i === selected ? 'is-active' : ''}`}
            onClick={() => setSelected(i)}
            disabled={busy}
          >
            <span className="route__method">{e.method}</span>
            <span className="route__label">/{e.label}</span>
          </button>
        ))}
      </div>

      {result && (
        <>
          <dl className="meters">
            <div>
              <dt>{t.status}</dt>
              <dd className={ok ? '' : 'is-warn'}>{result.status}</dd>
            </div>
            <div>
              <dt>{t.latency}</dt>
              <dd>{result.ms}ms</dd>
            </div>
            <div>
              <dt>{t.size}</dt>
              <dd>{(result.bytes / 1024).toFixed(1)}kb</dd>
            </div>
          </dl>
          <pre className="payload">
            <code>{result.body}</code>
          </pre>
        </>
      )}
    </div>
  );
}
