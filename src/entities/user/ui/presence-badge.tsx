import { useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { Icon } from '@shared/ui';
import { useTimeAgo } from '@shared/lib';
import { theme } from '@shared/theme';
import type { Presence } from '../model/presence';
import { styles } from './presence-badge.styled';

type PresenceBadgeProps = Presence & {
  /** Строка без плашки — в карточке участника семьи. */
  compact?: boolean;
};

/** «At home · 5 min ago» с домиком или серая «Away · 12 min ago». */
export function PresenceBadge({ atHome, since, compact }: PresenceBadgeProps) {
  const { t } = useTranslation();
  const ago = useTimeAgo(since);

  if (compact) {
    return (
      <CompactPresence
        status={atHome ? t('presence.atHome') : t('presence.away')}
        ago={ago}
        atHome={atHome}
      />
    );
  }

  if (!atHome) {
    return (
      <View style={[styles.badge, styles.away]}>
        <Text style={[styles.text, styles.awayText]}>
          {t('presence.away')} · {ago}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.homeFrom, theme.colors.homeTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.badge}
    >
      <Icon name="home" size={16} color={theme.colors.homeBrown} />
      <Text style={[styles.text, styles.homeText]}>
        {t('presence.atHome')} · {ago}
      </Text>
    </LinearGradient>
  );
}

type CompactPresenceProps = { status: string; ago: string; atHome: boolean };

/**
 * Строка «Дома · 5 мин назад» в карточке участника. Не помещается — время
 * переносится на вторую строку: сверху «Дома», снизу «5 мин назад». Точка
 * при переносе прячется, но место занимает: иначе строка снова влезала бы
 * и раскладка прыгала туда-обратно.
 */
function CompactPresence({ status, ago, atHome }: CompactPresenceProps) {
  const [statusY, setStatusY] = useState(0);
  const [agoY, setAgoY] = useState(0);
  const wrapped = agoY > statusY;
  const textStyle = [
    styles.compactText,
    atHome ? styles.homeText : styles.compactAway,
  ];
  const y = (event: LayoutChangeEvent) => event.nativeEvent.layout.y;

  return (
    <View style={styles.compact}>
      <View
        style={styles.compactPart}
        onLayout={(event) => setStatusY(y(event))}
      >
        {atHome && (
          <Icon name="home" size={14} color={theme.colors.homeBrown} />
        )}
        <Text style={textStyle} numberOfLines={1}>
          {status}
          <Text style={wrapped && styles.hidden}> ·</Text>
        </Text>
      </View>
      <Text
        style={textStyle}
        numberOfLines={1}
        onLayout={(event) => setAgoY(y(event))}
      >
        {ago}
      </Text>
    </View>
  );
}
