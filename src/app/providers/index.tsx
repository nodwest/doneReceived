import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@entities/session';

const queryClient = new QueryClient();

// Сессия кончилась — вышли (Log out) или сервер не принял refresh-токен:
// забываем данные прошлого аккаунта, чтобы следующий вошедший их не увидел.
// Обновление токенов сессию не обрывает, кэш при нём остаётся.
useSessionStore.subscribe((state, prev) => {
  if (prev.session && !state.session) queryClient.clear();
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
