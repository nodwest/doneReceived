import { Pressable, Text, View } from 'react-native';

import { useTranslation } from '@shared/i18n';
import { useMapViewModeStore, type MapViewMode } from '../model/view-mode';
import { styles } from './map-view-toggle.styled';

const MODES: { mode: MapViewMode; label: string }[] = [
  { mode: '2d', label: '2D' },
  { mode: '3d', label: '3D' },
];

/**
 * Переключатель плоской и объёмной карты. Единственный новый элемент на
 * экране карты: остальные кнопки экрана не меняются.
 */
export function MapViewToggle() {
  const { t } = useTranslation();
  const mode = useMapViewModeStore((state) => state.mode);
  const setMode = useMapViewModeStore((state) => state.setMode);

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('map.viewMode')}
      style={styles.wrap}
    >
      {MODES.map((option) => {
        const selected = option.mode === mode;
        return (
          <Pressable
            key={option.mode}
            accessibilityRole="radio"
            accessibilityLabel={t(
              option.mode === '3d' ? 'map.view3d' : 'map.view2d',
            )}
            accessibilityState={{ selected }}
            onPress={() => setMode(option.mode)}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
