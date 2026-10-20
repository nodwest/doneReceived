import { useEffect, useState } from 'react';

/** Текущее время, которое обновляется с заданным шагом (для таймеров). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
