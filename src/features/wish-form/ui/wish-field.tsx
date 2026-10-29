import { useState, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { theme } from '@shared/theme';
import { styles } from './wish-form-sheet.styled';

type WishFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Слева в поле: «$» у цены, иконка ссылки. */
  prefix?: ReactNode;
};

/** Поле формы желания: подпись сверху, в фокусе — белое с голубой рамкой. */
export function WishField({
  label,
  prefix,
  multiline,
  onFocus,
  onBlur,
  ...props
}: WishFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          focused && styles.inputFocused,
        ]}
      >
        {prefix}
        <TextInput
          {...props}
          multiline={multiline}
          placeholderTextColor={theme.colors.placeholderSoft}
          selectionColor={theme.colors.childFrom}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.text, multiline && styles.textMultiline]}
        />
      </View>
    </View>
  );
}
