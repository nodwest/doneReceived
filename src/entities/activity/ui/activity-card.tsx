import { Fragment, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, themedValue } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { LetterAvatar } from '@shared/ui';
import { styles } from './activity-item.styled';

/**
 * pending — на проверке (тёплая), approved — принято (зелёная), new — новое
 * (голубая), sentBack — вернули на доработку (коралловая), missed — отменено,
 * закрыто или истекло: награды не будет (графитовая, как упущенное в истории).
 */
export type ActivityTone =
  | 'pending'
  | 'approved'
  | 'new'
  | 'sentBack'
  | 'missed';

/** Шаг статуса в истории задания: точка на дорожке под карточкой. */
export interface ActivityStatus {
  id: string;
  /** Подпись с заглавной буквы — в подсказке при наведении или нажатии. */
  label: string;
  /** Цвет точки: свой у каждого статуса. */
  color: string;
}

type ActivityCardProps = {
  tone: ActivityTone;
  /** Фото; null — первая буква `name`. */
  avatar: ImageSourcePropType | null;
  /** Чьё фото: для буквы, когда фото нет. */
  name?: string;
  /** Что случилось: у задания — только название в кавычках. */
  title: string;
  /** Статус задания: дописывается к названию цветным. */
  status?: string;
  subtitle: string;
  amount: string;
  /** История статусов задания от старой к новой; пусто — без дорожки. */
  history?: ActivityStatus[];
  /** Сколько всего изменений: может быть больше, чем точек на дорожке. */
  changesCount?: number;
};

const GRADIENTS = themedValue<Record<ActivityTone, readonly [string, string]>>(
  () => ({
    pending: [theme.colors.reviewFrom, theme.colors.reviewTo],
    approved: [theme.colors.approvedFrom, theme.colors.approvedTo],
    sentBack: [theme.colors.sentBackBg, theme.colors.surface],
    missed: [theme.colors.missedTile, theme.colors.surface],
    new: [theme.colors.childTint, theme.colors.childTintLight],
  }),
);

const CONNECTORS: Record<ActivityTone, string> = {
  pending: 'rgba(230, 126, 0, 0.3)',
  approved: 'rgba(31, 153, 92, 0.3)',
  new: 'rgba(30, 95, 184, 0.25)',
  sentBack: 'rgba(194, 74, 42, 0.28)',
  missed: 'rgba(75, 84, 104, 0.24)',
};

const DOT_SLOT = 10;
const CONNECTOR_WIDTH = 8;
const DOT_STEP = DOT_SLOT + CONNECTOR_WIDTH;
const TOOLTIP_OFFSET = 0;

/**
 * Карточка события в ленте: аватар, название задания со статусом, когда и
 * с кем это случилось, сумма и дорожка изменений. Точка дорожки — один
 * статус: наведение (веб) или нажатие показывает его подсказкой.
 */
export function ActivityCard({
  tone,
  avatar,
  name = '',
  title,
  status,
  subtitle,
  amount,
  history = [],
  changesCount = 0,
}: ActivityCardProps) {
  const { t } = useTranslation();
  const web = Platform.OS === 'web';
  const [active, setActive] = useState<number | null>(null);
  const activeStatus = active === null ? null : history[active];
  // Даже одно изменение показываем точкой: у только что созданного задания
  // тоже должен быть виден его статус, а не только слово в заголовке.
  const hasHistory = history.length > 0;

  return (
    <View style={[styles.container, styles[tone]]}>
      <LinearGradient
        colors={GRADIENTS[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.background}
      />
      <View style={styles.row}>
        <LetterAvatar source={avatar} name={name} style={styles.avatar} />
        <View style={styles.middle}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {status ? (
              <Text style={[styles.status, STATUS_STYLES[tone]]}>{status}</Text>
            ) : null}
          </View>
          <Text
            style={[styles.subtitle, SUBTITLE_STYLES[tone]]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
        {amount ? (
          <Text style={[styles.reward, REWARD_STYLES[tone]]}>{amount}</Text>
        ) : null}
      </View>
      {hasHistory && (
        <View style={styles.track}>
          <View style={styles.dots}>
            {history.map((entry, index) => (
              <Fragment key={entry.id}>
                {index > 0 && (
                  <View
                    style={[
                      styles.connector,
                      { backgroundColor: CONNECTORS[tone] },
                    ]}
                  />
                )}
                {web ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={entry.label}
                    accessibilityState={{ expanded: active === index }}
                    hitSlop={{ top: 12, bottom: 12, left: 4, right: 4 }}
                    onHoverIn={() => setActive(index)}
                    onHoverOut={() =>
                      setActive((current) =>
                        current === index ? null : current,
                      )
                    }
                    onFocus={() => setActive(index)}
                    onBlur={() =>
                      setActive((current) =>
                        current === index ? null : current,
                      )
                    }
                    onPress={() => setActive(index)}
                    style={styles.dotSlot}
                  >
                    <View
                      style={[styles.dot, { backgroundColor: entry.color }]}
                    />
                  </Pressable>
                ) : (
                  // Натив: без подсказок-статусов. Точки остаются только
                  // историей цветов, нажимать их нечего.
                  <View style={styles.dotSlot}>
                    <View
                      style={[styles.dot, { backgroundColor: entry.color }]}
                    />
                  </View>
                )}
              </Fragment>
            ))}
          </View>
          <Text style={styles.changes}>
            · {t('activity.changeCount', { count: changesCount })}
          </Text>
          {web && activeStatus && (
            <View
              pointerEvents="none"
              style={[
                styles.tooltip,
                { left: (active ?? 0) * DOT_STEP + TOOLTIP_OFFSET },
              ]}
            >
              <Text style={styles.tooltipText}>{activeStatus.label}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const SUBTITLE_STYLES = themedValue(() => ({
  pending: styles.subtitlePending,
  approved: styles.subtitleApproved,
  new: styles.subtitleNew,
  sentBack: styles.subtitleSentBack,
  missed: styles.subtitleMissed,
}));

const STATUS_STYLES = themedValue(() => ({
  pending: styles.statusPending,
  approved: styles.statusApproved,
  new: styles.statusNew,
  sentBack: styles.statusSentBack,
  missed: styles.statusMissed,
}));

const REWARD_STYLES = themedValue(() => ({
  pending: styles.rewardPending,
  approved: null,
  new: styles.rewardNew,
  sentBack: styles.rewardSentBack,
  missed: styles.rewardMissed,
}));
