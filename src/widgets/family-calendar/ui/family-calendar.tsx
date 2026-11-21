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
  formatDate,
  formatMonthYear,
  formatWeekdayShort,
  isSameDay,
  monthGrid,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { eventCoversDay, type FamilyEvent } from '@entities/family-event';
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
  selectedDay?: Date | null;
  onSelectDay?: (date: Date) => void;
  /** Сдвиг месяца на −1 / +1 в развернутом виде. */
  onMonthChange?: (direction: -1 | 1) => void;
};

type DayCellProps = {
  date: Date;
  today: Date;
  width: number;
  selected: boolean;
  onPress?: () => void;
  hasBlueEvent: boolean;
  hasOtherEvent: boolean;
  label: string;
};

function DayCell({
  date,
  today,
  width,
  selected,
  onPress,
  hasBlueEvent,
  hasOtherEvent,
  label,
}: DayCellProps) {
  const current = isSameDay(date, today);
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        styles.day,
        { width },
        current && styles.dayToday,
        selected && styles.daySelected,
      ]}
    >
      <Text
        style={[
          styles.dayWeekday,
          current && styles.dayWeekdayToday,
          selected && styles.daySelectedText,
        ]}
      >
        {formatWeekdayShort(date)}
      </Text>
      <Text
        style={[
          styles.dayNumber,
          current && styles.dayNumberToday,
          selected && styles.daySelectedText,
        ]}
      >
        {date.getDate()}
      </Text>
      {(hasBlueEvent || hasOtherEvent) && (
        <View
          style={[
            styles.dot,
            hasBlueEvent && styles.dotBlue,
            current && styles.dotToday,
            selected && styles.dotSelected,
          ]}
        />
      )}
    </Pressable>
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
  selectedDay,
  onSelectDay,
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
    (date: Date) => !!rangeEvent && eventCoversDay(rangeEvent, date),
    [rangeEvent],
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
          selected={!!selectedDay && isSameDay(item, selectedDay)}
          onPress={onSelectDay && (() => onSelectDay(item))}
          hasBlueEvent={inFeaturedRange(item)}
          hasOtherEvent={events.some(
            (event) => !event.featured && eventCoversDay(event, item),
          )}
          label={label}
        />
      );
    },
    [
      dayLabel,
      dayWidth,
      events,
      inFeaturedRange,
      t,
      today,
      selectedDay,
      onSelectDay,
    ],
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
              <Icon name="arrow-left" size={13} color={theme.colors.childInk} />
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
                color={theme.colors.childInk}
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
            <Icon name="chevron-down" size={14} color={theme.colors.childInk} />
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
                const selected = !!selectedDay && isSameDay(date, selectedDay);
                const outside =
                  date.getMonth() !== month.getMonth() ||
                  date.getFullYear() !== month.getFullYear();
                const inRange = !current && inFeaturedRange(date);
                const hasBlue = inFeaturedRange(date);
                const hasOther = events.some(
                  (event) => !event.featured && eventCoversDay(event, date),
                );
                return (
                  <Pressable
                    key={date.toISOString()}
                    accessibilityRole="button"
                    onPress={onSelectDay && (() => onSelectDay(date))}
                    accessible
                    accessibilityLabel={dayLabel(date)}
                    accessibilityState={{ selected }}
                    style={[
                      styles.monthDay,
                      inRange && styles.monthDayRange,
                      current && styles.monthDayToday,
                      selected && styles.daySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthNumber,
                        outside && styles.monthNumberOutside,
                        inRange && styles.monthNumberRange,
                        current && styles.monthNumberToday,
                        selected && styles.daySelectedText,
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
                          selected && styles.dotSelected,
                        ]}
                      />
                    )}
                  </Pressable>
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
