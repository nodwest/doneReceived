import { Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Icon, type IconName } from './icons';

type RoundButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
};

/** Круглая белая кнопка с иконкой в шапке экрана («назад», вид списка). */
export function RoundButton({
  icon,
  accessibilityLabel,
  onPress,
}: RoundButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.button}
    >
      <Icon name={icon} size={22} color={theme.colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
});
