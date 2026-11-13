import { useEffect, useRef } from 'react';

import { useCurrentFamily, useFamilyChildren } from '@entities/family';
import { useSessionKind, useSessionStore } from '@entities/session';
import { LOCATION_WS_URL } from '@shared/config';
import { startLocationTracking } from '@shared/lib';
import type { Location } from '@entities/user';

/**
 * Сокет геолокации. Координаты отправляет только ребёнок — у родителя
 * геолокация даже не запрашивается, он лишь получает позиции детей. На карту
 * идут только события детей: без `childId` (прислал не ребёнок) и, когда
 * дети семьи уже загружены, чужие — отбрасываются. Координаты и токен не
 * логируем.
 */
export const useLocationSocket = (onLocation: (location: Location) => void) => {
  const accessToken = useSessionStore((state) => state.session?.accessToken);
  const kind = useSessionKind();
  const family = useCurrentFamily();
  const { data: children } = useFamilyChildren(
    kind === 'parent' ? (family?.id ?? null) : null,
  );
  // Список детей — в ref, чтобы его загрузка не переоткрывала сокет.
  const childIds = useRef<ReadonlySet<string> | null>(null);
  useEffect(() => {
    childIds.current = children ? new Set(children.map((c) => c.id)) : null;
  }, [children]);

  useEffect(() => {
    if (!accessToken) return;

    const socket = new WebSocket(LOCATION_WS_URL);

    let stopLocationTracking: (() => void) | undefined;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ event: 'authenticate', data: { accessToken } }),
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'authenticated' && message.data === true) {
        if (kind !== 'child') return;
        stopLocationTracking ??= startLocationTracking((lat, lng) => {
          if (socket.readyState !== WebSocket.OPEN) return;

          socket.send(
            JSON.stringify({ event: 'location', data: { lat, lng } }),
          );
        });
        return;
      }

      if (message.event !== 'location') return;

      const location = message.data as Location;
      if (!location.childId) return;
      if (childIds.current && !childIds.current.has(location.childId)) return;

      onLocation(location);
    };

    socket.onclose = ({ code }) => {
      stopLocationTracking?.();
      stopLocationTracking = undefined;
      if (code === 1006) {
        console.warn('Location WebSocket connection lost');
      }
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      stopLocationTracking?.();
      socket.close();
    };
  }, [accessToken, kind, onLocation]);
};
