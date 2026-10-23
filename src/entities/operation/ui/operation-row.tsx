import { Image, Text, View } from 'react-native';
import { formatClock } from '@shared/lib';
import { formatAmount, type Operation } from '../model/operation';
import { styles } from './operation-row.styled';

/** Начисленная награда в истории: аватар, задача, ребёнок и время, сумма. */
export function OperationRow({ title, child, at, amount }: Operation) {
  return (
    <View style={styles.container}>
      <Image source={child.avatar} style={styles.avatar} />
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {child.name} · {formatClock(new Date(at))}
        </Text>
      </View>
      <View style={styles.reward}>
        <Text style={styles.rewardText}>+{formatAmount(amount)}</Text>
      </View>
    </View>
  );
}
