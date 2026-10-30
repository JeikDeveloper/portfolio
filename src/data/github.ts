/**
 * Qué repositorios de GitHub se muestran en la página de proyectos.
 * Los datos se leen de la API pública de GitHub al compilar el sitio.
 */
export const github = {
  /** Usuario de GitHub. */
  user: 'JeikDeveloper',
  /**
   * Repositorios que van primero, en este orden (nombre exacto del repo).
   * Si lo dejas vacío, se muestran los que tuvieron cambios más recientes.
   */
  pinned: [] as string[],
  /** Repositorios que nunca se muestran (prácticas viejas, pruebas…). */
  hidden: [] as string[],
  /** Cuántos repositorios mostrar. */
  limit: 6,
};
