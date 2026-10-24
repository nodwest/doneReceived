import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
};

/** Переключатель 44×26: включён — фиолетово-синий градиент, выключен — серый. */
export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={6}
      onPress={() => onValueChange(!value)}
    >
      {value ? (
        <LinearGradient
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.37, y: 1 }}
          style={[styles.track, styles.trackOn]}
        >
          <View style={styles.knob} />
        </LinearGradient>
      ) : (
        <View style={[styles.track, styles.trackOff]}>
          <View style={styles.knob} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.placeholder,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
  },
});
