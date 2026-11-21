import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, tracking } from '@shared/theme';
import { Icon } from '@shared/ui';

type WordsTaskRowProps = {
  title: string;
  subtitle: string;
  /**
   * active — учит, review — ждёт проверки родителя, done — сегодня сдано и
   * выплачено, новые слова завтра.
   */
  status: 'active' | 'review' | 'done';
  reward: number;
  onPress: () => void;
  tone?: 'child' | 'parent';
};

/**
 * Слова дня в списках заданий: вместо обычной плитки — строка, которая ведёт
 * на вкладку Languages (там учат и проверяют).
 */
export function WordsTaskRow({
  title,
  subtitle,
  status,
  reward,
  onPress,
  tone = 'parent',
}: WordsTaskRowProps) {
  const { t } = useTranslation();
  const review = status === 'review';
  const done = status === 'done';
  const child = tone === 'child';
  const accent = review
    ? theme.colors.reviewAccent
    : done
      ? theme.colors.rewardText
      : child
        ? theme.colors.childInk
        : theme.colors.parentInk;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        review && styles.rowReview,
        done && styles.rowDone,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.icon,
          child && styles.iconChild,
          review && styles.iconReview,
          done && styles.iconDone,
        ]}
      >
        <Icon name={done ? 'badge-check' : 'book'} size={24} color={accent} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.meta}>
          <View
            style={[
              styles.chip,
              review && styles.chipReview,
              done && styles.chipDone,
            ]}
          >
            <Text style={[styles.chipText, { color: accent }]}>
              {review
                ? t('words.rowReview')
                : done
                  ? t('words.rowDone')
                  : t('words.rowLearning')}
            </Text>
          </View>
          <Text style={styles.reward}>
            {t('words.rowReward', { amount: `$${reward}` })}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={theme.colors.grey} />
    </Pressable>
  );
}

const styles = createStyles((colors) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  rowReview: {
    borderColor: colors.reviewBorder,
    backgroundColor: colors.yellowSoft,
  },
  rowDone: {
    borderColor: colors.approvedBorder,
    backgroundColor: colors.readyBg,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetSoft,
  },
  iconChild: {
    backgroundColor: colors.childTint,
  },
  iconReview: {
    backgroundColor: colors.reviewChip,
  },
  iconDone: {
    backgroundColor: colors.readySoft,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.childChip,
  },
  chipReview: {
    backgroundColor: colors.reviewChip,
  },
  chipDone: {
    backgroundColor: colors.readySoft,
  },
  chipText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
  },
  reward: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.rewardText,
  },
}));
