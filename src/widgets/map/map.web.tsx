import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MAP_STYLE } from '@widgets/map/config/map-style';
import { GeoJSONSource } from 'maplibre-gl';
import { startLocationTracking } from '@shared/lib/geolocation/start-location-tracking';

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
    const socket = new WebSocket('ws://localhost:3001');
    const stopLocationTracking = startLocationTracking((lat, lng) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            event: 'location',
            data: {
              userId: 'user-1',
              lat,
              lng,
            },
          }),
        );
      }
    });
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event !== 'location') return;

      const { userId, lat, lng } = message.data;

      const source = map.getSource('users');

      if (!source || source.type !== 'geojson') return;

      (source as GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: {
              id: userId,
            },
          },
        ],
      });
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      stopLocationTracking();
      socket.close();
      map.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
