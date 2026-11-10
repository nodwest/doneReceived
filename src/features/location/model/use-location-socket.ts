import { useEffect } from 'react';

import { useSessionStore } from '@entities/session';
import { LOCATION_WS_URL } from '@shared/config';
import { startLocationTracking } from '@shared/lib';
import type { Location } from '@entities/user';

export const useLocationSocket = (onLocation: (location: Location) => void) => {
  const accessToken = useSessionStore((state) => state.session?.accessToken);

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
        stopLocationTracking ??= startLocationTracking((lat, lng) => {
          if (socket.readyState !== WebSocket.OPEN) return;

          socket.send(
            JSON.stringify({ event: 'location', data: { lat, lng } }),
          );
        });
        return;
      }

      if (message.event !== 'location') return;

      const { userId, lat, lng } = message.data;

      onLocation({
        userId,
        lat,
        lng,
      });
    };

    socket.onclose = ({ code }) => {
      stopLocationTracking?.();
      stopLocationTracking = undefined;
      if (code === 1006) {
        console.warn('Location WebSocket connection lost:', LOCATION_WS_URL);
      }
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      stopLocationTracking?.();
      socket.close();
    };
  }, [accessToken, onLocation]);
};
