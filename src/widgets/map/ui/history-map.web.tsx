import { useEffect, useMemo } from 'react';
import {
  LngLatBounds,
  Marker,
  Popup,
  type GeoJSONSource,
  type Map,
} from 'maplibre-gl';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import {
  HISTORY_GAP_COLOR,
  routeSegments,
  type HistoryMapProps,
} from './history-map-model';
import type { FeatureCollection, LineString } from 'geojson';

export function HistoryMapLayer({
  points,
  markers,
  selected,
  focusVersion,
  onSelect,
  map,
  routeKey,
  bottomInset,
}: HistoryMapProps & { map: Map }) {
  const { t, i18n } = useTranslation();
  const segments = useMemo(() => routeSegments(points), [points]);
  const active = markers.find((marker) => marker.id === selected);
  const activeLat = active?.lat;
  const activeLng = active?.lng;

  useEffect(() => {
    const data: FeatureCollection<LineString> = {
      type: 'FeatureCollection',
      features: [...segments, ...routeSegments(points, true)].map(
        ({ start, end }, index) => ({
          type: 'Feature',
          properties: { index, gap: index >= segments.length },
          geometry: {
            type: 'LineString',
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat],
            ],
          },
        }),
      ),
    };
    const show = () => {
      const source = map.getSource<GeoJSONSource>('history-route');
      if (source) source.setData(data);
      else {
        map.addSource('history-route', { type: 'geojson', data });
        map.addLayer({
          id: 'history-route',
          type: 'line',
          source: 'history-route',
          filter: ['==', ['get', 'gap'], false],
          paint: { 'line-color': theme.colors.mapAccent, 'line-width': 5 },
        });
        map.addLayer({
          id: 'history-route-gap',
          type: 'line',
          source: 'history-route',
          filter: ['==', ['get', 'gap'], true],
          paint: {
            'line-color': HISTORY_GAP_COLOR,
            'line-width': 3,
            'line-dasharray': [2, 2],
          },
        });
      }
    };
    if (map.isStyleLoaded()) show();
    else map.once('load', show);
    const tip = new Popup({
      anchor: 'top',
      offset: 10,
      closeButton: false,
      closeOnClick: false,
    });
    const offMove = map.on('mousemove', 'history-route', (event) => {
      const segment = segments[Number(event.features?.[0]?.properties?.index)];
      if (!segment) return;
      const { start, end } = segment;
      const dx = end.lng - start.lng;
      const dy = end.lat - start.lat;
      const local =
        dx || dy
          ? ((event.lngLat.lng - start.lng) * dx +
              (event.lngLat.lat - start.lat) * dy) /
            (dx * dx + dy * dy)
          : 0;
      const fraction = Math.max(0, Math.min(1, local));
      const date = new Date(
        Date.parse(start.recordedAt) +
          fraction *
            (Date.parse(end.recordedAt) - Date.parse(start.recordedAt)),
      );
      const time = date.toLocaleTimeString(i18n.resolvedLanguage, {
        hour: '2-digit',
        minute: '2-digit',
      });
      tip
        .setLngLat(event.lngLat)
        .setText(
          t(
            fraction === 0 || fraction === 1
              ? 'mapHistory.exactTime'
              : 'mapHistory.approximateTime',
            { time },
          ),
        )
        .addTo(map);
    });
    const offLeave = map.on('mouseleave', 'history-route', () => {
      tip.remove();
    });
    return () => {
      map.off('load', show);
      offMove.unsubscribe();
      offLeave.unsubscribe();
      tip.remove();
      if (map.getLayer('history-route')) map.removeLayer('history-route');
      if (map.getLayer('history-route-gap'))
        map.removeLayer('history-route-gap');
      if (map.getSource('history-route')) map.removeSource('history-route');
    };
  }, [map, points, segments, t, i18n.resolvedLanguage]);

  useEffect(() => {
    const pins = markers.map((marker) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = marker.label;
      button.setAttribute('aria-label', marker.detail);
      button.style.cssText = `width:30px;height:30px;border:${marker.id === selected ? 4 : 2}px solid white;border-radius:50%;color:white;font-weight:700;cursor:pointer;background:${marker.task ? '#16764b' : theme.colors.mapAccent}`;
      button.onclick = () => onSelect(marker.id);
      const popup = new Popup({
        anchor: 'top',
        closeButton: false,
        offset: 18,
      }).setText(marker.detail);
      const pin = new Marker({ element: button })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);
      if (marker.id === selected)
        popup.setLngLat([marker.lng, marker.lat]).addTo(map);
      return () => {
        popup.remove();
        pin.remove();
      };
    });
    return () => pins.forEach((remove) => remove());
  }, [map, markers, selected, onSelect]);

  useEffect(() => {
    if (!points.length || bottomInset <= 0) return;
    const bounds = new LngLatBounds();
    for (const point of points) bounds.extend([point.lng, point.lat]);
    map.fitBounds(bounds, {
      padding: { top: 48, bottom: bottomInset + 16, left: 40, right: 40 },
      maxZoom: 16,
      duration: 260,
    });
  }, [map, points, routeKey, bottomInset]);
  useEffect(
    () => () => {
      if (map.getStyle())
        map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
    },
    [map],
  );

  useEffect(() => {
    if (activeLat === undefined || activeLng === undefined) return;
    map.jumpTo({
      center: [activeLng, activeLat],
      zoom: Math.max(16, map.getZoom()),
      padding: { top: 48, bottom: bottomInset + 16, left: 40, right: 40 },
    });
  }, [activeLat, activeLng, bottomInset, focusVersion, map]);

  return null;
}
