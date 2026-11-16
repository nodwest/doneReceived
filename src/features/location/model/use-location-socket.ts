import { useEffect, useRef } from 'react';

import { useSessionStore } from '@entities/session';
import { LOCATION_WS_URL } from '@shared/config';
import { i18n } from '@shared/i18n';
import { deviceLabel, showToast, startLocationTracking } from '@shared/lib';
import type { Location } from '@entities/user';

/**
 * Сокет геолокации. Координаты отправляет каждый активный член семьи со
 * своего отслеживаемого устройства; события получают те, кому разрешено
 * видеть отправителя. Координаты и токен не логируем.
 */
export const useLocationSocket = (
  onLocation: (location: Location) => void,
  onAccessChanged?: (userId: string, visible: boolean) => void,
  onAuthenticated?: () => void,
  familyId?: string | null,
) => {
  const accessToken = useSessionStore((state) => state.session?.accessToken);
  const locationErrorShown = useRef(false);

  useEffect(() => {
    if (!accessToken || !familyId) return;
    locationErrorShown.current = false;

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
        // Новое соединение: накопленные live-точки могли устареть, а события
        // приватности за время обрыва не приходили. Очищаем store и
        // перечитываем последние точки через REST.
        onAuthenticated?.();
        stopLocationTracking ??= startLocationTracking(
          (lat, lng, accuracy) => {
            if (socket.readyState !== WebSocket.OPEN) return;

            socket.send(
              JSON.stringify({
                event: 'location',
                data: { lat, lng, accuracy, deviceLabel: deviceLabel() },
              }),
            );
          },
          () => {
            // Браузер не дал координаты: без этого родитель не понимает,
            // почему его метка не появляется у семьи.
            if (locationErrorShown.current) return;
            locationErrorShown.current = true;
            showToast(i18n.t('map.locationUnavailable'));
          },
        );
        return;
      }

      if (message.event === 'location-access') {
        const data = message.data as { userId?: unknown; visible?: unknown };
        if (
          typeof data?.userId === 'string' &&
          typeof data.visible === 'boolean'
        ) {
          onAccessChanged?.(data.userId, data.visible);
        }
        return;
      }

      if (message.event !== 'location') return;

      const location = message.data as Location;
      if (!location.userId) return;
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
  }, [accessToken, familyId, onAccessChanged, onAuthenticated, onLocation]);
};
