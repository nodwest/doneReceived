import { StyleSheet, Text, View } from 'react-native';
import { theme, tracking } from '@shared/theme';

export type FundsSegment = {
  key: string;
  value: number;
  color: string;
};

type FundsBarProps = {
  /** Слева направо: резерв, это задание, свободно… */
  segments: readonly FundsSegment[];
  /** Сколько вся полоса: обычно весь кошелёк. Меньше суммы сегментов нельзя. */
  scale: number;
  /** Цвет пустой части полосы. */
  trackColor: string;
  height?: number;
};

/**
 * Полоса денег родителя: сегменты пропорциональны суммам, между ними тонкий
 * зазор; ненулевой сегмент не уже 6 pt, чтобы маленькую сумму было видно.
 */
export function FundsBar({
  segments,
  scale,
  trackColor,
  height = 12,
}: FundsBarProps) {
  const visible = segments.filter((segment) => segment.value > 0);
  const filled = visible.reduce((sum, segment) => sum + segment.value, 0);
  const rest = Math.max(scale - filled, 0);
  return (
    <View
      style={[
        styles.bar,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
      ]}
    >
      {visible.map((segment) => (
        <View
          key={segment.key}
          style={[
            styles.segment,
            { flexGrow: segment.value, backgroundColor: segment.color },
          ]}
        />
      ))}
      {rest > 0 && (
        <View style={[styles.segment, styles.rest, { flexGrow: rest }]} />
      )}
    </View>
  );
}

type FundsLegendItemProps = {
  color: string;
  label: string;
  value: string;
  /** Цвет подписи и суммы: на тёмной карточке — светлые. */
  labelColor?: string;
  valueColor?: string;
};

/** Пункт подписи под полосой: точка цвета сегмента, название и сумма. */
export function FundsLegendItem({
  color,
  label,
  value,
  labelColor = theme.colors.grey,
  valueColor = theme.colors.ink,
}: FundsLegendItemProps) {
  return (
    <View style={styles.item}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 2,
    overflow: 'hidden',
  },
  segment: {
    flexBasis: 0,
    minWidth: 6,
  },
  // Пустой хвост полосы (свободное место в кошельке) — без минимальной ширины.
  rest: {
    minWidth: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
  },
  value: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
  },
});
