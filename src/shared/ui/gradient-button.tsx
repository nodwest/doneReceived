import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
};

/** Широкая фиолетово-синяя кнопка высотой 56: Create Task, + Family member. */
export function GradientButton({
  label,
  icon,
  onPress,
  disabled,
  compact,
}: GradientButtonProps) {
  return (
    <LinearGradient
      colors={[theme.colors.violet, theme.colors.blue]}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 1, y: 0.8 }}
      locations={[0, 0.7071]}
      style={[styles.gradient, disabled && styles.disabled]}
    >
      <Button
        style={({ pressed, hovered }) => [
          styles.button,
          hovered && styles.buttonHovered,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {icon && (
          <Icon
            name={icon}
            size={compact ? 18 : 22}
            color={theme.colors.white}
          />
        )}
        <Text
          style={[styles.title, compact && styles.titleCompact]}
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
    height: 56,
    borderRadius: 28,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    height: 56,
    // Button красит фон при нажатии со своим скруглением 6:
    // повторяем радиус градиента, иначе углы становятся прямоугольными.
    borderRadius: 28,
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
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  titleCompact: {
    flexShrink: 1,
    fontSize: 15,
    letterSpacing: tracking(15),
  },
});
