import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import {
  Camera,
  Map,
  type CameraRef,
  type StyleSpecification,
} from '@maplibre/maplibre-react-native';

import type { GeoPoint } from '@entities/user';
import { createStyles } from '@shared/theme';
import { MAP_STYLE } from '../config/map-style';

const ZOOM = 15;
const MAP_STYLE_JSON = MAP_STYLE as unknown as StyleSpecification;

/** Неподвижная нативная мини-карта: жесты выключены, пин рисует превью. */
export function MiniMap({ center }: { center: GeoPoint }) {
  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    cameraRef.current?.jumpTo({
      center: [center.lng, center.lat],
      zoom: ZOOM,
    });
  }, [center.lat, center.lng]);

  return (
    <View style={styles.container} pointerEvents="none">
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE_JSON}
        logo={false}
        attribution={false}
        compass={false}
        scaleBar={false}
        dragPan={false}
        touchZoom={false}
        doubleTapZoom={false}
        doubleTapHoldZoom={false}
        touchRotate={false}
        touchPitch={false}
        androidView="texture"
        preferredFramesPerSecond={15}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: [center.lng, center.lat],
            zoom: ZOOM,
          }}
        />
      </Map>
    </View>
  );
}

const styles = createStyles((colors) => ({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.mapPlaceholder,
  },
  map: {
    flex: 1,
  },
}));
