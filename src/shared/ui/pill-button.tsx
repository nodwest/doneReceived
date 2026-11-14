import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { withAlpha } from '../lib';
import { theme, tracking } from '../theme';

type PillButtonVariant =
  | 'primary'
  | 'child'
  | 'danger'
  | 'dark'
  | 'outline'
  | 'ghost';

type PillButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: PillButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const GRADIENTS = {
  primary: [theme.colors.violet, theme.colors.blue],
  // Экраны ребёнка: голубая кнопка I did it!.
  child: [theme.colors.childFrom, theme.colors.childDeep],
  danger: [theme.colors.dangerFrom, theme.colors.danger],
} as const;

/** Широкая скруглённая кнопка: градиентная, тёмная или с обводкой. */
export function PillButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: PillButtonProps) {
  const gradient =
    variant === 'primary' || variant === 'child' || variant === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    >
      {gradient && (
        <LinearGradient
          colors={GRADIENTS[variant]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          locations={variant === 'danger' ? [0, 1] : [0, 0.7071]}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Text
        style={[
          styles.label,
          variant === 'outline' && styles.labelInk,
          variant === 'ghost' && styles.labelGrey,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primary: {
    boxShadow: `0px 4px 12px ${withAlpha(theme.colors.violet, 0.25)}`,
  },
  child: {
    boxShadow: '0px 4px 12px rgba(30, 95, 184, 0.22)',
  },
  danger: {},
  dark: {
    backgroundColor: theme.colors.ink,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: theme.colors.placeholder,
    backgroundColor: theme.colors.white,
  },
  ghost: {
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  dimmed: {
    opacity: 0.85,
  },
  label: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  labelInk: {
    color: theme.colors.ink,
  },
  labelGrey: {
    color: theme.colors.grey,
  },
});
