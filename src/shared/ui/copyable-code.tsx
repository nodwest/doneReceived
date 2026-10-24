import { Pressable, StyleSheet, Text } from 'react-native';
import { copyText, showToast } from '../lib';
import { theme } from '../theme';
import { Icon } from './icons';

type CopyableCodeProps = {
  code: string;
  /** Тост после копирования. */
  copiedMessage?: string;
};

/** Белая плашка с кодом: тап копирует код в буфер обмена. */
export function CopyableCode({
  code,
  copiedMessage = 'Code copied',
}: CopyableCodeProps) {
  const copy = async () => {
    await copyText(code);
    showToast(copiedMessage);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Copy code ${code}`}
      onPress={copy}
      style={({ pressed }) => [styles.field, pressed && styles.pressed]}
    >
      <Text style={styles.code} numberOfLines={1}>
        {code}
      </Text>
      <Icon name="copy" size={16} color={theme.colors.grey} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  code: {
    flexShrink: 1,
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1,
    color: theme.colors.ink,
  },
});
