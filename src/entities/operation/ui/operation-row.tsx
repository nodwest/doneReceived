import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatDayLabel } from '@shared/lib';
import { formatAmount, type Operation } from '../model/operation';
import { LetterAvatar } from '@shared/ui';
import { styles } from './operation-row.styled';

type OperationRowProps = Operation & {
  /**
   * Подпись перед временем: имя ребёнка (общая история по дням), день
   * (история одного ребёнка, где имя повторялось бы в каждой строке) или
   * имя и день (история родителя за разные дни), только время (история
   * ребёнка от его лица).
   */
  caption?: 'child' | 'day' | 'child-day' | 'time';
  /** Что слева вместо аватара ребёнка (значок задания у ребёнка). */
  leading?: ReactNode;
  /** plain — строка без своей рамки, внутри общей карточки со списком. */
  variant?: 'card' | 'plain';
  /** Тап по строке (Rewards history открывает карточку задания). */
  onPress?: () => void;
};

const CAPTION = {
  child: (name: string, date: Date) => `${name} · ${formatClock(date)}`,
  day: (_name: string, date: Date) =>
    `${formatDayLabel(date)} · ${formatClock(date)}`,
  'child-day': (name: string, date: Date) =>
    `${name} · ${formatDayLabel(date)} ${formatClock(date)}`,
  time: (_name: string, date: Date) => formatClock(date),
};

/**
 * Награда в истории: аватар, задача, подпись и время, сумма. Начисленная —
 * зелёная «+$4»; упущенная — серая «$4», в подписи «expired 6:00 PM» (или
 * «closed», если задание закрыли отказом).
 */
export function OperationRow({
  title,
  child,
  at,
  amount,
  kind,
  missedReason,
  caption = 'child',
  leading,
  variant = 'card',
  onPress,
}: OperationRowProps) {
  const { t } = useTranslation();
  const date = new Date(at);
  const missed = kind === 'missed';
  const closed = missedReason === 'rejected';
  const subtitle = !missed
    ? CAPTION[caption](child.name, date)
    : caption === 'time'
      ? t(
          closed
            ? 'rewardsHistory.closedCaption'
            : 'rewardsHistory.expiredCaption',
          { time: formatClock(date) },
        )
      : caption === 'child'
        ? t(
            closed
              ? 'rewardsHistory.childClosedCaption'
              : 'rewardsHistory.childExpiredCaption',
            { name: child.name, time: formatClock(date) },
          )
        : CAPTION[caption](child.name, date);

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={title}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        variant === 'plain' && styles.plain,
        pressed && styles.pressed,
      ]}
    >
      {leading ?? (
        <LetterAvatar
          source={child.avatar}
          name={child.name}
          style={styles.avatar}
        />
      )}
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={[styles.reward, missed && styles.rewardMissed]}>
        <Text style={[styles.rewardText, missed && styles.rewardTextMissed]}>
          {missed ? formatAmount(amount) : `+${formatAmount(amount)}`}
        </Text>
      </View>
    </Pressable>
  );
}
