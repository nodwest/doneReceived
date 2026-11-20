import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles, theme } from '../theme';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
  /** Нельзя переключить: бледнее, нажатия не работают. */
  disabled?: boolean;
  /** Цвет включённого: фиолетово-синий (по умолчанию) или голубой (карта). */
  tone?: 'violet' | 'blue';
};

/** Переключатель 44×26: включён — градиент (`tone`), выключен — серый. */
export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  tone = 'violet',
}: ToggleProps) {
  const blue = tone === 'blue';
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      hitSlop={6}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={disabled && styles.disabled}
    >
      {value ? (
        <LinearGradient
          colors={
            blue
              ? [theme.colors.childFrom, theme.colors.childDeep]
              : [theme.colors.violet, theme.colors.blue]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0.37, y: 1 }}
          style={[styles.track, styles.trackOn]}
        >
          <View style={styles.knob} />
        </LinearGradient>
      ) : (
        <View
          style={[styles.track, styles.trackOff, blue && styles.trackOffBlue]}
        >
          <View style={styles.knob} />
        </View>
      )}
    </Pressable>
  );
}

const styles = createStyles((colors) => ({
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
    flexDirection: 'row',
  },
  trackOn: {
    justifyContent: 'flex-end',
  },
  trackOff: {
    justifyContent: 'flex-start',
    backgroundColor: colors.placeholder,
  },
  trackOffBlue: {
    backgroundColor: colors.toggleOff,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
}));
