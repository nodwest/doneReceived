import 'maplibre-gl/dist/maplibre-gl.css';
import './map.web.css';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { GeoJSONSource } from 'maplibre-gl';
import { useCurrentFamily, useFamilyMembers } from '@entities/family';
import { useSessionFamilyId } from '@entities/session';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import type { Bus, VehicleSnapshot } from '@entities/vehicle';
import { useLocationZones } from '@entities/zone';
import { useMap } from './model/use-map';
import { applyMapPaint } from './model/apply-map-paint';
import { createVehiclesLayer } from './layers/dynamic/vehicles';
import {
  ZONE_LAYERS,
  ZONE_SOURCE,
  zonesToGeoJson,
} from './layers/dynamic/zones';
import {
  useFamilyLocations,
  useLiveHiddenAccess,
  useLiveLocations,
} from '@features/location';
import { busRouteKey, BusPlayback, useBusesSocket } from '@features/buses';
import { RoadPath } from './model/road-path';
import { type MapLayerSettings } from './model/layer-preferences';
import { collectFamilyMarkers } from './model/family-markers';
import { UserMarker } from './ui/user-marker.web';
import { HistoryMapLayer } from './ui/history-map.web';
import type { HistoryMapProps } from './ui/history-map-model';

export function MapWeb({
  family,
  transport,
  areas,
  hiddenChildren,
  hiddenRoutes,
  hiddenZones,
  pinnedRoutes,
  history,
}: MapLayerSettings & { history?: HistoryMapProps }) {
  const { mode, colors } = useTheme();
  const { t } = useTranslation();
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

  const zoneNames = useMemo(
    () => new Map(zones.map((zone) => [zone.id, zone.name] as const)),
    [zones],
  );
  // Скрытые пункты нужны внутри циклов отрисовки и обработчиков без
  // пересоздания сокетов и эффектов на каждое переключение.
  const hiddenRoutesRef = useRef(hiddenRoutes);
  const pinnedRoutesRef = useRef(pinnedRoutes);

  // Общий с нативом набор меток: свежесть точки, правила видимости и имя
  // устройства по умолчанию больше не расходятся между платформами.
  const markers = useMemo(
    () =>
      collectFamilyMarkers({
        family,
        members,
        saved: savedLocations,
        live: liveLocations,
        hiddenChildren,
        hiddenAccess,
        deviceFallback: t('map.deviceFallback'),
      }),
    [
      family,
      hiddenAccess,
      hiddenChildren,
      liveLocations,
      members,
      savedLocations,
      t,
    ],
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
      const data = zonesToGeoJson(zones, hiddenZones);
      const source = map.getSource<GeoJSONSource>(ZONE_SOURCE);
      if (source) source.setData(data);
      else map.addSource(ZONE_SOURCE, { type: 'geojson', data });

      const visibility = areas ? 'visible' : 'none';
      for (const layer of ZONE_LAYERS[mode]) {
        if (!map.getLayer(layer.id)) {
          map.addLayer({
            ...layer,
            layout: { ...('layout' in layer ? layer.layout : {}), visibility },
          });
          continue;
        }
        map.setLayoutProperty(layer.id, 'visibility', visibility);
        applyMapPaint(map, layer.id, layer.paint);
      }
    };

    if (map.getStyle()?.layers.length) applyZones();
    else map.once('load', applyZones);
    return () => {
      map.off('load', applyZones);
    };
  }, [areas, hiddenZones, mapRef, mode, zones]);

  useBusesSocket(handleVehicles);

  return (
    <div
      ref={containerRef}
      className="dr-map"
      style={{
        width: '100%',
        height: '100%',
        color: colors.ink,
        ...{
          '--map-surface': colors.surface,
          '--map-line': colors.line,
        },
      }}
    >
      {map && history && <HistoryMapLayer {...history} map={map} />}
      {map && family
        ? markers.map((marker) => (
            <UserMarker
              key={marker.userId}
              map={map}
              user={{
                id: marker.userId,
                lat: marker.lat,
                lng: marker.lng,
                name: marker.name,
                avatarUrl: marker.avatarUrl,
                color: marker.color,
                inZone: !!marker.zoneId,
                zoneName: marker.zoneId
                  ? (zoneNames.get(marker.zoneId) ?? null)
                  : null,
                deviceLabel: marker.deviceLabel,
                updatedAt: marker.updatedAt,
              }}
            />
          ))
        : null}
    </div>
  );
}
