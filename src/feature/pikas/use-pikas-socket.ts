import { PikasVehicle } from '@shared/lib';
import { useEffect } from 'react';

export const usePikasSocket = (
  onVehicles: (vehicles: PikasVehicle[]) => void,
) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

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
