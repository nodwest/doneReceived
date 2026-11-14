import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource } from 'maplibre-gl';
import type { ZonePoint } from '@entities/zone';
import { createMap } from '../model/create-map';
import {
  ZONE_DRAFT_LAYERS,
  ZONE_DRAFT_SOURCE,
  zoneDraftToGeoJson,
} from '../layers/dynamic/zones';

type ZoneMapProps = {
  /** Вершины будущей геозоны. */
  points: readonly ZonePoint[];
  /** Индекс выбранной вершины: у неё красная обводка. */
  selectedIndex: number | null;
  /** Тап по карте добавляет вершину. */
  onAddPoint: (point: ZonePoint) => void;
  /** Тап по существующей вершине выбирает её. */
  onSelectPoint: (index: number) => void;
  /** Вершину потянули: новые координаты. */
  onMovePoint: (index: number, point: ZonePoint) => void;
  /** Куда навести карту: при правке — на существующую область. */
  center?: ZonePoint;
};

// Центр Мелитополя — как у большой карты, пока нет координат семьи.
const CENTER: [number, number] = [39.7152, 47.23325];
const ZOOM = 13;
// Радиус попадания по вершине в пикселях: пальцем в точку 5 px не попасть.
const HIT_RADIUS = 16;
// Сдвиг, после которого начинаем перетаскивание: обычный клик не должен
// случайно двигать вершину на пару пикселей.
const DRAG_START_DISTANCE = 3;

/**
 * Карта редактора геозоны: тап добавляет вершину, тап по вершине выбирает её,
 * контур и точки рисуются сразу. Подпись источников — отдельным
 * `MapAttribution`, как на Map.
 */
export function ZoneMap({
  points,
  selectedIndex,
  onAddPoint,
  onSelectPoint,
  onMovePoint,
  center,
}: ZoneMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const onAddPointRef = useRef(onAddPoint);
  const onSelectPointRef = useRef(onSelectPoint);
  const onMovePointRef = useRef(onMovePoint);
  const pointsRef = useRef(points);
  // Индекс вершины, которую сейчас тянут, и был ли сдвиг: после перетаскивания
  // клик по карте не должен ставить новую точку.
  const dragIndexRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragMovedRef = useRef(false);
  // Стартовый центр берём один раз при создании карты: дальше пользователь
  // двигает её сам, и перерисовка не должна дёргать камеру.
  const initialCenter = useRef(center);

  useEffect(() => {
    onAddPointRef.current = onAddPoint;
  }, [onAddPoint]);

  useEffect(() => {
    onSelectPointRef.current = onSelectPoint;
  }, [onSelectPoint]);

  useEffect(() => {
    onMovePointRef.current = onMovePoint;
  }, [onMovePoint]);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  const centerLat = center?.lat;
  const centerLng = center?.lng;
  useEffect(() => {
    if (centerLat === undefined || centerLng === undefined) return;
    mapRef.current?.jumpTo({ center: [centerLng, centerLat] });
  }, [centerLat, centerLng]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const start = initialCenter.current;
    let map: maplibregl.Map;
    try {
      map = createMap(container, {
        center: start ? [start.lng, start.lat] : CENTER,
        zoom: ZOOM,
        attributionControl: false,
      });
    } catch {
      // Нет WebGL2 — остаётся фон-заглушка, а не упавший экран.
      return;
    }
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    const findHit = (point: maplibregl.Point) =>
      pointsRef.current.findIndex((item) => {
        const projected = map.project([item.lng, item.lat]);
        return (
          Math.hypot(projected.x - point.x, projected.y - point.y) <= HIT_RADIUS
        );
      });

    const endDrag = () => {
      if (dragIndexRef.current === null) return;
      dragIndexRef.current = null;
      dragStartRef.current = null;
      map.dragPan.enable();
      map.getCanvas().style.cursor = '';
    };

    // true — под пальцем вершина: начинаем перетаскивание вместо панорамы.
    const startDrag = (point: maplibregl.Point) => {
      const hit = findHit(point);
      if (hit < 0) return false;
      dragIndexRef.current = hit;
      dragStartRef.current = { x: point.x, y: point.y };
      onSelectPointRef.current(hit);
      map.dragPan.disable();
      map.getCanvas().style.cursor = 'grabbing';
      return true;
    };

    const dragTo = (
      event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent,
    ) => {
      const index = dragIndexRef.current;
      if (index === null) return;
      if (!dragMovedRef.current) {
        const start = dragStartRef.current;
        if (!start) return;
        const distance = Math.hypot(
          event.point.x - start.x,
          event.point.y - start.y,
        );
        if (distance < DRAG_START_DISTANCE) return;
        dragMovedRef.current = true;
      }
      onMovePointRef.current(index, {
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      });
    };

    const handleMouseDown = (event: maplibregl.MapMouseEvent) => {
      dragMovedRef.current = false;
      if (event.originalEvent.button !== 0) return;
      if (startDrag(event.point)) event.originalEvent.preventDefault();
    };

    const handleMouseMove = (event: maplibregl.MapMouseEvent) => {
      if (dragIndexRef.current !== null) {
        dragTo(event);
        return;
      }
      // Подсказка: за вершину можно потянуть.
      map.getCanvas().style.cursor =
        findHit(event.point) >= 0 ? 'grab' : 'crosshair';
    };

    const handleTouchStart = (event: maplibregl.MapTouchEvent) => {
      dragMovedRef.current = false;
      if (startDrag(event.point)) event.originalEvent.preventDefault();
    };

    const handleTouchMove = (event: maplibregl.MapTouchEvent) => {
      if (dragIndexRef.current !== null) dragTo(event);
    };

    const handleClick = (event: maplibregl.MapMouseEvent) => {
      // После перетаскивания клик не должен добавлять новую вершину.
      if (dragMovedRef.current) {
        dragMovedRef.current = false;
        return;
      }
      const hit = findHit(event.point);
      if (hit >= 0) {
        onSelectPointRef.current(hit);
        return;
      }
      onAddPointRef.current({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      });
    };

    const handleMouseOut = () => {
      if (dragIndexRef.current === null) map.getCanvas().style.cursor = '';
    };

    const handleWindowUp = () => endDrag();

    map.on('click', handleClick);
    map.on('mousedown', handleMouseDown);
    map.on('mousemove', handleMouseMove);
    map.on('mouseout', handleMouseOut);
    map.on('touchstart', handleTouchStart);
    map.on('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchend', handleWindowUp);
    window.addEventListener('blur', handleWindowUp);

    return () => {
      map.off('click', handleClick);
      map.off('mousedown', handleMouseDown);
      map.off('mousemove', handleMouseMove);
      map.off('mouseout', handleMouseOut);
      map.off('touchstart', handleTouchStart);
      map.off('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchend', handleWindowUp);
      window.removeEventListener('blur', handleWindowUp);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyDraft = () => {
      if (!map.isStyleLoaded()) return;
      const data = zoneDraftToGeoJson(points, selectedIndex);
      const source = map.getSource(ZONE_DRAFT_SOURCE);
      if (source && source.type === 'geojson') {
        (source as GeoJSONSource).setData(data);
      } else {
        map.addSource(ZONE_DRAFT_SOURCE, { type: 'geojson', data });
      }
      for (const layer of ZONE_DRAFT_LAYERS) {
        if (!map.getLayer(layer.id)) map.addLayer(layer);
      }
    };

    applyDraft();
    map.on('load', applyDraft);
    map.on('styledata', applyDraft);
    return () => {
      map.off('load', applyDraft);
      map.off('styledata', applyDraft);
    };
  }, [points, selectedIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
      }}
    />
  );
}
