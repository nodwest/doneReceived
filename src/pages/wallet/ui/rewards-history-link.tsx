import { Pressable, Text, View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';
import { OPERATION_KIND_COLORS } from '@entities/operation';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './rewards-history-link.styled';

// Столбики иконки: [x, высота earned, высота missed] в сетке 24×24.
const BARS = [
  [2.5, 6, 4],
  [9.5, 10, 6],
  [16.5, 8, 9],
] as const;
const BASE = 21;
const BAR_WIDTH = 5;
// Светлая «крышка» сверху кубика, как верхняя грань на графике.
const CAP = 1.5;

/** Мини-график в цветах истории наград: earned снизу, missed сверху. */
function RewardsChartIcon({ size = 20 }: { size?: number }) {
  const { earned, missed } = OPERATION_KIND_COLORS;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      {BARS.map(([x, earnedHeight, missedHeight]) => {
        const earnedTop = BASE - earnedHeight;
        const missedTop = earnedTop - missedHeight;
        const bar = { x, width: BAR_WIDTH };
        return (
          <G key={x}>
            <Rect
              {...bar}
              y={missedTop}
              height={missedHeight}
              rx={1}
              fill={missed.front}
            />
            <Rect {...bar} y={missedTop} height={CAP} fill={missed.top} />
            <Rect
              {...bar}
              y={earnedTop}
              height={earnedHeight}
              rx={1}
              fill={earned.front}
            />
            <Rect {...bar} y={earnedTop} height={CAP} fill={earned.top} />
          </G>
        );
      })}
    </Svg>
  );
}

/** Карточка-ссылка Wallet → Rewards history. */
export function RewardsHistoryLink({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <RewardsChartIcon />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{t('wallet.rewardsHistory')}</Text>
        <Text style={styles.hint} numberOfLines={1}>
          {t('wallet.rewardsHistoryHint')}
        </Text>
      </View>
      <Icon name="chevron-right" size={16} color={theme.colors.grey} />
    </Pressable>
  );
}
