import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useRef } from 'react';
import type { GeoJSONSource } from 'maplibre-gl';
import { useMap } from '@widgets/map/hooks/use-map';
import { useLocationSocket } from '../../feature/location/use-location-socket';
import { usePikasSocket } from '../../feature/pikas/use-pikas-socket';
import type { Location, PikasVehicle } from '@shared/lib';
import { updateUserLocation } from '@widgets/map/layers/dynamic/user-update';
import { createVehiclesLayer } from '@widgets/map/layers/dynamic/vehicles';

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
    (vehicles: PikasVehicle[]) => {
      const layer = createVehiclesLayer(vehicles);

      deckOverlayRef.current?.setProps({
        layers: [layer],
      });
    },
    [deckOverlayRef],
  );

  useLocationSocket(handleLocation);
  usePikasSocket(handleVehicles);

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
