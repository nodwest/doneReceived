import { useState } from 'react';
import { Platform, TextInput, type TextStyle } from 'react-native';
import { createStyles, theme } from '../theme';

function Input({
  style,
  onFocus,
  onBlur,
  placeholderTextColor = theme.colors.ink,
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

const styles = createStyles((colors) => ({
  input: {
    height: 56,
    width: '100%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 24 : 16,
    color: colors.ink,
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
    borderColor: colors.grey,
    boxShadow: '0px 0px 0px 3px rgba(161, 161, 161, 0.5)',
  },
}));

export { Input };
