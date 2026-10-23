import { Image, Text, View } from 'react-native';
import { formatClock, formatDayLabel } from '@shared/lib';
import { formatAmount, type Operation } from '../model/operation';
import { styles } from './operation-row.styled';

type OperationRowProps = Operation & {
  /**
   * Что стоит в подписи перед временем: имя ребёнка (общая история) или день
   * (история одного ребёнка, где имя повторялось бы в каждой строке).
   */
  caption?: 'child' | 'day';
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
          {caption === 'day' ? formatDayLabel(date) : child.name} ·{' '}
          {formatClock(date)}
        </Text>
      </View>
      <View style={styles.reward}>
        <Text style={styles.rewardText}>+{formatAmount(amount)}</Text>
      </View>
    </View>
  );
}
