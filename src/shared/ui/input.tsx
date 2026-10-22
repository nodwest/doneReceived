import { useState } from 'react';
import { Platform, StyleSheet, TextInput, type TextStyle } from 'react-native';

const BORDER = '#E5E5E5';
const RING = '#A1A1A1';

function Input({
  style,
  onFocus,
  onBlur,
  placeholderTextColor = '#000000',
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  // Рамка фокуса нужна только на вебе: на нативе её не было.
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
      style={[
        styles.input,
        props.editable === false && styles.disabled,
        style,
        Platform.OS === 'web' && focused && styles.focused,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 56,
    width: '100%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 24 : 16,
    color: '#0A0A0A',
    lineHeight: 20,
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    ...Platform.select<TextStyle>({
      web: {
        outlineWidth: 0,
        transitionProperty: 'color, box-shadow',
        transitionDuration: '150ms',
      } as TextStyle,
    }),
  },
  disabled: {
    opacity: 0.5,
  },
  focused: {
    borderColor: RING,
    boxShadow: '0px 0px 0px 3px rgba(161, 161, 161, 0.5)',
  },
});

export { Input };
