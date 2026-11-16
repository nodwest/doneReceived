import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@entities/session';
import {
  FRESH_MS,
  listenAppFocus,
  useRefreshOnNavigate,
  useServerEvents,
} from './data-sync';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: FRESH_MS } },
});

listenAppFocus();

// Сессия кончилась — вышли (Log out) или сервер не принял refresh-токен:
// забываем данные прошлого аккаунта, чтобы следующий вошедший их не увидел.
// Обновление токенов сессию не обрывает, кэш при нём остаётся.
useSessionStore.subscribe((state, prev) => {
  if (prev.session && !state.session) queryClient.clear();
});

/**
 * Данные актуальны так: свои изменения сбрасывают всё связанное
 * (`syncData` в мутациях), переход между экранами и возврат из фона
 * перечитывают устаревшее, изменения с других устройств приходят
 * событиями сервера по WebSocket (`useServerEvents`).
 */
export function Providers({ children }: { children: ReactNode }) {
  useRefreshOnNavigate(queryClient);
  useServerEvents(queryClient);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
