import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { GeoJSONSource } from 'maplibre-gl';
import { useCurrentFamily, useFamilyMembers } from '@entities/family';
import { useSessionFamilyId } from '@entities/session';
import type { Bus, VehicleSnapshot } from '@entities/vehicle';
import { useLocationZones } from '@entities/zone';
import { useMap } from './model/use-map';
import { createVehiclesLayer } from './layers/dynamic/vehicles';
import {
  ZONE_LAYERS,
  ZONE_LAYER_IDS,
  ZONE_SOURCE,
  zonesToGeoJson,
} from './layers/dynamic/zones';
import {
  useFamilyLocations,
  useLiveHiddenAccess,
  useLiveLocations,
  type LiveLocation,
} from '@features/location';
import { busRouteKey, BusPlayback, useBusesSocket } from '@features/buses';
import { RoadPath } from './model/road-path';
import {
  defaultMapColor,
  type MapLayerSettings,
} from './model/layer-preferences';
import { useUserAvatarUrls } from './model/use-user-avatar-urls';
import { UserMarker } from './ui/user-marker.web';

type MarkerLocation = LiveLocation;

/** Класс контейнера большой карты: под ним перекрашены кнопки MapLibre. */
const MAP_CLASS = 'dr-map';

const svgIcon = (path: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'><path d='${path}' stroke='#1A1A2E' stroke-width='2.2' stroke-linecap='round'/></svg>`,
  )}")`;

/**
 * Кнопки масштаба как в макете: белая капсула 44 с мягкой тенью, «+» и «−»
 * цвета текста, между ними короткая черта. Стили MapLibre задаются классами
 * в DOM, поэтому правим их CSS-правилами, только внутри большой карты.
 */
const ZOOM_CONTROL_CSS = `
.${MAP_CLASS} .maplibregl-ctrl-top-right .maplibregl-ctrl {
  margin: 12px 16px 0 0;
}
.${MAP_CLASS} .maplibregl-ctrl-group:not(:empty) {
  border-radius: 22px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.${MAP_CLASS} .maplibregl-ctrl-group button {
  width: 44px;
  height: 44px;
}
.${MAP_CLASS} .maplibregl-ctrl-group button + button {
  border-top: 0;
  background-image: linear-gradient(#ECEDF3, #ECEDF3);
  background-size: 24px 1px;
  background-position: center top;
  background-repeat: no-repeat;
}
.${MAP_CLASS} .maplibregl-ctrl button.maplibregl-ctrl-zoom-in .maplibregl-ctrl-icon {
  background-image: ${svgIcon('M10 3.64V16.36M3.64 10H16.36')};
}
.${MAP_CLASS} .maplibregl-ctrl button.maplibregl-ctrl-zoom-out .maplibregl-ctrl-icon {
  background-image: ${svgIcon('M3.64 10H16.36')};
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = ZOOM_CONTROL_CSS;
  document.head.appendChild(style);
}

const later = (a: string | undefined, b: string | undefined) => {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
};

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

  const { mapRef, deckOverlayRef, map } = useMap(containerRef);
  const playback = useMemo(() => new BusPlayback(), []);
  const roadPath = useMemo(() => new RoadPath(), []);
  const requestDraw = useRef<() => void>(() => {});
  const liveLocations = useLiveLocations();
  const hiddenAccess = useLiveHiddenAccess();

  const cachedFamilyId = useCurrentFamily()?.id ?? null;
  const sessionFamilyId = useSessionFamilyId();
  const familyId = cachedFamilyId ?? sessionFamilyId;
  const { data: members = [] } = useFamilyMembers(familyId);
  const { data: savedLocations = [] } = useFamilyLocations(familyId);
  const { data: zones = [] } = useLocationZones(familyId);

  const childMembers = useMemo(
    () => members.filter((member) => member.kind === 'child' && member.childId),
    [members],
  );
  const peopleById = useMemo(
    () =>
      new Map(childMembers.map((member) => [member.userId, member] as const)),
    [childMembers],
  );
  const zoneNames = useMemo(
    () => new Map(zones.map((zone) => [zone.id, zone.name] as const)),
    [zones],
  );
  const avatarUsers = useMemo(
    () =>
      childMembers.map((member) => ({
        id: member.userId,
        avatarUrl: member.avatarUrl,
      })),
    [childMembers],
  );
  const avatarUrls = useUserAvatarUrls(avatarUsers);

  // Скрытые пункты нужны внутри циклов отрисовки и обработчиков без
  // пересоздания сокетов и эффектов на каждое переключение.
  const hiddenRoutesRef = useRef(hiddenRoutes);
  const pinnedRoutesRef = useRef(pinnedRoutes);

  const markers = useMemo(() => {
    const points = new Map<string, MarkerLocation>();
    for (const location of savedLocations) {
      if (!location.childId) continue;
      points.set(location.userId, {
        userId: location.userId,
        childId: location.childId,
        lat: location.lat,
        lng: location.lng,
        zoneId: location.zoneId,
        deviceId: location.deviceId,
        deviceLabel: location.deviceLabel || 'Устройство',
        updatedAt: location.recordedAt ?? location.updatedAt,
      });
    }
    for (const [userId, location] of Object.entries(liveLocations)) {
      if (!location.childId) continue;
      const previous = points.get(userId);
      points.set(userId, {
        ...location,
        userId,
        updatedAt: later(
          previous?.updatedAt,
          location.recordedAt ?? location.updatedAt,
        ),
      });
    }
    return [...points.values()].filter(
      (location) =>
        !hiddenChildren.includes(location.userId) &&
        !hiddenAccess[location.userId] &&
        peopleById.has(location.userId),
    );
  }, [hiddenAccess, hiddenChildren, liveLocations, peopleById, savedLocations]);

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
      for (const layer of ZONE_LAYERS) {
        if (map.getLayer(layer.id)) continue;
        map.addLayer(layer);
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
  }, [areas, mapRef]);

  useBusesSocket(handleVehicles);

  return (
    <div
      ref={containerRef}
      className={MAP_CLASS}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {map && family
        ? markers.map((location) => {
            const member = peopleById.get(location.userId)!;
            return (
              <UserMarker
                key={location.userId}
                map={map}
                user={{
                  id: location.userId,
                  lat: location.lat,
                  lng: location.lng,
                  name: member.displayName,
                  avatarUrl: avatarUrls[location.userId] ?? null,
                  color: member.mapColor ?? defaultMapColor(member.kind),
                  inZone: !!location.zoneId,
                  zoneName: location.zoneId
                    ? (zoneNames.get(location.zoneId) ?? null)
                    : null,
                  deviceLabel: location.deviceLabel,
                  updatedAt: location.updatedAt,
                }}
              />
            );
          })
        : null}
    </div>
  );
}
