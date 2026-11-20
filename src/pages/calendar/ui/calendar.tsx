import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  EventRow,
  EventTile,
  FeaturedEventCard,
  type FamilyEvent,
} from '@entities/family-event';
import { useViewerRole } from '@entities/user';
import { useFamilyEvents } from '@features/family-event';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatMonthDay, formatWeekdayShort } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { RoundButton, ScreenSection } from '@shared/ui';
import { TabScreen } from '@widgets/bottom-nav';
import { FamilyCalendar } from '@widgets/family-calendar';
import { styles } from './calendar.styled';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Вкладка Calendar: свернутая неделя, ближайшее событие и список следующих.
 * «+» создаёт событие, тап по событию открывает его карточку.
 */
export function CalendarPage() {
  useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const viewer = useViewerRole();
  const [expanded, setExpanded] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const {
    today,
    month,
    rollingEvents,
    monthEvents,
    featured,
    upcoming,
    isPending,
    isMonthPending,
    isError,
    refetch,
  } = useFamilyEvents(monthOffset, expanded);

  const openEvent = (event: FamilyEvent) =>
    router.push({
      pathname: '/family-event/[id]',
      params: {
        id: event.id,
        ...(event.repeat === 'annual'
          ? { year: String(event.startsAt.getFullYear()) }
          : {}),
      },
    });

  const metaFor = (event: FamilyEvent) => {
    const names = event.participants.map((person) => person.name);
    const joined =
      names.length === 0
        ? ''
        : names.length === 1
          ? names[0]
          : `${names.slice(0, -1).join(', ')} ${t('common.and')} ${
              names[names.length - 1]
            }`;
    const time = formatClock(event.startsAt);
    return joined
      ? t('calendar.meta', { time, names: joined })
      : t('calendar.metaTime', { time });
  };

  const isParent = viewer !== 'child';
  const tiles = upcoming.slice(0, 2);
  const rows = upcoming.slice(2);

  return (
    <TabScreen activeKey="calendar">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('calendar.title')}
          </Text>
          {isParent && (
            <RoundButton
              icon="plus"
              tone="primary"
              accessibilityLabel={t('calendar.add')}
              onPress={() => router.push('/create-family-event')}
            />
          )}
        </View>

        <FamilyCalendar
          today={today}
          events={expanded ? monthEvents : rollingEvents}
          expanded={expanded}
          month={month}
          onMonthChange={(direction) =>
            setMonthOffset((value) => value + direction)
          }
          onToggle={() => setExpanded((value) => !value)}
        />

        {expanded && isMonthPending && (
          <ActivityIndicator
            style={styles.loading}
            color={theme.colors.blueInk}
          />
        )}

        {expanded &&
          !isMonthPending &&
          !isError &&
          monthEvents.length === 0 && (
            <Text style={styles.monthEmpty}>{t('calendar.emptyMonth')}</Text>
          )}

        {isError && (
          <Pressable
            accessibilityRole="button"
            onPress={() => refetch()}
            style={styles.errorCard}
          >
            <Text style={styles.errorTitle}>{t('calendar.refreshError')}</Text>
            <Text style={styles.errorLink}>{t('calendar.retry')}</Text>
          </Pressable>
        )}

        {isPending && (
          <ActivityIndicator
            style={styles.loading}
            color={theme.colors.blueInk}
          />
        )}

        {!isPending && featured && (
          <FeaturedEventCard
            event={featured}
            onPress={() => openEvent(featured)}
          />
        )}

        {!isPending && !isError && !featured && upcoming.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{t('calendar.emptyTitle')}</Text>
            <Text style={styles.emptyHint}>{t('calendar.emptyHint')}</Text>
            {isParent && (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/create-family-event')}
              >
                <Text style={styles.emptyAction}>
                  {t('calendar.createAction')}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {upcoming.length > 0 && (
          <ScreenSection title={t('calendar.upcoming')}>
            <View style={styles.sectionList}>
              {tiles.length === 2 && (
                <View style={styles.upcomingRow}>
                  <EventTile
                    icon="star"
                    tone="blue"
                    dayLabel={capitalize(formatWeekdayShort(tiles[0].startsAt))}
                    title={tiles[0].title}
                    meta={metaFor(tiles[0])}
                    onPress={() => openEvent(tiles[0])}
                  />
                  <EventTile
                    icon="bell"
                    tone="amber"
                    dayLabel={formatMonthDay(tiles[1].startsAt)}
                    title={tiles[1].title}
                    meta={metaFor(tiles[1])}
                    onPress={() => openEvent(tiles[1])}
                  />
                </View>
              )}
              {tiles.length === 1 && (
                <View style={styles.upcomingRow}>
                  <EventTile
                    icon="star"
                    tone="blue"
                    dayLabel={capitalize(formatWeekdayShort(tiles[0].startsAt))}
                    title={tiles[0].title}
                    meta={metaFor(tiles[0])}
                    onPress={() => openEvent(tiles[0])}
                  />
                </View>
              )}
              {rows.map((event) => (
                <EventRow
                  key={event.id}
                  weekday={formatWeekdayShort(event.startsAt).toUpperCase()}
                  day={event.startsAt.getDate()}
                  title={event.title}
                  meta={metaFor(event)}
                  tag={event.reminderAt ? t('calendar.remindTag') : undefined}
                  onPress={() => openEvent(event)}
                />
              ))}
            </View>
          </ScreenSection>
        )}
      </ScrollView>
    </TabScreen>
  );
}
