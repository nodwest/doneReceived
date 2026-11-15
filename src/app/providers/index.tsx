import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@entities/session';
import {
  LocationConnection,
  useRegisterParentDevice,
} from '@features/location';
import { FRESH_MS, listenAppFocus, useRefreshOnNavigate } from './data-sync';

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
 * перечитывают устаревшее, изменения с других устройств пока приходят
 * таймером (`SYNC_POLL_MS`).
 */
function ParentDeviceRegistration() {
  useRegisterParentDevice();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  useRefreshOnNavigate(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <ParentDeviceRegistration />
      <LocationConnection />
      {children}
    </QueryClientProvider>
  );
}
