import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PanResponderCallbacks,
} from 'react-native';
import { useLayoutEffect, useRef, useState } from 'react';
import { GradientButton, Icon, type IconName } from '@shared/ui';
import { theme, tracking } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { type MapLayerKey, useMapLayerStore } from '../model/layer-preferences';

type MapLayersPanelProps = {
  onClose: () => void;
  /** Открыть полный экран «Слои карты». */
  onConfigure: () => void;
};

type LayerRowProps = {
  layerKey: MapLayerKey;
  icon: IconName;
  title: string;
  subtitle: string;
  last?: boolean;
};

function LayerRow({ layerKey, icon, title, subtitle, last }: LayerRowProps) {
  const enabled = useMapLayerStore((state) => state[layerKey]);
  const toggle = useMapLayerStore((state) => state.toggle);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked: enabled }}
      onPress={() => toggle(layerKey)}
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowDivider,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconTile}>
        <Icon name={icon} size={22} color={theme.colors.violet} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.checkbox, !enabled && styles.checkboxOff]}>
        {enabled && <Icon name="check" size={18} color={theme.colors.white} />}
      </View>
    </Pressable>
  );
}

export function MapLayersPanel({ onClose, onConfigure }: MapLayersPanelProps) {
  const { t } = useTranslation();
  const [dragY] = useState(() => new Animated.Value(0));
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const [handlers] = useState<PanResponderCallbacks>(() => ({
    onMoveShouldSetPanResponderCapture: (_, gesture) =>
      gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => {
      dragY.setValue(Math.max(0, gesture.dy));
    },
    onPanResponderRelease: (_, gesture) => {
      const shouldClose = gesture.dy > 80 || gesture.vy > 0.8;
      if (shouldClose) {
        Animated.timing(dragY, {
          toValue: 420,
          duration: 180,
          useNativeDriver: true,
        }).start(() => onCloseRef.current());
        return;
      }

      Animated.spring(dragY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }).start();
    },
    onPanResponderTerminate: () => {
      Animated.spring(dragY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }).start();
    },
  }));
  const [panResponder] = useState(() => PanResponder.create(handlers));

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.panel, { transform: [{ translateY: dragY }] }]}
    >
      <View style={styles.handle} />
      <Text style={styles.title}>{t('mapLayers.title')}</Text>
      <View style={styles.list}>
        <LayerRow
          layerKey="family"
          icon="children"
          title={t('mapLayers.family')}
          subtitle={t('mapLayers.allMembers')}
        />
        <LayerRow
          layerKey="transport"
          icon="bus"
          title={t('mapLayers.transport')}
          subtitle={t('mapLayers.selectedRoutes')}
        />
        <LayerRow
          layerKey="areas"
          icon="zone"
          title={t('mapLayers.areas')}
          subtitle={t('mapLayers.noAreas')}
          last
        />
      </View>
      <GradientButton label={t('mapLayers.configure')} onPress={onConfigure} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: theme.colors.white,
    boxShadow: '0px -8px 24px rgba(26, 26, 46, 0.12)',
  },
  handle: {
    width: 42,
    height: 5,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.dragHandle,
  },
  title: {
    marginBottom: 12,
    fontSize: 24,
    letterSpacing: tracking(24),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  list: {
    marginBottom: 14,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  pressed: {
    opacity: 0.72,
  },
  iconTile: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: theme.colors.violetIcon,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  checkbox: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: theme.colors.violet,
  },
  checkboxOff: {
    borderWidth: 1.5,
    borderColor: theme.colors.placeholder,
    backgroundColor: theme.colors.white,
  },
});
