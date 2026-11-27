import type { Map } from 'maplibre-gl';

type PaintProperty = Parameters<Map['setPaintProperty']>[1];
type PaintValue = Parameters<Map['setPaintProperty']>[2];

/** Applies paint from typed layer specifications without replacing runtime layers. */
export function applyMapPaint(map: Map, id: string, paint: object) {
  for (const [property, value] of Object.entries(paint) as [
    PaintProperty,
    PaintValue,
  ][]) {
    map.setPaintProperty(id, property, value);
  }
}
