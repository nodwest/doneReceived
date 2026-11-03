import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
} from 'react-native';
import { theme, tracking } from '../theme';

type CodeInputProps = {
  value: string;
  /** Уже приведённое значение: заглавные буквы и цифры, не длиннее length. */
  onChangeText: (value: string) => void;
  /** Сколько символов в коде. */
  length: number;
  /** Красные рамки: код не подошёл. */
  error?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
  accessibilityLabel?: string;
};

/**
 * Код из письма по ячейке на символ. На деле это одно невидимое поле поверх
 * ячеек: тап по любой ячейке попадает в него и открывает клавиатуру,
 * вставка из буфера заполняет все ячейки сразу. Активная ячейка — следующая
 * пустая.
 */
export function CodeInput({
  value,
  onChangeText,
  length,
  error,
  editable = true,
  autoFocus,
  accessibilityLabel,
}: CodeInputProps) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <View style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const char = value[i];
        const isActive = focused && i === active;
        return (
          <View
            key={i}
            style={[
              styles.cell,
              isActive && styles.cellActive,
              error && styles.cellError,
            ]}
          >
            {char ? (
              <Text style={styles.char}>{char}</Text>
            ) : (
              isActive && <View style={styles.caret} />
            )}
          </View>
        );
      })}
      <TextInput
        value={value}
        onChangeText={(text) =>
          onChangeText(
            text
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, '')
              .slice(0, length),
          )
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={length}
        editable={editable}
        autoFocus={autoFocus}
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        spellCheck={false}
        caretHidden
        accessibilityLabel={accessibilityLabel}
        style={styles.hiddenInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  cellActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.violet,
    boxShadow: '0px 0px 0px 3px rgba(108, 92, 231, 0.15)',
  },
  cellError: {
    borderColor: theme.colors.danger,
  },
  char: {
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  caret: {
    width: 2,
    height: 24,
    borderRadius: 1,
    backgroundColor: theme.colors.violet,
  },
  // Поле лежит поверх ячеек и ловит ввод, но его не видно.
  hiddenInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    color: 'transparent',
    ...Platform.select<TextStyle>({
      web: { outlineWidth: 0, outlineStyle: 'none' } as unknown as TextStyle,
    }),
  },
});
