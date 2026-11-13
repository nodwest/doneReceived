import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';
import { Icon } from '@shared/ui';

const ROW_HEIGHT = 18;
const LINE_HEIGHT = 16;

/** На сколько подсказка поднимается снизу, когда возвращается. */
const APPEAR_SHIFT = 6;

type ResetInviteCodeRowProps = {
  /** Код только что выдан взамен старого: зелёное «New code is ready». */
  fresh: boolean;
  /** Непрозрачность «New code is ready»: гаснет последнюю секунду. */
  glow: SharedValue<number>;
  /** Проявление подсказки и Reset code (`useNewCodeGlow`). */
  appear: SharedValue<number>;
  disabled?: boolean;
  onPress: () => void;
};

/**
 * Строка под кодом второго родителя: «Sent it to the wrong person?» и
 * ссылка Reset code. После сброса на 3 секунды вместо них — зелёное «New
 * code is ready» (последнюю секунду гаснет), без
 * ссылки, чтобы код не сбрасывали очередями. Потом подсказка и ссылка
 * проявляются и чуть поднимаются снизу.
 */
export function ResetInviteCodeRow({
  fresh,
  glow,
  appear,
  disabled,
  onPress,
}: ResetInviteCodeRowProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.get() }));
  const appearStyle = useAnimatedStyle(() => ({
    opacity: appear.get(),
    // «Уменьшить движение» — только проявление, без сдвига.
    transform: [
      { translateY: reduced ? 0 : (1 - appear.get()) * APPEAR_SHIFT },
    ],
  }));

  if (fresh) {
    return (
      // Разные key: иначе React переиспользует один элемент, и сдвиг
      // подсказки (translateY) остаётся на зелёной строке.
      <Animated.View
        key="fresh"
        style={[styles.row, glowStyle]}
        accessibilityLiveRegion="polite"
      >
        <Icon name="check" size={14} color={theme.colors.readyText} />
        <Text style={[styles.text, styles.freshText]} numberOfLines={1}>
          {t('resetInviteCode.ready')}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View key="idle" style={[styles.row, appearStyle]}>
      <Text style={[styles.text, styles.question]} numberOfLines={1}>
        {t('resetInviteCode.question')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        hitSlop={8}
        onPress={onPress}
        style={({ pressed }) => [
          styles.link,
          (pressed || disabled) && styles.dimmed,
        ]}
      >
        <Icon name="refresh" size={14} color={theme.colors.violet} />
        <Text style={styles.linkText}>{t('resetInviteCode.action')}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Одна высота и высота строки у обоих состояний: зелёный текст стоит
  // ровно на месте подсказки.
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  text: {
    lineHeight: LINE_HEIGHT,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
  },
  question: {
    flex: 1,
    color: theme.colors.inkSoft,
  },
  freshText: {
    flexShrink: 1,
    color: theme.colors.readyText,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dimmed: {
    opacity: 0.6,
  },
  linkText: {
    lineHeight: LINE_HEIGHT,
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
});
