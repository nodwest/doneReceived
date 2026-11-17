import { useCallback, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItem,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import {
  addDays,
  endOfDay,
  formatDate,
  formatMonthYear,
  formatWeekdayShort,
  isSameDay,
  monthGrid,
  startOfDay,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { FamilyEvent } from '@entities/family-event';
import { DAY_GAP, styles } from './family-calendar.styled';

/** Сколько дней назад и вперёд можно листать неделю. */
const PAST_DAYS = 30;
const FUTURE_DAYS = 60;
const MONTH_CELLS = 42;

type FamilyCalendarProps = {
  today: Date;
  events: FamilyEvent[];
  expanded: boolean;
  onToggle: () => void;
  /** Месяц, открытый в развернутом виде; по умолчанию текущий. */
  month?: Date;
  /** Сдвиг месяца на −1 / +1 в развернутом виде. */
  onMonthChange?: (direction: -1 | 1) => void;
};

type DayCellProps = {
  date: Date;
  today: Date;
  width: number;
  hasBlueEvent: boolean;
  hasOtherEvent: boolean;
  label: string;
};

function DayCell({
  date,
  today,
  width,
  hasBlueEvent,
  hasOtherEvent,
  label,
}: DayCellProps) {
  const current = isSameDay(date, today);
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityState={{ selected: current }}
      style={[styles.day, { width }, current && styles.dayToday]}
    >
      <Text style={[styles.dayWeekday, current && styles.dayWeekdayToday]}>
        {formatWeekdayShort(date)}
      </Text>
      <Text style={[styles.dayNumber, current && styles.dayNumberToday]}>
        {date.getDate()}
      </Text>
      {(hasBlueEvent || hasOtherEvent) && (
        <View
          style={[
            styles.dot,
            hasBlueEvent && styles.dotBlue,
            current && styles.dotToday,
          ]}
        />
      )}
    </View>
  );
}

/**
 * Календарь семьи: свернутый — неделя, где сегодня всегда крайний левый
 * день, развернутый — месяц. Дни с событиями помечены точками, главное
 * событие — синим, остальные — янтарным.
 */
export function FamilyCalendar({
  today,
  events,
  expanded,
  onToggle,
  month = today,
  onMonthChange,
}: FamilyCalendarProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  // Семь дней должны помещаться целиком даже на 320pt; восьмой чуть выглядывает.
  const dayWidth = useMemo(() => {
    const contentWidth = Math.min(width, 480) - 52;
    return Math.max(33, Math.floor((contentWidth - DAY_GAP * 6 - 12) / 7));
  }, [width]);
  const dayStep = dayWidth + DAY_GAP;

  const rangeEvent = useMemo(
    () => events.find((event) => event.featured),
    [events],
  );

  const weekDays = useMemo(
    () =>
      Array.from({ length: PAST_DAYS + FUTURE_DAYS + 1 }, (_, index) =>
        addDays(today, index - PAST_DAYS),
      ),
    [today],
  );

  const monthCells = useMemo(() => {
    const grid = monthGrid(month);
    return Array.from({ length: MONTH_CELLS }, (_, index) =>
      addDays(grid.start, index),
    );
  }, [month]);

  const monthWeekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        formatWeekdayShort(addDays(monthCells[0], index)),
      ),
    [monthCells],
  );

  const monthRows = useMemo(
    () =>
      Array.from({ length: MONTH_CELLS / 7 }, (_, row) =>
        monthCells.slice(row * 7, row * 7 + 7),
      ),
    [monthCells],
  );

  const inFeaturedRange = useCallback(
    (date: Date) =>
      !!rangeEvent &&
      date >= startOfDay(rangeEvent.startsAt) &&
      date <= endOfDay(rangeEvent.endsAt),
    [rangeEvent],
  );

  const coversDay = useCallback(
    (event: FamilyEvent, date: Date) =>
      date >= startOfDay(event.startsAt) && date <= endOfDay(event.endsAt),
    [],
  );

  const dayLabel = useCallback(
    (date: Date) =>
      formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    [],
  );

  const renderWeekDay = useCallback<ListRenderItem<Date>>(
    ({ item }) => {
      const label = isSameDay(item, today)
        ? `${dayLabel(item)}, ${t('time.today')}`
        : dayLabel(item);
      return (
        <DayCell
          date={item}
          today={today}
          width={dayWidth}
          hasBlueEvent={inFeaturedRange(item)}
          hasOtherEvent={events.some(
            (event) => !event.featured && coversDay(event, item),
          )}
          label={label}
        />
      );
    },
    [dayLabel, dayWidth, events, inFeaturedRange, coversDay, t, today],
  );

  const keyExtractor = useCallback((date: Date) => date.toISOString(), []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.monthNav}>
          {expanded && onMonthChange && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('calendar.previousMonth')}
              hitSlop={8}
              onPress={() => onMonthChange(-1)}
              style={styles.monthArrow}
            >
              <Icon
                name="arrow-left"
                size={13}
                color={theme.colors.childDeep}
              />
            </Pressable>
          )}
          <Text style={styles.month} numberOfLines={1}>
            {formatMonthYear(expanded ? month : today)}
          </Text>
          {expanded && onMonthChange && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('calendar.nextMonth')}
              hitSlop={8}
              onPress={() => onMonthChange(1)}
              style={styles.monthArrow}
            >
              <Icon
                name="arrow-right"
                size={13}
                color={theme.colors.childDeep}
              />
            </Pressable>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            expanded ? t('calendar.collapse') : t('calendar.expand')
          }
          accessibilityState={{ expanded }}
          hitSlop={10}
          onPress={onToggle}
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>
            {expanded ? t('calendar.collapse') : t('calendar.expand')}
          </Text>
          <View style={expanded ? styles.chevronUp : undefined}>
            <Icon
              name="chevron-down"
              size={14}
              color={theme.colors.childDeep}
            />
          </View>
        </Pressable>
      </View>

      {expanded ? (
        <View style={styles.monthGrid}>
          <View style={styles.weekdays}>
            {monthWeekdays.map((weekday) => (
              <Text key={weekday} style={styles.weekday}>
                {weekday}
              </Text>
            ))}
          </View>
          {monthRows.map((row) => (
            <View key={row[0].toISOString()} style={styles.monthRow}>
              {row.map((date) => {
                const current = isSameDay(date, today);
                const outside =
                  date.getMonth() !== month.getMonth() ||
                  date.getFullYear() !== month.getFullYear();
                const inRange = !current && inFeaturedRange(date);
                const hasBlue = inFeaturedRange(date);
                const hasOther = events.some(
                  (event) => !event.featured && coversDay(event, date),
                );
                return (
                  <View
                    key={date.toISOString()}
                    accessible
                    accessibilityLabel={dayLabel(date)}
                    accessibilityState={{ selected: current }}
                    style={[
                      styles.monthDay,
                      inRange && styles.monthDayRange,
                      current && styles.monthDayToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthNumber,
                        outside && styles.monthNumberOutside,
                        inRange && styles.monthNumberRange,
                        current && styles.monthNumberToday,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                    {(hasBlue || hasOther) && (
                      <View
                        style={[
                          styles.monthDot,
                          hasBlue && styles.monthDotBlue,
                          current && styles.monthDotToday,
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      ) : (
        <>
          <FlatList
            horizontal
            data={weekDays}
            keyExtractor={keyExtractor}
            renderItem={renderWeekDay}
            getItemLayout={(_, index) => ({
              length: dayStep,
              offset: dayStep * index,
              index,
            })}
            initialScrollIndex={PAST_DAYS}
            initialNumToRender={14}
            maxToRenderPerBatch={14}
            windowSize={7}
            showsHorizontalScrollIndicator={false}
            style={styles.weekList}
            contentContainerStyle={[
              styles.weekContent,
              { paddingRight: dayWidth },
            ]}
          />
          <View style={styles.weekCaption}>
            <Text style={styles.weekCaptionToday}>
              {t('calendar.today', {
                date: formatDate(today, {
                  day: 'numeric',
                  month: 'long',
                }),
              })}
            </Text>
            <Text style={styles.weekCaptionHint}>
              {t('calendar.nextSevenDays')}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
