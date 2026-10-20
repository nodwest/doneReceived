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

/** Обратный отсчёт: «02:14:36», от суток и больше — «1d 4h». */
export function formatCountdown(ms: number) {
  const left = Math.max(ms, 0);
  if (left >= DAY_MS) {
    return `${Math.floor(left / DAY_MS)}d ${Math.floor((left % DAY_MS) / HOUR_MS)}h`;
  }
  const seconds = Math.floor(left / 1000);
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
}

/** «5 min ago», «2 h ago», «3 d ago». */
export function formatTimeAgo(date: Date, now = new Date()) {
  const diff = Math.max(now.getTime() - date.getTime(), 0);
  if (diff < MINUTE_MS) return 'just now';
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)} min ago`;
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)} h ago`;
  return `${Math.floor(diff / DAY_MS)} d ago`;
}

/** «Today», «Tomorrow», «Yesterday» или «Oct 22». */
export function formatDayLabel(date: Date, now = new Date()) {
  const days = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Время по настройкам устройства: «6:00 PM» или «18:00». */
export const formatClock = (date: Date) =>
  date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

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
