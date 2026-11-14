import { useEffect } from 'react';

import { WS_URL } from '@shared/config';
import type { Bus, VehicleSnapshot } from '@entities/vehicle';

type VehiclesMessage = {
  event?: string;
  data?: unknown;
  serverTime?: unknown;
  history?: unknown;
};

function isSnapshot(value: unknown): value is VehicleSnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as Partial<VehicleSnapshot>;
  return (
    Number.isFinite(snapshot.serverTime) && Array.isArray(snapshot.vehicles)
  );
}

export const useBusesSocket = (
  onVehicles: (
    vehicles: Bus[],
    serverTime?: number,
    history?: VehicleSnapshot[],
  ) => void,
) => {
  useEffect(() => {
    let socket: WebSocket;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let delay = 1_000;
    function connect() {
      socket = new WebSocket(WS_URL);
      socket.onmessage = (event) => {
        if (typeof event.data !== 'string') return;
        let message: VehiclesMessage;
        try {
          message = JSON.parse(event.data) as VehiclesMessage;
        } catch {
          return;
        }
        if (message.event !== 'vehicles' || !Array.isArray(message.data))
          return;
        delay = 1_000;
        const history = Array.isArray(message.history)
          ? message.history.filter(isSnapshot)
          : undefined;
        onVehicles(
          message.data as Bus[],
          Number.isFinite(message.serverTime)
            ? (message.serverTime as number)
            : undefined,
          history && history.length > 0 ? history : undefined,
        );
      };
      socket.onclose = () => {
        retry = setTimeout(connect, delay);
        delay = Math.min(delay * 2, 30_000);
      };
    }
    connect();

    return () => {
      clearTimeout(retry);
      socket.onmessage = null;
      socket.onclose = null;
      socket.close();
    };
  }, [onVehicles]);
};
