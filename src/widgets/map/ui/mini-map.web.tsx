import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import type { GeoPoint } from '@entities/user';
import { createMap } from '../model/create-map';
import { useWebMapStyle } from '../model/use-web-map-style';

const ZOOM = 15;

/** Неподвижная мини-карта с точкой в центре: жесты выключены, тап ловит превью. */
export function MiniMap({ center }: { center: GeoPoint }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<ReturnType<typeof createMap> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let map: ReturnType<typeof createMap>;
    try {
      map = createMap(containerRef.current, {
        center: [center.lng, center.lat],
        zoom: ZOOM,
        interactive: false,
        attributionControl: { compact: true },
      });
    } catch {
      // Нет WebGL2 — карта не создаётся. Остаётся фон-заглушка превью, а не
      // упавший экран профиля.
      return;
    }
    mapRef.current = map;
    // Компактная подпись источников раскрыта при загрузке и сворачивается
    // только при движении карты, а превью неподвижно: сворачиваем сами, иначе
    // она закрывает подпись места. Раскрыть можно кнопкой «i».
    map.once('load', () =>
      map
        .getContainer()
        .querySelector('.maplibregl-compact-show')
        ?.classList.remove('maplibregl-compact-show'),
    );
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center.lat, center.lng]);

  useWebMapStyle(mapRef);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
