import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Camera,
  GeoJSONSource,
  Images,
  Layer,
  Map as MapView,
  Marker,
  type CameraRef,
  type StyleSpecification,
} from '@maplibre/maplibre-react-native';

import { useCurrentFamily, useFamilyMembers } from '@entities/family';
import { useSessionFamilyId } from '@entities/session';
import type { Bus } from '@entities/vehicle';
import { useLocationZones } from '@entities/zone';
import { busRouteKey, useBusesSocket } from '@features/buses';
import {
  useFamilyLocations,
  useLiveHiddenAccess,
  useLiveLocations,
} from '@features/location';
import { authorizedImage } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, useNow } from '@shared/lib';
import { createStyles, theme, tracking } from '@shared/theme';
import { ApiImage } from '@shared/ui';
import { MAP_STYLE } from './config/map-style';
import {
  defaultMapColor,
  type MapLayerSettings,
} from './model/layer-preferences';
import { zonesToGeoJson } from './layers/dynamic/zones';
import { HistoryMapLayer } from './ui/history-map';
import type { HistoryMapProps } from './ui/history-map-model';

type FamilyMarker = {
  userId: string;
  childId: string;
  lat: number;
  lng: number;
  zoneId: string | null;
  deviceLabel: string;
  updatedAt?: string;
  name: string;
  avatarUrl: string | null;
  color: string;
};

const MAP_CENTER: [number, number] = [39.7152, 47.23325];
const MAP_STYLE_JSON = MAP_STYLE as unknown as StyleSpecification;
const MAP_IMAGES = { bus: require('../../../assets/bus-icon.png') };

/**
 * Нативная карта семьи. Базовая карта — тот же Protomaps/TileJSON; сложная
 * deck.gl-анимация и дорожная привязка сюда не переносятся, транспорт идёт
 * обычным GeoJSON-слоем из публичного PIKAS-потока.
 */
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
  const { t } = useTranslation();
  const now = useNow(60_000);
  const cameraRef = useRef<CameraRef>(null);
  const [zoom, setZoom] = useState(12);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);
  const [vehicles, setVehicles] = useState<Bus[]>([]);

  const cachedFamilyId = useCurrentFamily()?.id ?? null;
  const sessionFamilyId = useSessionFamilyId();
  const familyId = cachedFamilyId ?? sessionFamilyId;
  const { data: members = [] } = useFamilyMembers(familyId);
  const { data: savedLocations = [] } = useFamilyLocations(familyId);
  const { data: zones = [] } = useLocationZones(familyId);
  const liveLocations = useLiveLocations();
  const hiddenAccess = useLiveHiddenAccess();

  const childMembers = useMemo(
    () => members.filter((member) => member.kind === 'child' && member.childId),
    [members],
  );
  const peopleById = useMemo(
    () => new Map(childMembers.map((member) => [member.userId, member])),
    [childMembers],
  );
  const zoneNames = useMemo(
    () => new Map(zones.map((zone) => [zone.id, zone.name] as const)),
    [zones],
  );

  const markers = useMemo(() => {
    const points = new Map<string, FamilyMarker>();
    for (const location of savedLocations) {
      const member = peopleById.get(location.userId);
      if (!member?.childId || !location.childId) continue;
      points.set(location.userId, {
        userId: location.userId,
        childId: member.childId,
        lat: location.lat,
        lng: location.lng,
        zoneId: location.zoneId,
        deviceLabel: location.deviceLabel || t('map.deviceFallback'),
        updatedAt: location.recordedAt ?? location.updatedAt,
        name: member.displayName,
        avatarUrl: member.avatarUrl,
        color: member.mapColor ?? defaultMapColor('child'),
      });
    }
    for (const [userId, location] of Object.entries(liveLocations)) {
      const member = peopleById.get(userId);
      if (!member?.childId || !location.childId) continue;
      const previous = points.get(userId);
      const measuredAt = location.recordedAt ?? location.updatedAt;
      if (
        previous?.updatedAt &&
        (!measuredAt ||
          Date.parse(measuredAt) <= Date.parse(previous.updatedAt))
      )
        continue;
      points.set(userId, {
        userId,
        childId: member.childId,
        lat: location.lat,
        lng: location.lng,
        zoneId: location.zoneId,
        deviceLabel: location.deviceLabel || t('map.deviceFallback'),
        updatedAt: measuredAt,
        name: member.displayName,
        avatarUrl: member.avatarUrl,
        color: member.mapColor ?? defaultMapColor('child'),
      });
    }
    return [...points.values()].filter(
      (location) =>
        family &&
        !hiddenChildren.includes(location.userId) &&
        !hiddenAccess[location.userId],
    );
  }, [
    family,
    hiddenAccess,
    hiddenChildren,
    liveLocations,
    peopleById,
    savedLocations,
    t,
  ]);

  useBusesSocket(
    useCallback((next: Bus[]) => setVehicles(next), []),
    transport,
  );

  const buses = useMemo(() => {
    if (!transport) return null;
    const pinned = new Set(pinnedRoutes);
    const hidden = new Set(hiddenRoutes);
    const visible = vehicles.filter(
      (bus) =>
        (pinned.size === 0 || pinned.has(bus.route)) &&
        !hidden.has(busRouteKey(bus)),
    );
    return {
      type: 'FeatureCollection' as const,
      features: visible.map((bus) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [bus.longitude, bus.latitude],
        },
        properties: {
          bearing: bus.bearing,
          route: bus.route,
          vehicle: bus.vehicle,
        },
      })),
    };
  }, [hiddenRoutes, pinnedRoutes, transport, vehicles]);

  const zonesData = useMemo(
    () => zonesToGeoJson(zones, hiddenZones),
    [hiddenZones, zones],
  );

  const zoomBy = (delta: number) => {
    const next = Math.max(3, Math.min(20, zoom + delta));
    setZoom(next);
    cameraRef.current?.zoomTo(next, { duration: 180 });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapStyle={MAP_STYLE_JSON}
        logo={false}
        attribution={false}
        compass={false}
        scaleBar={false}
        androidView="texture"
        onRegionDidChange={(event) => setZoom(event.nativeEvent.zoom)}
        onDidFailLoadingMap={() => setMapError(true)}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: MAP_CENTER, zoom: 12 }}
        />
        <Images images={MAP_IMAGES} />

        {areas ? (
          <GeoJSONSource id="family-zones" data={zonesData}>
            <Layer
              id="family-zones-fill"
              type="fill"
              source="family-zones"
              paint={{ 'fill-color': '#2F80DD', 'fill-opacity': 0.14 }}
            />
            <Layer
              id="family-zones-outline"
              type="line"
              source="family-zones"
              paint={{ 'line-color': '#2F80DD', 'line-width': 2 }}
            />
            <Layer
              id="family-zone-labels"
              type="symbol"
              source="family-zones"
              layout={{
                'text-field': ['get', 'name'],
                'text-size': 12,
                'text-font': ['Noto Sans Medium'],
                'text-allow-overlap': false,
                'text-padding': 4,
              }}
              paint={{
                'text-color': '#1E5FB8',
                'text-halo-color': '#FFFFFF',
                'text-halo-width': 1.5,
              }}
            />
          </GeoJSONSource>
        ) : null}

        {buses ? (
          <GeoJSONSource id="buses" data={buses}>
            <Layer
              id="buses-layer"
              type="symbol"
              source="buses"
              layout={{
                'icon-image': 'bus',
                'icon-size': 0.7,
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
              }}
            />
          </GeoJSONSource>
        ) : null}

        {markers.map((marker) => (
          <Marker
            key={marker.userId}
            id={marker.userId}
            lngLat={[marker.lng, marker.lat]}
            anchor="bottom"
            onPress={() =>
              setSelectedId((current) =>
                current === marker.userId ? null : marker.userId,
              )
            }
          >
            <View style={styles.markerWrap}>
              {selectedId === marker.userId ? (
                <View style={styles.callout}>
                  <Text style={styles.calloutName} numberOfLines={1}>
                    {marker.name}
                  </Text>
                  <Text style={styles.calloutPlace} numberOfLines={1}>
                    {marker.zoneId
                      ? t('map.markerInside', {
                          name:
                            zoneNames.get(marker.zoneId) ??
                            t('map.markerInsideUnknown'),
                        })
                      : t('map.markerOutside')}
                    {marker.updatedAt
                      ? ` · ${formatTimeAgo(new Date(marker.updatedAt), now)}`
                      : ''}
                  </Text>
                  <Text style={styles.calloutDevice} numberOfLines={1}>
                    {marker.deviceLabel}
                  </Text>
                </View>
              ) : null}
              <View
                accessible
                accessibilityLabel={`${marker.name}. ${
                  marker.updatedAt
                    ? formatTimeAgo(new Date(marker.updatedAt), now)
                    : t('map.markerNoData')
                }`}
                style={[styles.pin, { backgroundColor: marker.color }]}
              >
                {marker.avatarUrl ? (
                  <ApiImage
                    source={authorizedImage(marker.avatarUrl)}
                    style={styles.avatar}
                  />
                ) : (
                  <Text style={styles.initial}>
                    {marker.name.trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                )}
              </View>
              <View
                style={[styles.pinTail, { borderTopColor: marker.color }]}
              />
            </View>
          </Marker>
        ))}
        {history && <HistoryMapLayer {...history} camera={cameraRef} />}
      </MapView>

      <View style={styles.zoomControls} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('map.zoomIn')}
          onPress={() => zoomBy(1)}
          style={({ pressed }) => [
            styles.zoomButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.zoomLabel}>+</Text>
        </Pressable>
        <View style={styles.zoomDivider} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('map.zoomOut')}
          onPress={() => zoomBy(-1)}
          style={({ pressed }) => [
            styles.zoomButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.zoomLabel}>−</Text>
        </Pressable>
      </View>

      {mapError ? (
        <View style={styles.error} pointerEvents="none">
          <Text style={styles.errorText}>{t('map.loadError')}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = createStyles((colors) => ({
  container: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: colors.mapPlaceholder,
  },
  map: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 3,
    width: 44,
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  zoomButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    marginHorizontal: 10,
    backgroundColor: colors.line,
  },
  zoomLabel: {
    fontSize: 24,
    lineHeight: 26,
    fontFamily: theme.fonts.medium,
    color: colors.ink,
  },
  markerWrap: {
    alignItems: 'center',
    overflow: 'visible',
  },
  pin: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: colors.white,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.24)',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  initial: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: colors.white,
  },
  pinTail: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  callout: {
    maxWidth: 210,
    marginBottom: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 22px rgba(16, 24, 40, 0.18)',
  },
  calloutName: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  calloutPlace: {
    marginTop: 2,
    fontSize: 11,
    letterSpacing: 0.1,
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  calloutDevice: {
    marginTop: 3,
    fontSize: 10,
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  error: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    left: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 26, 46, 0.82)',
  },
  errorText: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
}));
