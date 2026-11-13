import { useState, type ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { theme, tracking } from '../theme';

const FIELD_HEIGHT = 50;

type SheetFieldProps = Omit<TextInputProps, 'style'> & {
  /** Подпись; можно с цветной припиской (`<Text>` внутри). */
  label: ReactNode;
  /** Слева в поле: «$» у цены, иконка ссылки. */
  prefix?: ReactNode;
};

/**
 * Поле формы в шторке: подпись сверху, серое поле, в фокусе — белое с
 * голубой рамкой. Формы желания и нового ребёнка.
 */
export function SheetField({
  label,
  prefix,
  multiline,
  onFocus,
  onBlur,
  ...props
}: SheetFieldProps) {
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

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.inkSoft,
  },
  input: {
    minHeight: FIELD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.prime,
  },
  inputFocused: {
    borderWidth: 2,
    paddingHorizontal: 15,
    borderColor: theme.colors.childFrom,
    backgroundColor: theme.colors.white,
  },
  inputMultiline: {
    minHeight: 76,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  text: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    ...Platform.select<TextStyle>({
      // Своя рамка фокуса у обёртки поля: браузерную убираем совсем —
      // даже прозрачная outline: auto закрашивает рамку поверх поля.
      web: { outlineStyle: 'none' } as unknown as TextStyle,
    }),
  },
  // Три строки описания видны целиком, дальше поле прокручивается.
  textMultiline: {
    alignSelf: 'auto',
    height: 66,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
});
