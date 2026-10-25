import { i18n } from '../i18n';

/** Язык интерфейса для `toLocale*`: даты и время на том же языке, что и текст. */
const locale = () => i18n.language;

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

export const clampDate = (date: Date, min: Date, max: Date) =>
  date < min ? min : date > max ? max : date;

/** Округляет вверх до целой минуты. */
export function ceilToMinute(date: Date) {
  const result = new Date(date);
  if (result.getSeconds() || result.getMilliseconds()) {
    result.setMinutes(result.getMinutes() + 1);
  }
  result.setSeconds(0, 0);
  return result;
}

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const pad = (value: number) => String(value).padStart(2, '0');

/** Обратный отсчёт: «02:14:36», от суток и больше — «1d 4h» / «1 д 4 ч». */
export function formatCountdown(ms: number) {
  const left = Math.max(ms, 0);
  if (left >= DAY_MS) {
    return i18n.t('time.countdownDays', {
      days: Math.floor(left / DAY_MS),
      hours: Math.floor((left % DAY_MS) / HOUR_MS),
    });
  }
  const seconds = Math.floor(left / 1000);
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
}

/** «5 min ago», «2 h ago», «3 d ago» на языке интерфейса. */
export function formatTimeAgo(date: Date, now = new Date()) {
  const diff = Math.max(now.getTime() - date.getTime(), 0);
  if (diff < MINUTE_MS) return i18n.t('time.justNow');
  if (diff < HOUR_MS) {
    return i18n.t('time.minutesAgo', { count: Math.floor(diff / MINUTE_MS) });
  }
  if (diff < DAY_MS) {
    return i18n.t('time.hoursAgo', { count: Math.floor(diff / HOUR_MS) });
  }
  return i18n.t('time.daysAgo', { count: Math.floor(diff / DAY_MS) });
}

const dayOffset = (date: Date, now: Date) =>
  Math.round((startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS);

/** «Today», «Tomorrow», «Yesterday» или «Oct 22». */
export function formatDayLabel(date: Date, now = new Date()) {
  const days = dayOffset(date, now);
  if (days === 0) return i18n.t('time.today');
  if (days === 1) return i18n.t('time.tomorrow');
  if (days === -1) return i18n.t('time.yesterday');
  return formatMonthDay(date);
}

/** Как formatDayLabel, но внутри фразы: «Created today», а не «Created Today». */
export function formatDayInPhrase(date: Date, now = new Date()) {
  const days = dayOffset(date, now);
  if (days === 0) return i18n.t('time.todayInPhrase');
  if (days === 1) return i18n.t('time.tomorrowInPhrase');
  if (days === -1) return i18n.t('time.yesterdayInPhrase');
  return formatMonthDay(date);
}

/** «Oct 15» / «15 окт.». */
export const formatMonthDay = (date: Date) =>
  date.toLocaleDateString(locale(), { month: 'short', day: 'numeric' });

/** «Sun». */
export const formatWeekdayShort = (date: Date) =>
  date.toLocaleDateString(locale(), { weekday: 'short' });

/** «Oct». */
export const formatMonthShort = (date: Date) =>
  date.toLocaleDateString(locale(), { month: 'short' });

/** Полночь дня date + days (отрицательное — назад) по местному времени. */
export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** Время на языке интерфейса: «6:00 PM» или «18:00». */
export const formatClock = (date: Date) =>
  date.toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' });

/** «Sun, Oct 22» с временем или без — для пикера и сводок. */
export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  date.toLocaleString(locale(), options);

/** 24-часовой формат по региональным настройкам устройства. */
export function is24HourClock() {
  try {
    const { hour12, hourCycle } = new Intl.DateTimeFormat([], {
      hour: 'numeric',
    }).resolvedOptions();
    if (typeof hour12 === 'boolean') return !hour12;
    return hourCycle === 'h23' || hourCycle === 'h24';
  } catch {
    return true;
  }
}
