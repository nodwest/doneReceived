import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, tracking } from '../theme';
import { Icon, type IconName } from './icons';

type CardButtonVariant =
  | 'primary'
  | 'child'
  | 'dark'
  | 'outline'
  | 'danger-outline'
  | 'review-outline';

type CardButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: CardButtonVariant;
  /** Иконка слева от подписи. */
  icon?: IconName;
  /** lg — 56pt (низ карточки), md — 44pt (плитка и строка). */
  size?: 'lg' | 'md';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const GRADIENTS = {
  primary: [theme.colors.violet, theme.colors.blue],
  child: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

const LABEL_COLORS: Record<CardButtonVariant, string> = {
  primary: theme.colors.white,
  child: theme.colors.white,
  dark: theme.colors.white,
  outline: theme.colors.ink,
  'danger-outline': theme.colors.dangerText,
  'review-outline': theme.colors.reviewChipText,
};

/**
 * Кнопка внутри карточки задания: скруглённая плашка (не пилюля) с иконкой.
 * I did it!, Redo, Cancel task / Edit, Reject / Approve.
 */
export function CardButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  size = 'lg',
  disabled,
  style,
}: CardButtonProps) {
  const gradient = variant === 'primary' || variant === 'child';
  const color = LABEL_COLORS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        size === 'md' && styles.buttonMd,
        styles[variant],
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    >
      {gradient && (
        <LinearGradient
          colors={GRADIENTS[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.content}>
        {icon && (
          <Icon name={icon} size={size === 'md' ? 18 : 20} color={color} />
        )}
        <Text
          style={[styles.label, size === 'md' && styles.labelMd, { color }]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonMd: {
    height: 44,
    borderRadius: 14,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primary: {
    boxShadow: '0px 8px 18px rgba(108, 92, 231, 0.3)',
  },
  child: {
    boxShadow: '0px 8px 18px rgba(31, 94, 184, 0.3)',
  },
  dark: {
    backgroundColor: theme.colors.ink,
    boxShadow: '0px 8px 18px rgba(26, 26, 46, 0.25)',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: theme.colors.placeholder,
    backgroundColor: theme.colors.white,
  },
  'danger-outline': {
    borderWidth: 1.5,
    borderColor: theme.colors.dangerBorder,
    backgroundColor: theme.colors.white,
  },
  'review-outline': {
    borderWidth: 1.5,
    borderColor: theme.colors.reviewBorder,
    backgroundColor: theme.colors.white,
  },
  dimmed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 18,
    letterSpacing: tracking(18),
    fontFamily: theme.fonts.bold,
  },
  labelMd: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
  },
});
