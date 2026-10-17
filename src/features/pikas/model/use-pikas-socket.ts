import { useEffect } from 'react';

import { WS_URL } from '@shared/config';
import type { PikasVehicle } from '@entities/vehicle';

export const usePikasSocket = (
  onVehicles: (vehicles: PikasVehicle[]) => void,
) => {
  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('PIKAS WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event !== 'vehicles') {
        return;
      }

      onVehicles(message.data);
    };

    socket.onclose = () => {
      console.log('PIKAS WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('PIKAS WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [onVehicles]);
};
