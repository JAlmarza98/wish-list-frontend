import { environment } from '@envs/environment';

declare global {
  interface Window {
    __env?: { apiUrl?: string };
  }
}

/**
 * La URL de la API se puede fijar en tiempo de arranque del contenedor Docker
 * (ver docker-entrypoint.d/30-wishu-env.sh), vía window.__env.apiUrl, para que
 * la misma imagen sirva para cualquier dominio. En desarrollo (`ng serve`) o
 * si no se inyectó nada, cae de vuelta a environment.apiUrl.
 */
export function apiUrl(): string {
  const injected = window.__env?.apiUrl;
  return injected ? injected : environment.apiUrl;
}
