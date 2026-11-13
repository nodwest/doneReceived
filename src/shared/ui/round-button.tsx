import { Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Icon, type IconName } from './icons';

type RoundButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  /**
   * md — белая 44pt с тенью в шапке экрана; sm — серая 32pt без тени
   * внутри карточки (закрыть панель).
   */
  size?: 'md' | 'sm';
  /** Неактивна: приглушена, не нажимается, читалка экрана так и озвучит. */
  disabled?: boolean;
  /** Пояснение для читалки экрана, например почему кнопка неактивна. */
  accessibilityHint?: string;
};

/** Круглая кнопка с иконкой: «назад», вид списка, закрыть. */
export function RoundButton({
  icon,
  accessibilityLabel,
  onPress,
  size = 'md',
  disabled = false,
  accessibilityHint,
}: RoundButtonProps) {
  const small = size === 'sm';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={small ? 6 : undefined}
      style={[
        styles.button,
        small && styles.small,
        disabled && styles.disabled,
      ]}
    >
      <Icon name={icon} size={small ? 18 : 22} color={theme.colors.ink} />
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
  small: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.prime,
    boxShadow: 'none',
  },
  disabled: {
    opacity: 0.4,
  },
});
