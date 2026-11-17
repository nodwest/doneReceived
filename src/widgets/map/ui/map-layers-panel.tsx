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
import { GradientButton, Icon, Toggle, type IconName } from '@shared/ui';
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
    <>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityHint={subtitle}
        accessibilityState={{ checked: enabled }}
        onPress={() => toggle(layerKey)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={styles.iconTile}>
          <Icon name={icon} size={20} color={theme.colors.mapAccent} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        {/* Переключатель только показывает состояние: нажимается вся строка. */}
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Toggle value={enabled} onValueChange={() => {}} tone="blue" />
        </View>
      </Pressable>
      {!last && <View style={styles.divider} />}
    </>
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
      <View style={styles.group}>
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
      <GradientButton
        label={t('mapLayers.configure')}
        tone="blue"
        onPress={onConfigure}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: theme.colors.white,
  },
  handle: {
    width: 40,
    height: 5,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 3,
    backgroundColor: theme.colors.sheetGrabber,
  },
  title: {
    marginBottom: 12,
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  // Слои одной карточкой с рамкой, строки разделены чертой от текста.
  group: {
    marginBottom: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 14,
  },
  divider: {
    height: 1,
    marginLeft: 60,
    backgroundColor: theme.colors.line,
  },
  pressed: {
    opacity: 0.72,
  },
  iconTile: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.mapAccentTint,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
