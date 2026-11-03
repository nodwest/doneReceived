import { useCallback, useState } from 'react';
import { useNow } from '@shared/lib';

/**
 * Обратный отсчёт в секундах: `left` — сколько осталось (0 — можно снова),
 * `restart` — начать заново. Стартует сразу: письмо только что ушло.
 */
export function useCooldown(seconds: number) {
  const [until, setUntil] = useState(() => Date.now() + seconds * 1000);
  const now = useNow(1000).getTime();
  const left = Math.max(0, Math.ceil((until - now) / 1000));
  const restart = useCallback(
    () => setUntil(Date.now() + seconds * 1000),
    [seconds],
  );
  return { left, restart };
}
