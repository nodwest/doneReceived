import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@entities/session';
import {
  FRESH_MS,
  listenAppFocus,
  useRefreshOnNavigate,
  useServerEvents,
} from './data-sync';
import {
  ChildLocationSharingSync,
  LocationConnection,
  useRegisterParentDevice,
} from '@features/location';
import { PushNotificationsConnection } from '@features/push-notifications';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: FRESH_MS } },
});

listenAppFocus();

// Сессия кончилась — вышли (Log out), сервер не принял refresh-токен или
// сменился аккаунт/семья: забываем приватные данные прошлого входа, чтобы
// следующий вошедший их не увидел. Обновление токенов кэш не сбрасывает.
useSessionStore.subscribe((state, prev) => {
  if (!prev.session) return;
  const identityChanged =
    !state.session ||
    state.session.user.id !== prev.session.user.id ||
    state.session.user.family?.id !== prev.session.user.family?.id;
  if (identityChanged) queryClient.clear();
});

/**
 * Данные актуальны так: свои изменения сбрасывают всё связанное
 * (`syncData` в мутациях), переход между экранами и возврат из фона
 * перечитывают устаревшее, изменения с других устройств приходят по WebSocket.
 */
function AppEffects() {
  useRefreshOnNavigate(queryClient);
  useServerEvents(queryClient);
  useRegisterParentDevice();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppEffects />
      <LocationConnection />
      <ChildLocationSharingSync />
      <PushNotificationsConnection />
      {children}
    </QueryClientProvider>
  );
}
