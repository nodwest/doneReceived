import { Image, Text, View } from 'react-native';
import { formatClock, formatDayLabel } from '@shared/lib';
import { formatAmount, type Operation } from '../model/operation';
import { styles } from './operation-row.styled';

type OperationRowProps = Operation & {
  /**
   * Подпись перед временем: имя ребёнка (общая история по дням), день
   * (история одного ребёнка, где имя повторялось бы в каждой строке) или
   * имя и день (история родителя за разные дни).
   */
  caption?: 'child' | 'day' | 'child-day';
};

const CAPTION = {
  child: (name: string, date: Date) => `${name} · ${formatClock(date)}`,
  day: (_name: string, date: Date) =>
    `${formatDayLabel(date)} · ${formatClock(date)}`,
  'child-day': (name: string, date: Date) =>
    `${name} · ${formatDayLabel(date)} ${formatClock(date)}`,
};

/** Начисленная награда в истории: аватар, задача, подпись и время, сумма. */
export function OperationRow({
  title,
  child,
  at,
  amount,
  caption = 'child',
}: OperationRowProps) {
  const date = new Date(at);

  return (
    <View style={styles.container}>
      <Image source={child.avatar} style={styles.avatar} />
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
