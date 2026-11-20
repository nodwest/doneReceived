import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  ViewAnnotation,
  type CameraRef,
  type StyleSpecification,
} from '@maplibre/maplibre-react-native';

import type { ZonePoint } from '@entities/zone';
import { createStyles } from '@shared/theme';
import { MAP_STYLE } from '../config/map-style';
import { zoneDraftToGeoJson } from '../layers/dynamic/zones';

type ZoneMapProps = {
  points: readonly ZonePoint[];
  selectedIndex: number | null;
  onAddPoint: (point: ZonePoint) => void;
  onSelectPoint: (index: number) => void;
  onMovePoint: (index: number, point: ZonePoint) => void;
  center?: ZonePoint;
};

const CENTER: [number, number] = [39.7152, 47.23325];
const ZOOM = 13;
const MAP_STYLE_JSON = MAP_STYLE as unknown as StyleSpecification;

/**
 * Нативный редактор области: тап по карте добавляет вершину, вершины
 * перетаскиваются штатными draggable ViewAnnotation.
 */
export function ZoneMap({
  points,
  selectedIndex,
  onAddPoint,
  onSelectPoint,
  onMovePoint,
  center,
}: ZoneMapProps) {
  const cameraRef = useRef<CameraRef>(null);
  const lastVertexPress = useRef(0);
  const data = zoneDraftToGeoJson(points, selectedIndex);
  const centerLat = center?.lat;
  const centerLng = center?.lng;

  useEffect(() => {
    if (centerLat === undefined || centerLng === undefined) return;
    cameraRef.current?.jumpTo({
      center: [centerLng, centerLat],
      zoom: ZOOM,
    });
  }, [centerLat, centerLng]);

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE_JSON}
        logo={false}
        attribution={false}
        compass={false}
        scaleBar={false}
        androidView="texture"
        onPress={(event) => {
          // Тап по вершине не должен добавлять новую точку.
          if (Date.now() - lastVertexPress.current < 350) return;
          const [lng, lat] = event.nativeEvent.lngLat;
          onAddPoint({ lat, lng });
        }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: center ? [center.lng, center.lat] : CENTER,
            zoom: ZOOM,
          }}
        />

        <GeoJSONSource id="zone-draft" data={data}>
          <Layer
            id="zone-draft-fill"
            type="fill"
            source="zone-draft"
            filter={['==', ['geometry-type'], 'Polygon']}
            paint={{ 'fill-color': '#2F80DD', 'fill-opacity': 0.14 }}
          />
          <Layer
            id="zone-draft-line"
            type="line"
            source="zone-draft"
            filter={['==', ['geometry-type'], 'LineString']}
            paint={{
              'line-color': '#2F80DD',
              'line-width': 2,
              'line-dasharray': [2, 1],
            }}
          />
          <Layer
            id="zone-draft-points"
            type="circle"
            source="zone-draft"
            filter={['==', ['geometry-type'], 'Point']}
            paint={{
              'circle-radius': 5,
              'circle-color': '#2F80DD',
              'circle-stroke-color': [
                'case',
                ['get', 'selected'],
                '#E5484D',
                '#FFFFFF',
              ],
              'circle-stroke-width': ['case', ['get', 'selected'], 3, 2],
            }}
          />
        </GeoJSONSource>

        {points.map((point, index) => (
          <ViewAnnotation
            key={`${index}:${point.lat}:${point.lng}`}
            id={`zone-point-${index}`}
            lngLat={[point.lng, point.lat]}
            anchor="center"
            draggable
            onPress={() => {
              lastVertexPress.current = Date.now();
              onSelectPoint(index);
            }}
            onDragEnd={(event) => {
              lastVertexPress.current = Date.now();
              const [lng, lat] = event.nativeEvent.lngLat;
              onMovePoint(index, { lat, lng });
            }}
          >
            <View
              style={[
                styles.vertex,
                index === selectedIndex && styles.vertexSelected,
              ]}
            />
          </ViewAnnotation>
        ))}
      </Map>
    </View>
  );
}

const styles = createStyles((colors) => ({
  container: {
    flex: 1,
    minHeight: 260,
    overflow: 'hidden',
    backgroundColor: colors.mapPlaceholder,
  },
  map: {
    flex: 1,
  },
  vertex: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: '#2F80DD',
  },
  vertexSelected: {
    borderColor: '#E5484D',
  },
}));
