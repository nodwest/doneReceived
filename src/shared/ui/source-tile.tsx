import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { Icon, type IconName } from './icons';

type SourceTileProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
};

/**
 * Пунктирная голубая плитка 72×72 с иконкой: откуда взять фото (камера,
 * галерея) — в фото-отчёте задания, форме и карточке желания.
 */
export function SourceTile({
  icon,
  accessibilityLabel,
  onPress,
}: SourceTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[theme.colors.childTint, theme.colors.childTintLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={StyleSheet.absoluteFill}
      />
      <Icon name={icon} size={26} color={theme.colors.childFrom} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(74, 158, 240, 0.6)',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
});
