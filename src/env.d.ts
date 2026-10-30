/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /**
     * Rutas exactas de esta página en cada idioma. Si falta un idioma (p. ej. un
     * artículo escrito solo en español), el selector lleva a `langFallback` en ese idioma.
     */
    alternates?: Partial<Record<'es' | 'en', string>>;
    /** Sección a la que lleva el selector cuando no hay traducción (p. ej. "blog"). */
    langFallback?: string;
  }
}
