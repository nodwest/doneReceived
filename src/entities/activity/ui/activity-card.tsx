import { Fragment, useState } from 'react';
import { Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, themedValue } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { Collapsible, Icon, LetterAvatar } from '@shared/ui';
import { ActivityHistory, type ActivityStep } from './activity-history';
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
  /** История статусов задания от старой к новой; пусто — не раскрывается. */
  history?: ActivityStep[];
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

/** Сколько последних шагов задания видно точками на свёрнутой карточке. */
const VISIBLE_CHANGES = 5;

/**
 * Карточка события в ленте: аватар, название задания со статусом, когда и
 * с кем это случилось, сумма и точки изменений. Карточка задания
 * раскрывается тапом: вместо точек — история статусов по порядку.
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
}: ActivityCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  // Даже одно изменение показываем точкой: у только что созданного задания
  // тоже должен быть виден его статус, а не только слово в заголовке.
  const hasHistory = history.length > 0;
  const changes = t('activity.changeCount', { count: history.length });

  const summary = (
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
  );

  return (
    <View style={[styles.container, styles[tone]]}>
      <LinearGradient
        colors={GRADIENTS[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.background}
      />
      {hasHistory ? (
        <>
          {/* Нажимается верх карточки: шаги истории под ним скринридер читает
              по одному. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={[title, status, subtitle, amount, changes]
              .filter(Boolean)
              .join(', ')}
            accessibilityState={{ expanded }}
            aria-expanded={expanded}
            onPress={() => setExpanded((current) => !current)}
            style={({ pressed }) => [
              styles.content,
              expanded && styles.contentOpen,
              pressed && styles.pressed,
            ]}
          >
            {summary}
            <View style={styles.track}>
              {!expanded && (
                <View style={styles.dots}>
                  {history.slice(-VISIBLE_CHANGES).map((step, index) => (
                    <Fragment key={step.id}>
                      {index > 0 && (
                        <View
                          style={[
                            styles.connector,
                            { backgroundColor: CONNECTORS[tone] },
                          ]}
                        />
                      )}
                      <View
                        style={[styles.dot, { backgroundColor: step.color }]}
                      />
                    </Fragment>
                  ))}
                </View>
              )}
              <Text style={styles.changes} numberOfLines={1}>
                {expanded ? changes : `· ${changes}`}
              </Text>
              <View style={expanded && styles.chevronUp}>
                <Icon
                  name="chevron-down"
                  size={16}
                  color={theme.colors.inkSoft}
                />
              </View>
            </View>
          </Pressable>
          <Collapsible open={expanded}>
            <View style={styles.history}>
              <ActivityHistory
                steps={history}
                lineColor={CONNECTORS[tone]}
                currentStyle={STATUS_STYLES[tone]}
              />
            </View>
          </Collapsible>
        </>
      ) : (
        <View style={styles.content}>{summary}</View>
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
