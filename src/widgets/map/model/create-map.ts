import * as maplibregl from 'maplibre-gl';
import { MAP_STYLE } from '../config/map-style';

// Воркер раздаётся из public/maplibre, версия совпадает с maplibre-gl.
const WORKER_URL = '/maplibre/maplibre-gl-worker.mjs';

type CreateMapOptions = Omit<maplibregl.MapOptions, 'container' | 'style'>;

/** Карта MapLibre со стилем приложения — общая для большой карты и превью. */
export function createMap(container: HTMLElement, options: CreateMapOptions) {
  maplibregl.setWorkerUrl(WORKER_URL);
  return new maplibregl.Map({ container, style: MAP_STYLE, ...options });
}
