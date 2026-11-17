import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionFamilyId, useSessionStore } from '@entities/session';
import type { Location } from '@entities/user';
import { useLocationSocket } from '../model/use-location-socket';
import { useLocationStore } from '../model/location-store';
import { familyLocationsKeys } from '../model/use-family-locations';
import {
  applyLocationPresence,
  presenceKeys,
  type LocationPresence,
} from '../model/use-location-presence';

/**
 * Один сокет геолокации на приложение — только приём live-событий. Ребёнок
 * пишет точку отдельной фоновой задачей через REST; карта и слои читают
 * события из общего store.
 */
export function LocationConnection() {
  const accessToken = useSessionStore(
    (state) => state.session?.accessToken ?? null,
  );
  const cachedFamilyId = useCurrentFamily()?.id ?? null;
  const sessionFamilyId = useSessionFamilyId();
  const familyId = cachedFamilyId ?? sessionFamilyId;
  const queryClient = useQueryClient();
  const setLocation = useLocationStore((state) => state.setLocation);
  const setAccess = useLocationStore((state) => state.setAccess);
  const reset = useLocationStore((state) => state.reset);
  // Семья приходит из кэша чуть позже первого рендера. Держим её в ref,
  // чтобы колбэки сокета не менялись на каждый рендер; соединение
  // открывается, как только семья известна.
  const familyIdRef = useRef(familyId);

  const onAccessChanged = useCallback(
    (userId: string, visible: boolean) => {
      setAccess(userId, visible);
      const currentFamilyId = familyIdRef.current;
      if (visible && currentFamilyId) {
        void queryClient.invalidateQueries({
          queryKey: familyLocationsKeys.list(currentFamilyId),
        });
      }
    },
    [queryClient, setAccess],
  );

  const onLocation = useCallback(
    (location: Location) => {
      setLocation(location);
      const currentFamilyId = familyIdRef.current;
      if (!location.childId || !currentFamilyId) return;
      queryClient.setQueryData<LocationPresence>(
        presenceKeys.list(currentFamilyId),
        (current) => applyLocationPresence(current, location),
      );
    },
    [queryClient, setLocation],
  );

  const onAuthenticated = useCallback(() => {
    reset();
    const currentFamilyId = familyIdRef.current;
    if (currentFamilyId) {
      // Старые REST-точки могли быть получены до смены приватности: убираем
      // их, чтобы карта не показала скрытого человека до нового ответа.
      queryClient.removeQueries({
        queryKey: familyLocationsKeys.list(currentFamilyId),
      });
    }
  }, [queryClient, reset]);

  useLocationSocket(onLocation, onAccessChanged, onAuthenticated, familyId);

  useEffect(() => {
    if (!accessToken) reset();
  }, [accessToken, reset]);

  useEffect(() => {
    // Первый ответ /families не должен стирать точки, пришедшие до него;
    // чистим store только при реальной смене семьи.
    const previous = familyIdRef.current;
    familyIdRef.current = familyId;
    if (previous && previous !== familyId) reset();
  }, [familyId, reset]);

  return null;
}
