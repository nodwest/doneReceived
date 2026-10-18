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

type DeadlineOption = { key: DeadlinePreset; label: string };

/** Чипы выбора срока, сгруппированные по строкам. */
export const deadlineRows: DeadlineOption[][] = [
  [
    { key: 'none', label: 'No deadline' },
    { key: 'in1h', label: '1 hour' },
    { key: 'in2h', label: '2 hours' },
  ],
  [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'custom', label: 'Custom' },
  ],
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

export function formatDeadline(deadline: Date, now = new Date()) {
  const time = deadline.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dayDiff = Math.round(
    (new Date(deadline).setHours(0, 0, 0, 0) -
      new Date(now).setHours(0, 0, 0, 0)) /
      (24 * HOUR_MS),
  );
  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  const date = deadline.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  return `${date}, ${time}`;
}
