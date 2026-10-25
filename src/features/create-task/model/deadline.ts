import { i18n } from '@shared/i18n';
import { formatClock, formatDayLabel } from '@shared/lib';

export type DeadlinePreset =
  | 'none'
  | 'in1h'
  | 'in2h'
  | 'today'
  | 'tomorrow'
  | 'custom';

export type DeadlineChoice = {
  preset: DeadlinePreset;
  /** ISO-время для пресета `custom`. */
  customAt: string | null;
};

export const MIN_DEADLINE_MS = 60_000;
const HOUR_MS = 60 * 60 * 1000;

/** Чипы выбора срока, сгруппированные по строкам; подписи — createTask.deadline.*. */
export const deadlineRows: DeadlinePreset[][] = [
  ['none', 'in1h', 'in2h'],
  ['today', 'tomorrow', 'custom'],
];

export const initialDeadline: DeadlineChoice = {
  preset: 'none',
  customAt: null,
};

const endOfDay = (now: Date, addDays: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + addDays);
  date.setHours(23, 59, 0, 0);
  return date;
};

/** Относительные пресеты считаются в момент отправки, а не выбора. */
export function resolveDeadline(
  { preset, customAt }: DeadlineChoice,
  now = new Date(),
): Date | null {
  switch (preset) {
    case 'in1h':
      return new Date(now.getTime() + HOUR_MS);
    case 'in2h':
      return new Date(now.getTime() + 2 * HOUR_MS);
    case 'today':
      return endOfDay(now, 0);
    case 'tomorrow':
      return endOfDay(now, 1);
    case 'custom':
      return customAt ? new Date(customAt) : null;
    default:
      return null;
  }
}

export function isDeadlineValid(choice: DeadlineChoice, now = new Date()) {
  if (choice.preset === 'none') return true;
  const deadline = resolveDeadline(choice, now);
  return (
    deadline !== null && deadline.getTime() - now.getTime() >= MIN_DEADLINE_MS
  );
}

/** «Today, 18:00» / «Сегодня, 18:00» или «Oct 22, 18:00». */
export function formatDeadline(deadline: Date, now = new Date()) {
  return i18n.t('time.dayAndTime', {
    day: formatDayLabel(deadline, now),
    time: formatClock(deadline),
  });
}
