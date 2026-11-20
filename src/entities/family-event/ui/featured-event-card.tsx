import { ImageBackground, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import {
  formatDate,
  formatDayRange,
  formatMonthDay,
  isSameDay,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { LetterAvatar } from '@shared/ui';
import type { FamilyEvent } from '../model/family-event';
import { FAMILY_EVENT_KIND_LABELS } from '../model/family-event';
import { styles } from './calendar-event.styled';

type FeaturedEventCardProps = {
  event: FamilyEvent;
  /** Тап по карточке — открыть событие. */
  onPress?: () => void;
};

/**
 * Большая карточка события: фото на всю карточку, тёмный градиент,
 * текст сверху, участники и напоминание снизу. Без фото — синий градиент.
 */
export function FeaturedEventCard({ event, onPress }: FeaturedEventCardProps) {
  const { t } = useTranslation();
  const participants = event.participants.slice(0, 3);
  const range = isSameDay(event.startsAt, event.endsAt)
    ? formatDate(event.startsAt, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : formatDayRange(event.startsAt, event.endsAt);
  const kicker =
    event.repeat === 'annual'
      ? t('calendar.annualKicker', {
          date: formatMonthDay(event.startsAt),
        })
      : t('calendar.kindKicker', {
          kind: t(FAMILY_EVENT_KIND_LABELS[event.kind]),
          range,
        });

  return (
    <Pressable
      accessible
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={`${event.title}. ${event.description}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      {event.photo ? (
        <ImageBackground
          source={event.photo}
          resizeMode="cover"
          style={styles.background}
          imageStyle={styles.backgroundImage}
        />
      ) : (
        <LinearGradient
          colors={[theme.colors.childDeep, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
      )}
      <LinearGradient
        colors={[
          'rgba(8, 16, 32, 0.72)',
          'rgba(8, 16, 32, 0.22)',
          'rgba(8, 16, 32, 0.04)',
          'rgba(8, 16, 32, 0.78)',
        ]}
        locations={[0, 0.38, 0.59, 1]}
        style={styles.overlay}
      />

      <View style={styles.copy}>
        <View style={styles.text}>
          <Text style={styles.kicker}>{kicker}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        </View>

        <View style={styles.row}>
          {participants.length > 0 && (
            <View style={styles.avatars}>
              {participants.map((person, index) => (
                <LetterAvatar
                  key={person.id}
                  source={person.avatar}
                  name={person.name}
                  tone="onDark"
                  letterSize={11}
                  style={[
                    styles.avatar,
                    index > 0 ? styles.avatarOverlap : null,
                  ]}
                />
              ))}
            </View>
          )}
          <View style={styles.spacer} />
          {event.reminderAt && (
            <Text style={styles.reminder} numberOfLines={1}>
              {t('calendar.remindOn', {
                date: formatMonthDay(event.reminderAt),
              })}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
