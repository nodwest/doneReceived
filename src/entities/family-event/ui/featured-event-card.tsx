import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import {
  formatClock,
  formatDate,
  formatDayRange,
  formatMonthDay,
  isSameDay,
} from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { ApiImage, Icon, LetterAvatar } from '@shared/ui';
import type { FamilyEvent } from '../model/family-event';
import { FAMILY_EVENT_KIND_LABELS } from '../model/family-event';
import { familyEventCover } from './family-event-cover';
import { styles } from './calendar-event.styled';

type FeaturedEventCardProps = {
  event: FamilyEvent;
  homeStatus?: 'live' | 'upcoming';
  /** Тап по карточке — открыть событие. */
  onPress?: () => void;
  /** Кнопка галереи: показывается только в форме события. */
  onPickPhoto?: () => void;
  /** Убрать обложку; кнопка видна, когда фото уже есть. */
  onRemovePhoto?: () => void;
};

/**
 * Большая карточка события: фото на всю карточку, тёмный градиент,
 * текст сверху, участники и напоминание снизу. Без фото — иллюстрация категории.
 */
export function FeaturedEventCard({
  event,
  homeStatus,
  onPress,
  onPickPhoto,
  onRemovePhoto,
}: FeaturedEventCardProps) {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const participants = event.participants.slice(0, 3);
  const range = isSameDay(event.startsAt, event.endsAt)
    ? formatDate(event.startsAt, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : formatDayRange(event.startsAt, event.endsAt);
  const kicker = homeStatus
    ? t(homeStatus === 'live' ? 'home.eventLive' : 'home.eventUpcoming')
    : event.repeat === 'annual'
      ? t('calendar.annualKicker', {
          date: formatMonthDay(event.startsAt),
        })
      : t('calendar.kindKicker', {
          kind: t(FAMILY_EVENT_KIND_LABELS[event.kind]),
          range,
        });

  const schedule =
    homeStatus === 'live'
      ? t('home.eventUntil', {
          date: formatMonthDay(event.endsAt),
          time: formatClock(event.endsAt),
        })
      : range + ' · ' + formatClock(event.startsAt);

  return (
    <Pressable
      accessible
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={
        homeStatus
          ? [kicker, event.title, schedule].join('. ')
          : `${event.title}. ${event.description}`
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <ApiImage
        retainInMemory={false}
        source={familyEventCover(event, mode)}
        resizeMode="cover"
        style={styles.background}
      />
      <LinearGradient
        colors={[
          homeStatus ? 'transparent' : 'rgba(8, 16, 32, 0.72)',
          homeStatus ? 'transparent' : 'rgba(8, 16, 32, 0.22)',
          'rgba(8, 16, 32, 0.04)',
          homeStatus ? 'rgba(8, 16, 32, 0.96)' : 'rgba(8, 16, 32, 0.78)',
        ]}
        locations={homeStatus ? [0, 0.3, 0.48, 1] : [0, 0.38, 0.59, 1]}
        style={styles.overlay}
      />

      {onPickPhoto && (
        // Управление обложкой в форме события: тап по иконке открывает
        // системную галерею. В календаре кнопок нет.
        <View style={styles.photoActions}>
          {onRemovePhoto && event.photo && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('calendar.removePhoto')}
              onPress={onRemovePhoto}
              style={({ pressed }) => [
                styles.photoAction,
                pressed ? styles.pressed : null,
              ]}
            >
              <Icon name="close" size={14} color={theme.colors.white} />
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('calendar.photoLibrary')}
            onPress={onPickPhoto}
            style={({ pressed }) => [
              styles.photoAction,
              pressed ? styles.pressed : null,
            ]}
          >
            <Icon name="image-add" size={16} color={theme.colors.white} />
          </Pressable>
        </View>
      )}

      <View
        style={[
          styles.copy,
          homeStatus && styles.homeCopy,
          onPickPhoto ? styles.copyWithActions : null,
        ]}
      >
        <View style={styles.text}>
          <Text style={[styles.kicker, homeStatus && styles.homeKicker]}>
            {kicker}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text
            style={[styles.description, homeStatus && styles.homeSchedule]}
            numberOfLines={2}
          >
            {homeStatus ? schedule : event.description}
          </Text>
        </View>

        {!homeStatus && (
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
                  date:
                    formatMonthDay(event.reminderAt) +
                    ', ' +
                    formatClock(event.reminderAt),
                })}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
