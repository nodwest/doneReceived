import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import {
  formatAmount,
  KindCube,
  OPERATION_KIND_COLORS,
  type OperationKind,
} from '@entities/operation';
import { useTranslation } from '@shared/i18n';
import { styles } from './day-summary.styled';

type DaySummaryProps = {
  /** Дата дня строкой («Oct 15») или свой заголовок (выбор периода). */
  title: ReactNode;
  earned: number;
  missed: number;
  /** Подписи плашек; по умолчанию «Earned» / «Missed» (у родителя свои). */
  labels?: Record<OperationKind, string>;
  /** Заголовок слева в одном ряду с плашками (дата в Wallet), а не над ними. */
  inline?: boolean;
};

/**
 * Заголовок дня или периода и две плашки итогов: под заголовком на всю
 * ширину или (inline) в одном ряду с ним.
 */
export function DaySummary({
  title,
  earned,
  missed,
  labels,
  inline,
}: DaySummaryProps) {
  const { t } = useTranslation();
  const label = (kind: OperationKind) =>
    labels?.[kind] ?? t(`rewardsHistory.${kind}`);

  return (
    <View style={[styles.container, inline && styles.containerInline]}>
      {typeof title === 'string' ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        title
      )}
      <View style={[styles.totals, inline && styles.totalsInline]}>
        <Total
          kind="earned"
          label={label('earned')}
          amount={earned}
          inline={inline}
        />
        <Total
          kind="missed"
          label={label('missed')}
          amount={missed}
          inline={inline}
        />
      </View>
    </View>
  );
}

type TotalProps = {
  kind: OperationKind;
  label: string;
  amount: number;
  inline?: boolean;
};

function Total({ kind, label, amount, inline }: TotalProps) {
  const { ink, soft } = OPERATION_KIND_COLORS[kind];

  return (
    <View
      style={[
        styles.total,
        inline && styles.totalInline,
        { backgroundColor: soft },
      ]}
    >
      <KindCube kind={kind} />
      <Text
        style={[styles.label, inline && styles.labelInline, { color: ink }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text style={[styles.amount, { color: ink }]}>
        {formatAmount(amount)}
      </Text>
    </View>
  );
}
