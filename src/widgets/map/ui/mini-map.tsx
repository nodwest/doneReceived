import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Camera, Map, type CameraRef } from '@maplibre/maplibre-react-native';

import type { GeoPoint } from '@entities/user';
import { createStyles } from '@shared/theme';
import { useNativeMapStyle } from '../model/use-native-map-style';

const ZOOM = 15;

/** Неподвижная нативная мини-карта: жесты выключены, пин рисует превью. */
export function MiniMap({ center }: { center: GeoPoint }) {
  const { mapStyle } = useNativeMapStyle();
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
        mapStyle={mapStyle}
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
