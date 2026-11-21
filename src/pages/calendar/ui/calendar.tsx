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
  EventTile,
  eventCoversDay,
  FeaturedEventCard,
  type FamilyEvent,
} from '@entities/family-event';
import { useViewerRole } from '@entities/user';
import { useFamilyEvents } from '@features/family-event';
import { useTranslation } from '@shared/i18n';
import { theme, useTheme } from '@shared/theme';
import { RoundButton, ScreenSection } from '@shared/ui';
import { TabScreen } from '@widgets/bottom-nav';
import { FamilyCalendar } from '@widgets/family-calendar';
import { styles } from './calendar.styled';

/**
 * Вкладка Calendar: месяц, ближайшее событие и список следующих.
 * «+» создаёт событие, тап по событию открывает его карточку.
 */
export function CalendarPage() {
  useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const viewer = useViewerRole();
  const [expanded, setExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
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

  const isParent = viewer !== 'child';
  const tiles = upcoming.slice(0, 4);
  const dayEvents = selectedDay
    ? (expanded ? monthEvents : rollingEvents).filter((event) =>
        eventCoversDay(event, selectedDay),
      )
    : [];
  const loadingDay = !!selectedDay && (expanded ? isMonthPending : isPending);
  const sectionTitle = selectedDay
    ? [
        selectedDay.getDate(),
        selectedDay.getMonth() + 1,
        selectedDay.getFullYear(),
      ]
        .map((part) => String(part).padStart(2, '0'))
        .join('.')
    : t('calendar.upcoming');

  return (
    <TabScreen activeKey="calendar">
      <ScrollView
        bounces={false}
        overScrollMode="never"
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
          selectedDay={selectedDay}
          onSelectDay={(day) =>
            setSelectedDay((previous) =>
              previous?.getTime() === day.getTime() ? null : day,
            )
          }
          onMonthChange={(direction) => {
            setSelectedDay(null);
            setMonthOffset((value) => value + direction);
          }}
          onToggle={() => {
            setSelectedDay(null);
            setMonthOffset(0);
            setExpanded((value) => !value);
          }}
        />

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

        <ScreenSection
          title={sectionTitle}
          actionLabel={selectedDay ? t('calendar.backToUpcoming') : undefined}
          onAction={selectedDay ? () => setSelectedDay(null) : undefined}
        >
          <View style={styles.sectionList}>
            {(loadingDay || (isPending && !dayEvents.length)) && (
              <ActivityIndicator
                style={styles.loading}
                color={theme.colors.blueInk}
              />
            )}
            {!loadingDay && selectedDay && !dayEvents.length && !isError && (
              <Text style={styles.emptyHint}>{t('calendar.emptyDay')}</Text>
            )}
            {!loadingDay &&
              dayEvents.map((event) => (
                <FeaturedEventCard
                  key={event.id + ':' + event.startsAt.getTime()}
                  event={event}
                  onPress={() => openEvent(event)}
                />
              ))}
            {!loadingDay && !dayEvents.length && featured && (
              <>
                <FeaturedEventCard
                  event={featured}
                  onPress={() => openEvent(featured)}
                />
                {tiles.length > 0 && (
                  <View style={styles.upcomingGrid}>
                    {tiles.map((event) => (
                      <View
                        key={event.id + ':' + event.startsAt.getTime()}
                        style={styles.upcomingCell}
                      >
                        <EventTile
                          event={event}
                          onPress={() => openEvent(event)}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
            {!loadingDay &&
              !isPending &&
              !isError &&
              !featured &&
              !dayEvents.length && (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>
                    {t('calendar.emptyTitle')}
                  </Text>
                  <Text style={styles.emptyHint}>
                    {t('calendar.emptyHint')}
                  </Text>
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
          </View>
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
