import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { focusManager, type QueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@entities/session';
import { connectServerEvents, syncable, syncData } from '@shared/api';

/**
 * Данные моложе этого считаются свежими: переход туда-обратно между
 * экранами не гоняет одни и те же запросы.
 */
export const FRESH_MS = 5_000;

/**
 * Приложение вернулось из фона — React Query перечитывает устаревшие данные
 * открытых экранов и снова включает таймеры. В вебе он сам слушает
 * видимость вкладки, на телефоне ему нужен AppState.
 */
export function listenAppFocus() {
  if (Platform.OS === 'web') return;
  focusManager.setEventListener((setFocused) => {
    const subscription = AppState.addEventListener('change', (state) =>
      setFocused(state === 'active'),
    );
    return () => subscription.remove();
  });
}

/**
 * Перешли на другой экран (вкладка, назад, вглубь) — устаревшие данные
 * открытых экранов перечитываются в фоне: старые видны, пока не придут
 * новые. Первый показ экран загружает и так.
 */
export function useRefreshOnNavigate(queryClient: QueryClient) {
  const pathname = usePathname();
  const previous = useRef(pathname);
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    queryClient.refetchQueries({
      type: 'active',
      stale: true,
      predicate: syncable,
    });
  }, [pathname, queryClient]);
}

/**
 * Изменения с других устройств: пока кто-то вошёл, держим сокет событий
 * сервера. Событие сбрасывает задетые данные (`syncData`), после обрыва
 * связи перечитывается всё открытое — пропущенные события сервер не
 * досылает. Сменился аккаунт — сокет переоткрывается с его токеном.
 */
export function useServerEvents(queryClient: QueryClient) {
  const userId = useSessionStore((state) => state.session?.user.id ?? null);
  useEffect(() => {
    if (!userId) return;
    let disconnect: (() => void) | undefined;
    let openedBefore = false;
    const refresh = () =>
      void queryClient.invalidateQueries({ predicate: syncable });
    const updateConnection = (active: boolean) => {
      if (!active) {
        disconnect?.();
        disconnect = undefined;
        return;
      }
      if (disconnect) return;
      disconnect = connectServerEvents({
        onChange: (change) => void syncData(queryClient, change),
        onReconnect: refresh,
      });
      if (openedBefore) refresh();
      openedBefore = true;
    };

    if (Platform.OS === 'web') {
      const onVisibilityChange = () =>
        updateConnection(document.visibilityState === 'visible');
      document.addEventListener('visibilitychange', onVisibilityChange);
      onVisibilityChange();
      return () => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        disconnect?.();
      };
    }
    const subscription = AppState.addEventListener('change', (state) =>
      updateConnection(state === 'active'),
    );
    updateConnection(AppState.currentState === 'active');
    return () => {
      subscription.remove();
      disconnect?.();
    };
  }, [userId, queryClient]);
}
