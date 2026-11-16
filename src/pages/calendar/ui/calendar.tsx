import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { EventRow, EventTile, FeaturedEventCard } from '@entities/family-event';
import { useViewerRole } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { RoundButton, ScreenSection } from '@shared/ui';
import { TabScreen } from '@widgets/bottom-nav';
import { FamilyCalendar } from '@widgets/family-calendar';
import { useCalendarDemo } from '../model/use-calendar-demo';
import { styles } from './calendar.styled';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Вкладка Calendar: свернутая неделя, фото события выходных и ближайшие
 * события. Плюс и «Все» показывают тост: экраны создания и списка событий
 * появятся вместе с серверным календарём.
 */
export function CalendarPage() {
  const { t } = useTranslation();
  const viewer = useViewerRole();
  const [expanded, setExpanded] = useState(false);
  const {
    today,
    events,
    featured,
    upcoming,
    cinemaMeta,
    doctorMeta,
    meetingMeta,
    homeworkMeta,
    cinemaDay,
    doctorDay,
    meetingWeekday,
    meetingDay,
    homeworkWeekday,
    homeworkDay,
  } = useCalendarDemo();

  const cinema = upcoming.find((event) => event.kind === 'cinema');
  const doctor = upcoming.find((event) => event.kind === 'doctor');
  const meeting = upcoming.find((event) => event.kind === 'meeting');
  const homework = upcoming.find((event) => event.kind === 'homework');
  const isParent = viewer !== 'child';
  const showCreate = isParent;

  return (
    <TabScreen activeKey="calendar" activeColor={theme.colors.blue}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('calendar.title')}
          </Text>
          {showCreate && (
            <RoundButton
              icon="plus"
              tone="primary"
              accessibilityLabel={t('calendar.add')}
              onPress={() => showToast(t('calendar.createSoon'))}
            />
          )}
        </View>

        <FamilyCalendar
          today={today}
          events={events}
          expanded={expanded}
          onToggle={() => setExpanded((value) => !value)}
        />

        <FeaturedEventCard event={featured} />

        <ScreenSection
          title={t('calendar.upcoming')}
          actionLabel={t('common.seeAll')}
          actionColor={theme.colors.blue}
          onAction={() => showToast(t('calendar.allSoon'))}
        >
          <View style={styles.sectionList}>
            {(cinema || doctor) && (
              <View style={styles.upcomingRow}>
                {cinema && (
                  <EventTile
                    icon="star"
                    tone="blue"
                    dayLabel={capitalize(cinemaDay)}
                    title={cinema.title}
                    meta={cinemaMeta}
                  />
                )}
                {doctor && (
                  <EventTile
                    icon="bell"
                    tone="amber"
                    dayLabel={doctorDay}
                    title={doctor.title}
                    meta={doctorMeta}
                  />
                )}
              </View>
            )}
            {isParent && meeting && (
              <EventRow
                weekday={meetingWeekday.toUpperCase()}
                day={meetingDay}
                title={meeting.title}
                meta={meetingMeta}
                tag={t('calendar.remindTag')}
              />
            )}
            {homework && (
              <EventRow
                weekday={homeworkWeekday.toUpperCase()}
                day={homeworkDay}
                title={homework.title}
                meta={homeworkMeta}
                tag={t('calendar.demo.homeworkTag')}
              />
            )}
          </View>
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
