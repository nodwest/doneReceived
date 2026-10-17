import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useRef } from 'react';
import type { GeoJSONSource } from 'maplibre-gl';
import { useMap } from './model/use-map';
import type { Location } from '@entities/user';
import type { BusesVehicle } from '@entities/vehicle';
import { updateUserLocation } from './layers/dynamic/user-update';
import { createVehiclesLayer } from './layers/dynamic/vehicles';
import { useLocationSocket } from '@features/location';
import { useBusesSocket } from '@features/buses';

export function MapWeb() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { mapRef, deckOverlayRef } = useMap(containerRef);

  const handleLocation = useCallback(
    ({ userId, lat, lng }: Location) => {
      const map = mapRef.current;

      if (!map) return;

      const source = map.getSource('users');

      if (!source || source.type !== 'geojson') return;

      updateUserLocation(source as GeoJSONSource, userId, lat, lng);
    },
    [mapRef],
  );

  const handleVehicles = useCallback(
    (vehicles: BusesVehicle[]) => {
      const layer = createVehiclesLayer(vehicles);

      deckOverlayRef.current?.setProps({
        layers: [layer],
      });
    },
    [deckOverlayRef],
  );

  useLocationSocket(handleLocation);
  useBusesSocket(handleVehicles);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
