import { useEffect } from 'react';

import { Location } from '@shared/lib';
import { startLocationTracking } from '@shared/lib/geolocation/start-location-tracking';

export const useLocationSocket = (onLocation: (location: Location) => void) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    let stopLocationTracking = () => {};

    socket.onopen = () => {
      console.log('WebSocket connected');

      stopLocationTracking = startLocationTracking((lat, lng) => {
        if (socket.readyState !== WebSocket.OPEN) {
          return;
        }

        socket.send(
          JSON.stringify({
            event: 'location',
            data: {
              userId: 'user-1',
              lat,
              lng,
            },
          }),
        );
      });
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event !== 'location') return;

      const { userId, lat, lng } = message.data;

      onLocation({
        userId,
        lat,
        lng,
      });
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      stopLocationTracking();
      socket.close();
    };
  }, [onLocation]);
};
