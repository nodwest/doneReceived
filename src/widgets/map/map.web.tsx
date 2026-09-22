import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MAP_STYLE } from '@widgets/map/config/map-style';

export function MapWeb() {
  const containerRef = useRef<HTMLDivElement>(null);

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

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
