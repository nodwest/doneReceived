import { Text, View } from 'react-native';
import {
  formatAmount,
  KindCube,
  OPERATION_KIND_COLORS,
  type DayTotals,
  type OperationKind,
} from '@entities/operation';
import { formatMonthDay } from '@shared/lib';
import { styles } from './day-summary.styled';

const KIND_LABEL: Record<OperationKind, string> = {
  earned: 'Earned',
  missed: 'Missed',
};

/** Дата выбранного дня и итоги: сколько заработано и сколько упущено. */
export function DaySummary({ date, earned, missed }: DayTotals) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatMonthDay(date)}</Text>
      <View style={styles.totals}>
        <Total kind="earned" amount={earned} />
        <Total kind="missed" amount={missed} />
      </View>
    </View>
  );
}

function Total({ kind, amount }: { kind: OperationKind; amount: number }) {
  const { ink, soft } = OPERATION_KIND_COLORS[kind];

  return (
    <View style={[styles.total, { backgroundColor: soft }]}>
      <KindCube kind={kind} />
      <Text style={[styles.label, { color: ink }]} numberOfLines={1}>
        {KIND_LABEL[kind]}
      </Text>
      <Text style={[styles.amount, { color: ink }]}>
        {formatAmount(amount)}
      </Text>
    </View>
  );
}
