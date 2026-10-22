import {
  Platform,
  Pressable,
  StyleSheet,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { theme } from '../theme';

// react-native-web добавляет к состоянию Pressable наведение мыши.
type ButtonState = PressableStateCallbackType & { hovered?: boolean };

type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | ((state: ButtonState) => StyleProp<ViewStyle>);
};

// Прозрачная кнопка поверх градиента: при наведении (веб) и нажатии
// (натив) заливается фиолетовым, на вебе при нажатии почти гаснет.
function Button({ style, ...props }: ButtonProps) {
  return (
    <Pressable
      role="button"
      {...props}
      style={(state: ButtonState) => [
        styles.base,
        state.hovered && styles.hovered,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 6,
    ...Platform.select<ViewStyle>({
      web: {
        outlineWidth: 0,
        transitionProperty: 'all',
        transitionDuration: '150ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      } as ViewStyle,
    }),
  },
  hovered: {
    backgroundColor: theme.colors.violet,
  },
  pressed: Platform.select<ViewStyle>({
    web: { opacity: 0.1 },
    default: { backgroundColor: theme.colors.violet },
  }),
});

export { Button };
export type { ButtonProps };
