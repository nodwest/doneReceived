import { useEffect } from 'react';

import { WS_URL } from '@shared/config';
import type { Bus } from '@entities/vehicle';

export const useBusesSocket = (onVehicles: (vehicles: Bus[]) => void) => {
  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('BUSES WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event !== 'vehicles') {
        return;
      }

      onVehicles(message.data);
    };

    socket.onclose = ({ code }) => {
      if (code !== 1000) {
        console.warn('BUSES WebSocket disconnected:', WS_URL, code);
      }
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.close();
    };
  }, [onVehicles]);
};
