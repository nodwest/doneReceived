import type { ReactNode } from 'react';
import { Image, Text, View } from 'react-native';
import { formatClock, formatDayLabel } from '@shared/lib';
import { formatAmount, type Operation } from '../model/operation';
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
};

const CAPTION = {
  child: (name: string, date: Date) => `${name} · ${formatClock(date)}`,
  day: (_name: string, date: Date) =>
    `${formatDayLabel(date)} · ${formatClock(date)}`,
  'child-day': (name: string, date: Date) =>
    `${name} · ${formatDayLabel(date)} ${formatClock(date)}`,
  time: (_name: string, date: Date) => formatClock(date),
};

/** Начисленная награда в истории: аватар, задача, подпись и время, сумма. */
export function OperationRow({
  title,
  child,
  at,
  amount,
  caption = 'child',
  leading,
  variant = 'card',
}: OperationRowProps) {
  const date = new Date(at);

  return (
    <View style={[styles.container, variant === 'plain' && styles.plain]}>
      {leading ?? <Image source={child.avatar} style={styles.avatar} />}
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {CAPTION[caption](child.name, date)}
        </Text>
      </View>
      <View style={styles.reward}>
        <Text style={styles.rewardText}>+{formatAmount(amount)}</Text>
      </View>
    </View>
  );
}
