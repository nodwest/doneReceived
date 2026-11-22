import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentFamily } from '@entities/family';
import {
  EventTile,
  eventCoversDay,
  FeaturedEventCard,
  type FamilyEvent,
} from '@entities/family-event';
import { useViewerRole } from '@entities/user';
import { useFamilyEvents } from '@features/family-event';
import { apiErrorCode, isApiError, usePrivateReadScope } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { theme, useTheme } from '@shared/theme';
import { RoundButton, ScreenSection } from '@shared/ui';
import { TabScreen } from '@widgets/bottom-nav';
import { FamilyCalendar } from '@widgets/family-calendar';
import { CalendarManagement } from './calendar-management';
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
  const family = useCurrentFamily();
  const scope = usePrivateReadScope();
  const [managementScope, setManagementScope] = useState<string | null>(null);
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
    rollingError,
    monthError,
    refetchRolling,
    refetchMonth,
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
  const canManage =
    isParent &&
    !!scope &&
    !!family &&
    (family.role === 'owner' || family.role === 'admin');
  const activeManagementScope = canManage ? `${scope}:${family.id}` : null;
  const sectionError = selectedDay && expanded ? monthError : rollingError;
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

  const calendarErrors = [
    {
      key: 'rolling',
      title: t('calendar.upcoming'),
      error: rollingError,
      retry: refetchRolling,
    },
    {
      key: 'month',
      title: t('calendar.monthView'),
      error: monthError,
      retry: refetchMonth,
    },
  ];

  if (
    activeManagementScope &&
    managementScope === activeManagementScope &&
    family &&
    scope
  ) {
    return (
      <TabScreen activeKey="calendar">
        <ScrollView
          key="manage-events"
          style={styles.scroll}
          contentContainerStyle={styles.body}
        >
          <CalendarManagement
            key={activeManagementScope}
            familyId={family.id}
            scope={scope}
            onClose={() => setManagementScope(null)}
          />
        </ScrollView>
      </TabScreen>
    );
  }

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

        {activeManagementScope && (
          <Pressable
            accessibilityRole="button"
            style={styles.linkButton}
            onPress={() => setManagementScope(activeManagementScope)}
          >
            <Text style={styles.emptyAction}>{t('calendar.manage')}</Text>
          </Pressable>
        )}

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

        {calendarErrors.map(({ key, title, error, retry }) => {
          if (!error) return null;
          const overflow =
            isApiError(error) &&
            apiErrorCode(error) === 'CALENDAR_TOO_MANY_EVENTS';
          return (
            <View key={key} style={styles.errorCard}>
              <Text style={styles.errorTitle}>{title}</Text>
              <Text accessibilityRole="alert" style={styles.errorTitle}>
                {overflow
                  ? t(
                      activeManagementScope
                        ? 'calendar.overflowManage'
                        : 'calendar.overflowAskParent',
                    )
                  : t('calendar.refreshError')}
              </Text>
              {(!overflow || activeManagementScope) && (
                <Pressable
                  accessibilityRole="button"
                  style={styles.linkButton}
                  onPress={() =>
                    overflow
                      ? setManagementScope(activeManagementScope)
                      : void retry()
                  }
                >
                  <Text style={styles.errorLink}>
                    {t(overflow ? 'calendar.manage' : 'calendar.retry')}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}

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
            {!loadingDay &&
              selectedDay &&
              !dayEvents.length &&
              !sectionError && (
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
            {!selectedDay && !isPending && featured && (
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
            {!selectedDay &&
              !isPending &&
              !sectionError &&
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
