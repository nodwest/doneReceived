import { Text, View } from 'react-native';
import { formatCountdown, useNow } from '@shared/lib';
import { createStyles, theme, tracking } from '@shared/theme';
import { Icon } from '@shared/ui';
import { formatRewardShort } from '../model';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Сколько осталось до срока — плашкой в шапке плитки: тёплая, пока осталось
 * меньше суток, дальше — голубая.
 */
export function TileTimer({ expiresAt }: { expiresAt: string }) {
  const now = useNow();
  const left = new Date(expiresAt).getTime() - now.getTime();
  const warm = left < DAY_MS;
  const color = warm ? theme.colors.dueInk : theme.colors.childDeep;
  return (
    <View style={[styles.pill, warm ? styles.warm : styles.cool]}>
      <Icon name="clock" size={16} color={color} />
      <Text style={[styles.timerText, { color }]}>{formatCountdown(left)}</Text>
    </View>
  );
}

type TilePillProps = {
  label: string;
  /**
   * review — белая на тёплой плитке «на проверке» у родителя, reviewChild —
   * тёплая на светлой плитке у ребёнка, paid — зелёная с галочкой, missed —
   * серая с часами (упущенное задание).
   */
  tone: 'review' | 'reviewChild' | 'paid' | 'missed';
};

/**
 * Плашка с подписью в шапке плитки: «Done 2 h ago», «Paid 6:12 PM»,
 * «Expired 5:00 PM».
 */
export function TilePill({ label, tone }: TilePillProps) {
  return (
    <View style={[styles.pill, styles[tone]]}>
      {tone === 'paid' && (
        <Icon name="check" size={14} color={theme.colors.rewardText} />
      )}
      {tone === 'missed' && (
        <Icon name="clock" size={14} color={theme.colors.missedDeep} />
      )}
      <Text
        style={[
          styles.pillText,
          tone === 'paid' && styles.pillTextPaid,
          tone === 'missed' && styles.pillTextMissed,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

type RewardAmountProps = {
  reward: number;
  /** Выплачено: зелёное «+$4». */
  paid?: boolean;
  /** Упущено: графитовое «$4». */
  missed?: boolean;
};

/**
 * Награда внизу плитки: монета и сумма. Без рамки и фона — это сведения, а не
 * кнопка.
 */
export function RewardAmount({ reward, paid, missed }: RewardAmountProps) {
  const value = formatRewardShort(reward);
  return (
    <View style={styles.reward}>
      <Icon name="coin" size={24} color={theme.colors.yellow} />
      <Text
        style={[
          styles.rewardText,
          paid && styles.rewardTextPaid,
          missed && styles.rewardTextMissed,
        ]}
      >
        {paid ? `+${value}` : value}
      </Text>
    </View>
  );
}

/** Между плитками в списках: тени соседних не накладываются. */
export const TILE_GAP = 17;

/** Общие стили плиток заданий: основа, шапка, название, описание. */
export const tileStyles = createStyles((colors) => ({
  // Основа плитки и тень со всех сторон.
  surface: {
    overflow: 'hidden',
    backgroundColor: colors.cardBase,
    boxShadow: '0px 0px 16px rgba(26, 26, 46, 0.26)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  meta: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  name: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  // «from» перед именем автора.
  namePrefix: {
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  caption: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  // Название целиком, сколько бы строк ни заняло.
  title: {
    fontSize: theme.fontSize.lg,
    lineHeight: 24,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  description: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: colors.inkSoft,
  },
}));

/** Описание в плитке — не длиннее стольких строк, дальше многоточие. */
export const TILE_DESCRIPTION_LINES = 5;

const styles = createStyles((colors) => ({
  pill: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 18,
  },
  warm: {
    backgroundColor: colors.timerWarm,
  },
  cool: {
    backgroundColor: colors.timerCool,
  },
  review: {
    paddingLeft: 12,
    backgroundColor: colors.reviewTileChip,
  },
  reviewChild: {
    paddingLeft: 12,
    backgroundColor: colors.reviewChipBg,
  },
  paid: {
    backgroundColor: colors.approvedFrom,
  },
  missed: {
    backgroundColor: colors.missedTile,
  },
  timerText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    fontVariant: ['tabular-nums'],
  },
  pillText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.bold,
    color: colors.reviewText,
  },
  pillTextPaid: {
    color: colors.rewardText,
  },
  pillTextMissed: {
    color: colors.missedDeep,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  rewardTextPaid: {
    color: colors.rewardText,
  },
  rewardTextMissed: {
    color: colors.missedDeep,
  },
}));
