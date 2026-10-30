import { useState } from 'react';

type Lang = 'es' | 'en';

const copy = {
  es: { open: 'Abrir en pestaña nueva', width: 'ancho' },
  en: { open: 'Open in a new tab', width: 'width' },
} as const;

const sizes = [
  { id: 'phone', label: 'Móvil', labelEn: 'Phone', w: 375 },
  { id: 'tablet', label: 'Tableta', labelEn: 'Tablet', w: 768 },
  { id: 'desktop', label: 'Escritorio', labelEn: 'Desktop', w: 1280 },
] as const;

export default function ViewportFrame({
  lang = 'es',
  src,
  title,
}: {
  lang?: Lang;
  /** URL del sitio en vivo (campo "Demo en vivo" del proyecto). */
  src: string;
  title: string;
}) {
  const t = copy[lang];
  const [size, setSize] = useState<(typeof sizes)[number]>(sizes[2]);

  return (
    <div className="console">
      <div className="console__bar">
        <span className="console__actions">
          {sizes.map((s) => (
            <button
              key={s.id}
              className={`route ${s.id === size.id ? 'is-active' : ''}`}
              onClick={() => setSize(s)}
              aria-pressed={s.id === size.id}
            >
              {lang === 'es' ? s.label : s.labelEn}
            </button>
          ))}
        </span>
        <a className="console__link" href={src} target="_blank" rel="noopener noreferrer">
          {t.open} ↗
        </a>
      </div>

      <div className="frame">
        <div className="frame__stage" style={{ maxWidth: `${size.w}px` }}>
          <iframe
            src={src}
            title={title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            style={{ width: '100%', height: '460px', border: 0, background: '#fff' }}
          />
        </div>
      </div>

      <dl className="meters">
        <div>
          <dt>{t.width}</dt>
          <dd>{size.w}px</dd>
        </div>
      </dl>
    </div>
  );
}
