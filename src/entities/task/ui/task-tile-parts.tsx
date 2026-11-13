import { StyleSheet, Text, View } from 'react-native';
import { formatCountdown, useNow } from '@shared/lib';
import { theme, tracking } from '@shared/theme';
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
  /** review — белая на тёплой плитке «на проверке», paid — зелёная с галочкой. */
  tone: 'review' | 'paid';
};

/** Плашка с подписью в шапке плитки: «Done 2 h ago», «Paid 6:12 PM». */
export function TilePill({ label, tone }: TilePillProps) {
  const paid = tone === 'paid';
  return (
    <View style={[styles.pill, paid ? styles.paid : styles.review]}>
      {paid && <Icon name="check" size={14} color={theme.colors.rewardText} />}
      <Text style={[styles.pillText, paid && styles.pillTextPaid]}>
        {label}
      </Text>
    </View>
  );
}

type RewardAmountProps = {
  reward: number;
  /** Выплачено: зелёное «+$4». */
  paid?: boolean;
};

/**
 * Награда внизу плитки: монета и сумма. Без рамки и фона — это сведения, а не
 * кнопка.
 */
export function RewardAmount({ reward, paid }: RewardAmountProps) {
  const value = formatRewardShort(reward);
  return (
    <View style={styles.reward}>
      <Icon name="coin" size={24} color={theme.colors.yellow} />
      <Text style={[styles.rewardText, paid && styles.rewardTextPaid]}>
        {paid ? `+${value}` : value}
      </Text>
    </View>
  );
}

/** Общие стили плиток заданий: шапка, название, описание. */
export const tileStyles = StyleSheet.create({
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
    color: theme.colors.ink,
  },
  // «from» перед именем автора.
  namePrefix: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  caption: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  // Название целиком, сколько бы строк ни заняло.
  title: {
    fontSize: theme.fontSize.lg,
    lineHeight: 24,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  description: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
  },
});

/** Описание в плитке — не длиннее стольких строк, дальше многоточие. */
export const TILE_DESCRIPTION_LINES = 5;

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.timerWarm,
  },
  cool: {
    backgroundColor: theme.colors.timerCool,
  },
  review: {
    paddingLeft: 12,
    backgroundColor: theme.colors.white,
  },
  paid: {
    backgroundColor: theme.colors.approvedFrom,
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
    color: theme.colors.reviewText,
  },
  pillTextPaid: {
    color: theme.colors.rewardText,
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
    color: theme.colors.ink,
  },
  rewardTextPaid: {
    color: theme.colors.rewardText,
  },
});
