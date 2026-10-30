import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// Dominio final del sitio. De aquí salen canonical, hreflang, Open Graph, RSS y sitemap.
// Si cambias de dominio, cámbialo aquí, en public/robots.txt y en basics.url de los resume JSON.
const SITE = 'https://jeikdeveloper.vercel.app';

export default defineConfig({
  site: SITE,
  // 'ignore' y no 'always': el panel de Keystatic navega con rutas sin barra final.
  // Los enlaces del sitio siempre la llevan (ver path() en src/i18n/utils.ts).
  trailingSlash: 'ignore',

  // Todo el sitio se genera estático. Solo el formulario (/api/contact) y el panel
  // (/keystatic) corren como funciones en Vercel.
  output: 'static',
  adapter: vercel(),

  integrations: [
    react(),
    mdx(),
    keystatic(),
    sitemap({
      // Fuera del sitemap: plantillas de impresión del CV, la raíz (solo redirige) y el panel.
      filter: (page) => !page.includes('/print/') && !page.includes('/keystatic') && page !== `${SITE}/`,
      i18n: { defaultLocale: 'es', locales: { es: 'es-CO', en: 'en-US' } },
    }),
  ],

  markdown: {
    // Resaltado de código con un tema para claro y otro para oscuro.
    // El cambio entre los dos lo hace src/styles/prose.css.
    shikiConfig: {
      // Variantes "default": sus comentarios cumplen el contraste mínimo (WCAG AA).
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
      defaultColor: false,
      wrap: false,
    },
  },

  // Variables de entorno tipadas. Todas son opcionales: sin ellas el sitio compila,
  // y el formulario avisa que no está disponible.
  env: {
    schema: {
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  build: { inlineStylesheets: 'auto' },
  vite: {
    build: { cssCodeSplit: false },
    // Keystatic importa módulos virtuales de Astro (astro:env); el pre-empaquetado
    // de Vite no los conoce y deja el panel en blanco en desarrollo, así que se excluye.
    // React y Keystatic sí se pre-empaquetan juntos desde el arranque: si Vite los
    // descubre por separado, en desarrollo quedan dos copias y fallan los demos
    // ("jsxDEV is not a function") o el panel ("ConfigContext.Provider not found").
    optimizeDeps: {
      exclude: ['@keystatic/astro'],
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@keystatic/core',
        '@keystatic/core/ui',
        '@keystatic/core/content-components',
      ],
    },
  },
});
