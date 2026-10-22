import * as LabelPrimitive from '@rn-primitives/label';
import { Platform, StyleSheet } from 'react-native';

function Label({
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  // Стиль только плоским объектом: на вебе без htmlFor Radix Slot склеивает
  // стили через spread, и массив превращается в { 0: …, 1: … }.
  const textStyle = StyleSheet.flatten([styles.text, style]);

  return (
    <LabelPrimitive.Root
      style={StyleSheet.flatten([styles.root, disabled && styles.disabled])}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <LabelPrimitive.Text
        style={
          // На вебе межстрочный интервал равен размеру шрифта, в том числе
          // переданному снаружи.
          Platform.OS === 'web'
            ? { lineHeight: textStyle.fontSize, ...textStyle }
            : textStyle
        }
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    userSelect: 'none',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export { Label };
