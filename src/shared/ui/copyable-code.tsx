import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from '../i18n';
import { copyText, showToast } from '../lib';
import { theme } from '../theme';
import { Icon } from './icons';

type CopyableCodeProps = {
  code: string;
  /** Тост после копирования; по умолчанию «Code copied» на языке интерфейса. */
  copiedMessage?: string;
  /**
   * Подсветка кода зелёным: 1 — зелёный, 0 — обычный. Только что выданный
   * код горит и гаснет в обычный цвет (на UI-потоке).
   */
  highlight?: SharedValue<number>;
};

/** Белая плашка с кодом: тап копирует код в буфер обмена. */
export function CopyableCode({
  code,
  copiedMessage,
  highlight,
}: CopyableCodeProps) {
  const { t } = useTranslation();
  const tint = useAnimatedStyle(() => ({
    color: highlight
      ? interpolateColor(
          highlight.get(),
          [0, 1],
          [theme.colors.ink, theme.colors.readyText],
        )
      : theme.colors.ink,
  }));
  const copy = async () => {
    await copyText(code);
    showToast(copiedMessage ?? t('copyableCode.copied'));
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('copyableCode.copy', { code })}
      onPress={copy}
      style={({ pressed }) => [styles.field, pressed && styles.pressed]}
    >
      <Animated.Text style={[styles.code, tint]} numberOfLines={1}>
        {code}
      </Animated.Text>
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
