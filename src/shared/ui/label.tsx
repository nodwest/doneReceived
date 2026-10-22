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
  // На вебе межстрочный интервал равен размеру шрифта, в том числе
  // переданному снаружи.
  const fontSize = StyleSheet.flatten([styles.text, style]).fontSize;

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
        style={[
          styles.text,
          Platform.OS === 'web' && { lineHeight: fontSize },
          style,
        ]}
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
