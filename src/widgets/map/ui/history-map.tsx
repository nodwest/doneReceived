import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import {
  type CameraRef,
  GeoJSONSource,
  Layer,
  Marker,
} from '@maplibre/maplibre-react-native';
import type { FeatureCollection, LineString } from 'geojson';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme } from '@shared/theme';
import {
  HISTORY_GAP_COLOR,
  routeSegments,
  type HistoryMapProps,
} from './history-map-model';

export function HistoryMapLayer({
  points,
  markers,
  selected,
  focusVersion,
  onSelect,
  camera,
  routeKey,
  bottomInset,
}: HistoryMapProps & { camera: React.RefObject<CameraRef | null> }) {
  const { t } = useTranslation();

  const [tip, setTip] = useState<{
    text: string;
    coordinate: [number, number];
    marker?: string;
    focus: number;
  }>();
  const segments = useMemo(() => routeSegments(points), [points]);
  const data = useMemo<FeatureCollection<LineString>>(
    () => ({
      type: 'FeatureCollection',
      features: [...segments, ...routeSegments(points, true)].map(
        ({ start, end }, id) => ({
          type: 'Feature',
          id,
          properties: { index: id, gap: id >= segments.length },
          geometry: {
            type: 'LineString',
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat],
            ],
          },
        }),
      ),
    }),
    [points, segments],
  );
  const first = points[0];
  useEffect(() => {
    if (!first || bottomInset <= 0) return;
    const west = Math.min(...points.map((point) => point.lng));
    const east = Math.max(...points.map((point) => point.lng));
    const south = Math.min(...points.map((point) => point.lat));
    const north = Math.max(...points.map((point) => point.lat));
    const padding = { top: 48, bottom: bottomInset + 16, left: 40, right: 40 };
    if (west === east && south === north) {
      camera.current?.jumpTo({
        center: [first.lng, first.lat],
        zoom: 15,
        padding,
      });
    } else {
      camera.current?.fitBounds([west, south, east, north], {
        padding,
        duration: 260,
      });
    }
  }, [bottomInset, camera, first, points, routeKey]);
  useEffect(() => {
    return () => {
      // The Camera ref is cleared before cleanup when the map also unmounts.
      // eslint-disable-next-line react-hooks/exhaustive-deps -- Use the live ref so a detached camera is skipped.
      void camera.current
        ?.setStop({
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        })
        .catch(() => {
          // The native view can disappear before the queued reset is applied.
        });
    };
  }, [camera]);
  const active = markers.find((marker) => marker.id === selected);
  const activeLat = active?.lat;
  const activeLng = active?.lng;
  useEffect(() => {
    if (activeLat === undefined || activeLng === undefined) return;
    camera.current?.jumpTo({
      center: [activeLng, activeLat],
      zoom: 16,
      padding: { top: 48, bottom: bottomInset + 16, left: 40, right: 40 },
    });
  }, [activeLat, activeLng, bottomInset, camera, focusVersion]);
  const visibleTip =
    tip?.focus === focusVersion && (!tip.marker || tip.marker === selected)
      ? tip
      : undefined;

  return (
    <>
      <GeoJSONSource
        id="history-route"
        data={data}
        onPress={(event) => {
          const { nativeEvent } = event;
          const index = nativeEvent.features[0]?.properties?.index;
          const segment =
            typeof index === 'number' ? segments[index] : undefined;
          if (!segment) return;
          event.stopPropagation();
          const { start, end } = segment;
          const [lng, lat] = nativeEvent.lngLat;
          const dx =
            (end.lng - start.lng) * Math.cos((start.lat * Math.PI) / 180);
          const dy = end.lat - start.lat;
          const fraction =
            dx || dy
              ? Math.max(
                  0,
                  Math.min(
                    1,
                    ((lng - start.lng) *
                      Math.cos((start.lat * Math.PI) / 180) *
                      dx +
                      (lat - start.lat) * dy) /
                      (dx * dx + dy * dy),
                  ),
                )
              : 0;
          const at = new Date(
            Date.parse(start.recordedAt) +
              fraction *
                (Date.parse(end.recordedAt) - Date.parse(start.recordedAt)),
          );
          const time = at.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          });
          setTip({
            focus: focusVersion,
            coordinate: [lng, lat],
            text: t(
              fraction === 0 || fraction === 1
                ? 'mapHistory.exactTime'
                : 'mapHistory.approximateTime',
              { time },
            ),
          });
        }}
      >
        <Layer
          id="history-route-outline"
          type="line"
          filter={['==', ['get', 'gap'], false]}
          paint={{ 'line-color': '#ffffff', 'line-width': 8 }}
        />
        <Layer
          id="history-route-line"
          type="line"
          filter={['==', ['get', 'gap'], false]}
          paint={{ 'line-color': theme.colors.mapAccent, 'line-width': 5 }}
        />
        <Layer
          id="history-route-gap"
          type="line"
          filter={['==', ['get', 'gap'], true]}
          paint={{
            'line-color': HISTORY_GAP_COLOR,
            'line-width': 3,
            'line-dasharray': [2, 2],
          }}
        />
      </GeoJSONSource>
      {first && (
        <Marker lngLat={[first.lng, first.lat]}>
          <View style={styles.start} />
        </Marker>
      )}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          lngLat={[marker.lng, marker.lat]}
          onPress={(event) => {
            event.stopPropagation();
            onSelect(marker.id);
            setTip({
              focus: focusVersion + 1,
              text: marker.detail,
              coordinate: [marker.lng, marker.lat],
              marker: marker.id,
            });
          }}
        >
          <View
            style={[
              styles.marker,
              marker.task && styles.task,
              marker.id === selected && styles.selected,
            ]}
          >
            <Text style={styles.markerText}>{marker.label}</Text>
          </View>
        </Marker>
      ))}
      {(visibleTip || active) && (
        <Marker
          lngLat={visibleTip?.coordinate ?? [active!.lng, active!.lat]}
          anchor="top"
        >
          <Text pointerEvents="none" style={styles.tip}>
            {visibleTip?.text ?? active?.detail}
          </Text>
        </Marker>
      )}
    </>
  );
}

const styles = createStyles((colors) => ({
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mapAccent,
  },
  task: { backgroundColor: '#16764b' },
  selected: { borderWidth: 4 },
  markerText: { color: '#fff', fontWeight: '700' },
  start: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.mapAccent,
    borderWidth: 2,
    borderColor: '#fff',
  },
  tip: {
    maxWidth: 245,
    marginTop: 18,
    padding: 9,
    borderRadius: 10,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
}));
