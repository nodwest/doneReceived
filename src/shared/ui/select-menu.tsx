import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  type PressableStateCallbackType,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from '../i18n';
import { theme, tracking } from '../theme';
import { Icon } from './icons';

const OPEN_MS = 160;
const CLOSE_MS = 120;
const GAP = 6;
const SCREEN_MARGIN = 12;
const MENU_PADDING = 4;
const OPTION_HEIGHT = 44;

/** Прямоугольник кнопки на экране — из `measureInWindow`. */
export type AnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// react-native-web добавляет к состоянию Pressable наведение мышью.
type OptionState = PressableStateCallbackType & { hovered?: boolean };

export type SelectMenuOption<T extends string> = { value: T; label: string };

type SelectMenuProps<T extends string> = {
  visible: boolean;
  /** Кнопка, под которой раскрывается меню. */
  anchor: AnchorRect | null;
  /** К какому краю кнопки прижато меню: right — справа (по умолчанию), left — слева. */
  align?: 'left' | 'right';
  options: readonly SelectMenuOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  onClose: () => void;
  width?: number;
};

/**
 * Выпадающее меню выбора прямо у кнопки: появляется под ней (если снизу не
 * хватает места — над ней), выбранный вариант отмечен галочкой. Тап мимо
 * меню или Esc на вебе закрывают его.
 */
export function SelectMenu<T extends string>({
  visible,
  anchor,
  options,
  value,
  onSelect,
  onClose,
  width = 200,
  align = 'right',
}: SelectMenuProps<T>) {
  const { t } = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));
  // Меню остаётся смонтированным, пока идёт анимация закрытия.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (!mounted) return;
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_MS : CLOSE_MS,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
    return () => animation.stop();
  }, [visible, mounted, progress]);

  if (!anchor) return null;

  const menuHeight = options.length * OPTION_HEIGHT + MENU_PADDING * 2;
  const below = anchor.y + anchor.height + GAP;
  const openUp = below + menuHeight > screenHeight - SCREEN_MARGIN;
  const horizontal =
    align === 'left'
      ? { left: Math.max(SCREEN_MARGIN, anchor.x) }
      : {
          right: Math.max(
            SCREEN_MARGIN,
            screenWidth - (anchor.x + anchor.width),
          ),
        };
  const position = openUp
    ? { bottom: screenHeight - anchor.y + GAP, ...horizontal }
    : { top: below, ...horizontal };

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel={t('common.close')}
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      />
      <Animated.View
        accessibilityRole="menu"
        style={[
          styles.menu,
          position,
          {
            width,
            transformOrigin: `${openUp ? 'bottom' : 'top'} ${align}`,
            opacity: progress,
            transform: [
              {
                scale: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
            ],
          },
        ]}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="menuitem"
              accessibilityState={{ selected }}
              onPress={() => {
                if (!selected) onSelect(option.value);
                onClose();
              }}
              style={({ pressed, hovered }: OptionState) => [
                styles.option,
                (pressed || hovered) && styles.optionActive,
              ]}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {option.label}
              </Text>
              {selected && (
                <Icon name="check" size={16} color={theme.colors.violet} />
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    padding: MENU_PADDING,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 12px 32px rgba(26, 26, 46, 0.16)',
  },
  option: {
    height: OPTION_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionActive: {
    backgroundColor: theme.colors.prime,
  },
  label: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    letterSpacing: tracking(15),
    color: theme.colors.ink,
  },
  labelSelected: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
});
