import { useEffect } from 'react';

import { WS_URL } from '@shared/config';
import type { BusesVehicle } from '@entities/vehicle';

export const useBusesSocket = (
  onVehicles: (vehicles: BusesVehicle[]) => void,
) => {
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

    socket.onclose = () => {
      console.log('BUSES WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('BUSES WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [onVehicles]);
};
