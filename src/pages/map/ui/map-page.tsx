import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  MapAttribution,
  MapLayersPanel,
  MapWeb,
  useMapLayerStore,
} from '@widgets/map';
import { TabScreen } from '@widgets/bottom-nav';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';

export function MapPage() {
  const { t } = useTranslation();
  const [layersOpen, setLayersOpen] = useState(false);
  const family = useMapLayerStore((state) => state.family);
  const transport = useMapLayerStore((state) => state.transport);
  const areas = useMapLayerStore((state) => state.areas);
  const hiddenChildren = useMapLayerStore((state) => state.hiddenChildren);
  const hiddenRoutes = useMapLayerStore((state) => state.hiddenRoutes);
  const hiddenZones = useMapLayerStore((state) => state.hiddenZones);
  const pinnedRoutes = useMapLayerStore((state) => state.pinnedRoutes);

  return (
    <TabScreen activeKey="map" wide>
      <View style={styles.map}>
        <MapWeb
          family={family}
          transport={transport}
          areas={areas}
          hiddenChildren={hiddenChildren}
          hiddenRoutes={hiddenRoutes}
          hiddenZones={hiddenZones}
          pinnedRoutes={pinnedRoutes}
        />
        <MapAttribution />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('mapLayers.open')}
          accessibilityState={{ expanded: layersOpen }}
          onPress={() => setLayersOpen((open) => !open)}
          style={({ pressed }) => [
            styles.openButton,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="layers" size={24} color={theme.colors.violet} />
        </Pressable>
        {layersOpen && (
          <View style={styles.panelWrap} pointerEvents="box-none">
            <MapLayersPanel
              onClose={() => setLayersOpen(false)}
              onConfigure={() => {
                setLayersOpen(false);
                router.push('/map-layers');
              }}
            />
          </View>
        )}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    minHeight: 0,
  },
  openButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    // MapLibre вешает контролы (включая слой машин из deck.gl) на z-index 2 —
    // кнопка и шторка должны быть выше них.
    zIndex: 3,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.16)',
  },
  panelWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 3,
  },
  pressed: {
    opacity: 0.75,
  },
});
