import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapAttribution,
  MapLayersPanel,
  MapWeb,
  type HistoryMapProps,
  useMapLayerStore,
} from '@widgets/map';
import { TabScreen } from '@widgets/bottom-nav';
import { LocationSharingCard } from '@features/location';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, useTheme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { useSessionFamilyId, useSessionStore } from '@entities/session';
import { MapHistory } from './map-history';

export function MapPage() {
  useTheme();
  const { t } = useTranslation();
  const [layersOpen, setLayersOpen] = useState(false);
  const familyId = useSessionFamilyId();
  const parent = useSessionStore(
    (state) => state.session?.user.kind === 'parent',
  );
  const sessionKey = useSessionStore((state) =>
    state.session
      ? `${state.session.user.id}:${state.session.storageEpoch ?? 0}`
      : '',
  );
  const historyKey = `${sessionKey}:${familyId}`;
  const [history, setHistory] = useState<{
    key: string;
    route: HistoryMapProps;
  } | null>(null);
  const onHistoryRoute = useCallback(
    (route: HistoryMapProps | null) => {
      setHistory((current) =>
        route
          ? { key: historyKey, route }
          : current?.key === historyKey
            ? null
            : current,
      );
    },
    [historyKey],
  );
  const family = useMapLayerStore((state) => state.family);
  const transport = useMapLayerStore((state) => state.transport);
  const areas = useMapLayerStore((state) => state.areas);
  const hiddenChildren = useMapLayerStore((state) => state.hiddenChildren);
  const hiddenRoutes = useMapLayerStore((state) => state.hiddenRoutes);
  const hiddenZones = useMapLayerStore((state) => state.hiddenZones);
  const pinnedRoutes = useMapLayerStore((state) => state.pinnedRoutes);

  return (
    <TabScreen activeKey="map" wide>
      <SafeAreaView style={styles.map} edges={['top', 'left', 'right']}>
        <View style={styles.mapContent}>
          <MapWeb
            history={
              parent && !layersOpen && history?.key === historyKey
                ? history.route
                : undefined
            }
            family={family}
            transport={transport}
            areas={areas}
            hiddenChildren={hiddenChildren}
            hiddenRoutes={hiddenRoutes}
            hiddenZones={hiddenZones}
            pinnedRoutes={pinnedRoutes}
          />
          <MapAttribution />
          <View style={styles.mapControls} pointerEvents="box-none">
            {!layersOpen && <LocationSharingCard />}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('mapLayers.open')}
              accessibilityState={{ expanded: layersOpen }}
              onPress={() => setLayersOpen((open) => !open)}
              style={({ pressed }) => [
                styles.openButton,
                layersOpen && styles.openButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                name="layers"
                size={22}
                color={layersOpen ? theme.colors.mapAccent : theme.colors.ink}
              />
            </Pressable>
          </View>
          {parent && familyId && !layersOpen && (
            <MapHistory
              key={historyKey}
              familyId={familyId}
              onRoute={onHistoryRoute}
            />
          )}
          {layersOpen && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={() => setLayersOpen(false)}
              style={styles.dim}
            />
          )}
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
      </SafeAreaView>
    </TabScreen>
  );
}

const styles = createStyles((colors) => ({
  map: {
    flex: 1,
    backgroundColor: colors.prime,
  },
  mapContent: {
    flex: 1,
    minHeight: 0,
  },
  mapControls: {
    position: 'absolute',
    top: 12,
    left: 16,
    // MapLibre вешает контролы (включая слой машин из deck.gl) на z-index 2 —
    // кнопка и шторка должны быть выше них.
    zIndex: 3,
    alignItems: 'flex-start',
    gap: 8,
  },
  openButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  // Шторка слоёв открыта: кнопка подсвечена голубым.
  openButtonActive: {
    backgroundColor: colors.mapAccentTint,
  },
  // Затемнение карты под шторкой: тап по нему закрывает шторку.
  dim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 3,
    backgroundColor: colors.mapDim,
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
}));
