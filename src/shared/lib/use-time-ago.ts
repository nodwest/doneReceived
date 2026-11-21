import { formatTimeAgo } from './date';
import { useNow } from './use-now';

const MINUTE = 60_000;

/** «5 min ago» от ISO-времени; раз в минуту обновляется, пока экран открыт. */
export function useTimeAgo(iso: string | null) {
  const now = useNow(MINUTE);
  return iso ? formatTimeAgo(new Date(iso), now) : '';
}
