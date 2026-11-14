import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { GeoJSONSource } from 'maplibre-gl';
import { useCurrentFamily } from '@entities/family';
import type { Location } from '@entities/user';
import type { Bus, VehicleSnapshot } from '@entities/vehicle';
import { useLocationZones } from '@entities/zone';
import { useMap } from './model/use-map';
import {
  setUserLocations,
  type UserLocation,
} from './layers/dynamic/user-update';
import { createVehiclesLayer } from './layers/dynamic/vehicles';
import {
  ZONE_LAYERS,
  ZONE_LAYER_IDS,
  ZONE_SOURCE,
  zonesToGeoJson,
} from './layers/dynamic/zones';
import { useLocationSocket } from '@features/location';
import { busRouteKey, BusPlayback, useBusesSocket } from '@features/buses';
import { RoadPath } from './model/road-path';
import type { MapLayerSettings } from './model/layer-preferences';

export function MapWeb({
  family,
  transport,
  areas,
  hiddenChildren,
  hiddenRoutes,
  hiddenZones,
  pinnedRoutes,
}: MapLayerSettings) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { mapRef, deckOverlayRef } = useMap(containerRef);
  const playback = useMemo(() => new BusPlayback(), []);
  const roadPath = useMemo(() => new RoadPath(), []);
  const requestDraw = useRef<() => void>(() => {});
  const locations = useRef(new Map<string, UserLocation>());

  const familyId = useCurrentFamily()?.id ?? null;
  const { data: zones = [] } = useLocationZones(familyId);

  // Скрытые пункты нужны внутри циклов отрисовки и обработчиков без
  // пересоздания сокетов и эффектов на каждое переключение.
  const hiddenChildrenRef = useRef(hiddenChildren);
  const hiddenRoutesRef = useRef(hiddenRoutes);
  const pinnedRoutesRef = useRef(pinnedRoutes);

  const drawLocations = useCallback(() => {
    const source = mapRef.current?.getSource('users');
    if (!source || source.type !== 'geojson') return;

    const hidden = new Set(hiddenChildrenRef.current);
    setUserLocations(
      source as GeoJSONSource,
      [...locations.current.values()].filter(({ id }) => !hidden.has(id)),
    );
  }, [mapRef]);

  const handleLocation = useCallback(
    ({ childId, userId, lat, lng }: Location) => {
      const id = childId ?? userId;
      locations.current.set(id, { id, lat, lng });
      drawLocations();
    },
    [drawLocations],
  );

  const handleVehicles = useCallback(
    (vehicles: Bus[], serverTime?: number, history?: VehicleSnapshot[]) => {
      if (history?.length)
        playback.ingestHistory(history, Date.now(), serverTime);
      playback.ingest(vehicles, Date.now(), serverTime);
      requestDraw.current();
    },
    [playback],
  );

  useEffect(() => {
    hiddenChildrenRef.current = hiddenChildren;
    drawLocations();
  }, [drawLocations, hiddenChildren]);

  useEffect(() => {
    hiddenRoutesRef.current = hiddenRoutes;
    requestDraw.current();
  }, [hiddenRoutes]);

  useEffect(() => {
    pinnedRoutesRef.current = pinnedRoutes;
    requestDraw.current();
  }, [pinnedRoutes]);

  useEffect(() => {
    const map = mapRef.current;
    const overlay = deckOverlayRef.current;
    if (!map || !overlay) return;
    if (!transport) {
      overlay.setProps({ layers: [] });
      requestDraw.current = () => {};
      return;
    }

    let animation = 0;
    let lastRender = -Infinity;
    let previous: Bus[] = [];
    let bounds = map.getBounds();
    let roadRefresh = 0;
    let roadsDirty = true;

    function refreshRoads() {
      if (!roadsDirty) return;
      window.clearTimeout(roadRefresh);
      roadRefresh = window.setTimeout(() => {
        if (roadPath.rebuild(map!)) {
          playback.setRoadMatcher(roadPath);
          roadsDirty = false;
          schedule();
        }
      }, 120);
    }

    function draw(time: number) {
      animation = 0;
      if (document.hidden) return;
      if (time - lastRender < 16) {
        schedule();
        return;
      }
      lastRender = time;
      const west = bounds.getWest() - 0.01;
      const east = bounds.getEast() + 0.01;
      const south = bounds.getSouth() - 0.01;
      const north = bounds.getNorth() + 0.01;
      const { vehicles, active } = playback.frame(
        Date.now(),
        (lng, lat) =>
          lat >= south &&
          lat <= north &&
          lng + Math.ceil((west - lng) / 360) * 360 <= east,
      );
      // Скрытые в настройках слоёв маршруты не рисуем, но из истории
      // проигрывания не выбрасываем: вернули галочку — машины на месте.
      const hidden = new Set(hiddenRoutesRef.current);
      const pinned = pinnedRoutesRef.current;
      const visible = vehicles.filter(
        (bus) =>
          (pinned.length === 0 || pinned.includes(bus.route)) &&
          !hidden.has(busRouteKey(bus)),
      );
      if (
        visible.length !== previous.length ||
        visible.some((bus, i) => {
          const old = previous[i];
          return (
            bus.vehicle !== old.vehicle ||
            bus.route !== old.route ||
            bus.longitude !== old.longitude ||
            bus.latitude !== old.latitude ||
            bus.bearing !== old.bearing
          );
        })
      ) {
        overlay!.setProps({
          layers: visible.length ? [createVehiclesLayer(visible)] : [],
        });
        previous = visible;
      }
      if (active) schedule();
    }

    function schedule() {
      if (!animation && !document.hidden)
        animation = requestAnimationFrame(draw);
    }

    function onMove() {
      bounds = map!.getBounds();
      roadsDirty = true;
      schedule();
    }

    requestDraw.current = schedule;
    const expiry = setInterval(schedule, 1_000);
    playback.setRoadMatcher(roadPath);
    map.on('move', onMove);
    map.on('idle', refreshRoads);
    refreshRoads();
    document.addEventListener('visibilitychange', schedule);
    return () => {
      requestDraw.current = () => {};
      playback.setRoadMatcher(null);
      cancelAnimationFrame(animation);
      clearInterval(expiry);
      window.clearTimeout(roadRefresh);
      map.off('move', onMove);
      map.off('idle', refreshRoads);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [deckOverlayRef, mapRef, playback, roadPath, transport]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyZones = () => {
      if (!map.isStyleLoaded()) return;

      const data = zonesToGeoJson(zones, hiddenZones);
      const source = map.getSource(ZONE_SOURCE);
      if (source && source.type === 'geojson') {
        (source as GeoJSONSource).setData(data);
      } else {
        map.addSource(ZONE_SOURCE, { type: 'geojson', data });
      }

      // Зоны под точками детей, но над подложкой карты.
      const before = map.getLayer('users') ? 'users' : undefined;
      for (const layer of ZONE_LAYERS) {
        if (map.getLayer(layer.id)) continue;
        map.addLayer(layer, before);
        // Слой добавили уже после переключения «Областей»: применяем
        // текущую видимость сразу, иначе он мигнёт поверх выключенного слоя.
        map.setLayoutProperty(
          layer.id,
          'visibility',
          areas ? 'visible' : 'none',
        );
      }
    };

    applyZones();
    map.on('load', applyZones);
    map.on('styledata', applyZones);
    return () => {
      map.off('load', applyZones);
      map.off('styledata', applyZones);
    };
  }, [areas, hiddenZones, mapRef, zones]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyVisibility = () => {
      const visibility = family ? 'visible' : 'none';
      if (map.getLayer('users'))
        map.setLayoutProperty('users', 'visibility', visibility);
      const areasVisibility = areas ? 'visible' : 'none';
      for (const layerId of ZONE_LAYER_IDS) {
        if (map.getLayer(layerId))
          map.setLayoutProperty(layerId, 'visibility', areasVisibility);
      }
    };

    applyVisibility();
    map.on('load', applyVisibility);
    map.on('styledata', applyVisibility);
    return () => {
      map.off('load', applyVisibility);
      map.off('styledata', applyVisibility);
    };
  }, [areas, family, mapRef]);

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
