import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { styles } from './earn-goal-card.styled';

type Goal = {
  title: string;
  /** Сколько уже накоплено на желание. */
  saved: number;
  price: number;
};

type EarnGoalCardProps = {
  /** Сумма наград за все активные задания. */
  earn: number;
  count: number;
  /** Желание, которое копится сейчас; null — копить не на что. */
  goal: Goal | null;
};

const percent = (part: number, whole: number) =>
  whole > 0 ? Math.min(Math.round((part / whole) * 100), 100) : 0;

/**
 * Голубая карточка над списком заданий ребёнка: сколько можно заработать
 * за активные задания и насколько это приблизит текущее желание. Белая часть
 * полосы — накоплено, жёлтая — придёт за задания.
 */
export function EarnGoalCard({ earn, count, goal }: EarnGoalCardProps) {
  const { t } = useTranslation();
  const after = goal ? Math.min(goal.saved + earn, goal.price) : 0;

  return (
    <LinearGradient
      colors={[theme.colors.childFrom, theme.colors.childDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.top}>
        <Text style={styles.label}>{t('myTasks.canEarn')}</Text>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>${earn}</Text>
          <Text style={styles.forTasks}>
            {t('myTasks.forTasks', { count })}
          </Text>
        </View>
      </View>
      {goal && (
        <View style={styles.goal}>
          <View style={styles.goalHead}>
            <Text style={styles.goalTitle} numberOfLines={1}>
              {goal.title}
            </Text>
            <Text style={styles.nums}>
              ${goal.saved} → <Text style={styles.numsStrong}>${after}</Text>{' '}
              {t('myTasks.ofPrice', { price: goal.price })}
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.saved,
                { width: `${percent(goal.saved, goal.price)}%` },
              ]}
            />
            <LinearGradient
              colors={[theme.colors.goalTrack, theme.colors.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.fromTasks,
                { width: `${percent(after - goal.saved, goal.price)}%` },
              ]}
            />
          </View>
          <View style={styles.caption}>
            <View style={styles.captionDot} />
            <Text style={styles.captionText}>
              {after >= goal.price
                ? t('myTasks.goalReached', { title: goal.title })
                : t('myTasks.goalProgress', {
                    title: goal.title,
                    percent: percent(after, goal.price),
                  })}
            </Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}
