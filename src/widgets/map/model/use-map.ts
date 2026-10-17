import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';

import { MAP_STYLE } from '../config/map-style';

export function useMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [43.84461, 46.93785],
      zoom: 5,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    const deckOverlay = new MapboxOverlay({
      layers: [],
    });

    map.addControl(deckOverlay);

    mapRef.current = map;
    deckOverlayRef.current = deckOverlay;

    return () => {
      map.remove();

      mapRef.current = null;
      deckOverlayRef.current = null;
    };
  }, [containerRef]);

  return {
    mapRef,
    deckOverlayRef,
  };
}
