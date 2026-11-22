import type { ReactNode } from 'react';
import { isAccessDenied, PrivateReadScope } from '@shared/api';
import { clearPrivateImageCache } from '@shared/ui';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
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
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.privateRead && isAccessDenied(error))
        query.setState({ data: undefined });
    },
  }),
  defaultOptions: { queries: { staleTime: FRESH_MS } },
});

listenAppFocus();

function privateScope(
  session: ReturnType<typeof useSessionStore.getState>['session'],
) {
  if (!session) return null;
  const { user } = session;
  return JSON.stringify([
    session.storageEpoch,
    user.id,
    user.kind ?? 'parent',
    user.family?.id,
    user.family?.role,
  ]);
}

// Сессия кончилась — вышли (Log out), сервер не принял refresh-токен или
// сменился аккаунт/семья: забываем приватные данные прошлого входа, чтобы
// следующий вошедший их не увидел. Обновление токенов кэш не сбрасывает.
useSessionStore.subscribe((state, prev) => {
  if (!prev.session) return;
  if (privateScope(state.session) !== privateScope(prev.session)) {
    queryClient.clear();
    clearPrivateImageCache();
  }
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
  const scope = useSessionStore((state) => privateScope(state.session));
  return (
    <QueryClientProvider client={queryClient}>
      <PrivateReadScope.Provider value={scope}>
        <AppEffects />
        <LocationConnection />
        <ChildLocationSharingSync />
        <PushNotificationsConnection />
        {children}
      </PrivateReadScope.Provider>
    </QueryClientProvider>
  );
}
