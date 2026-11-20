import { Text, View } from 'react-native';
import { createStyles, theme, tracking } from '@shared/theme';

type SectionHeadProps = {
  title: string;
  count: number;
  /** Подпись справа: «Soonest first», «Waiting for a parent». */
  hint: string;
  tone: 'child' | 'review';
};

/** Заголовок раздела списка заданий: название, счётчик и подпись справа. */
export function SectionHead({ title, count, hint, tone }: SectionHeadProps) {
  return (
    <View style={styles.head}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.count, tone === 'review' && styles.countReview]}>
        <Text
          style={[
            styles.countText,
            tone === 'review' && styles.countTextReview,
          ]}
        >
          {count}
        </Text>
      </View>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = createStyles((colors) => ({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  count: {
    minWidth: 24,
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: colors.childCount,
  },
  countReview: {
    backgroundColor: colors.reviewChip,
  },
  countText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: colors.childInk,
  },
  countTextReview: {
    color: colors.reviewChipText,
  },
  hint: {
    marginLeft: 'auto',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
}));
