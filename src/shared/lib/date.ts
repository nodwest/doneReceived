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
