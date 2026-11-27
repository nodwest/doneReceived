import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';

import { createMap } from './create-map';
import { useWebMapStyle } from './use-web-map-style';

export function useMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = createMap(containerRef.current, {
      center: [39.7152, 47.23325],
      zoom: 12,
      // Подпись источников рисует MapAttribution: плашка MapLibre в углу
      // с брендом библиотеки не нужна (BSD-3-Clause этого не требует).
      attributionControl: false,
    });

    // Только масштаб, как в макете: без компаса.
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right',
    );

    const deckOverlay = new MapboxOverlay({
      layers: [],
      deviceProps: { debug: false, debugWebGL: false },
    });

    map.addControl(deckOverlay);

    mapRef.current = map;
    deckOverlayRef.current = deckOverlay;
    setMap(map);

    return () => {
      map.remove();

      mapRef.current = null;
      deckOverlayRef.current = null;
      setMap(null);
    };
  }, [containerRef]);

  useWebMapStyle(mapRef);

  return {
    mapRef,
    deckOverlayRef,
    map,
  };
}
