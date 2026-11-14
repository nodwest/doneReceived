import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { withAlpha } from '../lib';
import { theme, tracking } from '../theme';
import { Button } from './button';
import { Icon, type IconName } from './icons';

type GradientButtonProps = {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  disabled?: boolean;
  /** Мельче текст и иконка — для двух кнопок в ряд (вкладка Family). */
  compact?: boolean;
  /** Ниже (44) и с меньшим скруглением — кнопка внутри карточки. */
  small?: boolean;
  /** Идёт запрос: спиннер вместо иконки, кнопка не нажимается. */
  loading?: boolean;
};

/** Широкая фиолетово-синяя кнопка высотой 48: Create Task, + Family member. */
export function GradientButton({
  label,
  icon,
  onPress,
  disabled,
  compact,
  small,
  loading,
}: GradientButtonProps) {
  return (
    <LinearGradient
      colors={[theme.colors.violet, theme.colors.blue]}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 1, y: 0.8 }}
      locations={[0, 0.7071]}
      style={[
        styles.gradient,
        small && styles.small,
        disabled && styles.disabled,
        loading && styles.loading,
      ]}
    >
      <Button
        style={({ pressed, hovered }) => [
          styles.button,
          small && styles.small,
          hovered && styles.buttonHovered,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.white} />
        ) : (
          icon && (
            <Icon
              name={icon}
              size={small ? 16 : compact ? 18 : 22}
              color={theme.colors.white}
            />
          )
        )}
        <Text
          style={[
            styles.title,
            compact && styles.titleCompact,
            small && styles.titleSmall,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Button>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    boxShadow: `0px 4px 12px ${withAlpha(theme.colors.violet, 0.25)}`,
  },
  small: {
    height: 40,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.85,
  },
  button: {
    height: 48,
    // Button красит фон при нажатии со своим скруглением 6:
    // повторяем радиус градиента, иначе углы становятся прямоугольными.
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  // На вебе наведение не перекрашивает градиент, а нажатие заливает
  // кнопку фиолетовым без затухания — как на нативе.
  buttonHovered: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    backgroundColor: theme.colors.violet,
    opacity: 1,
  },
  title: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  titleCompact: {
    flexShrink: 1,
    fontSize: 15,
    letterSpacing: tracking(15),
  },
  titleSmall: {
    fontSize: 13,
    letterSpacing: tracking(13),
  },
});
