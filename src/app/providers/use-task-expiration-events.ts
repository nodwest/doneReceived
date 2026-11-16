import { useEffect } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionFamilyId, useSessionStore } from '@entities/session';
import { syncData } from '@shared/api';
import { EVENTS_WS_URL } from '@shared/config';

export function useTaskExpirationEvents(queryClient: QueryClient) {
  const accessToken = useSessionStore((state) => state.session?.accessToken);
  const currentFamily = useCurrentFamily();
  const sessionFamilyId = useSessionFamilyId();
  const familyId = currentFamily?.id ?? sessionFamilyId;

  useEffect(() => {
    if (!accessToken || !familyId) return;

    let socket: WebSocket | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let refresh: ReturnType<typeof setTimeout> | undefined;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let delay = 1_000;

    const scheduleRefresh = () => {
      if (refresh !== undefined) return;
      refresh = setTimeout(() => {
        refresh = undefined;
        if (useSessionStore.getState().session?.accessToken === accessToken) {
          void syncData(queryClient, 'task-expired');
        }
      }, 250);
    };

    function connect() {
      if (useSessionStore.getState().session?.accessToken !== accessToken)
        return;
      let connection: WebSocket;
      try {
        connection = new WebSocket(EVENTS_WS_URL);
      } catch {
        return;
      }
      socket = connection;
      let authenticated = false;
      connection.onopen = () => {
        if (useSessionStore.getState().session?.accessToken !== accessToken) {
          connection.close();
          return;
        }
        connection.send(
          JSON.stringify({ event: 'authenticate', data: { accessToken } }),
        );
      };
      connection.onmessage = ({ data }) => {
        if (typeof data !== 'string' || data.length > 4096) return;
        let frame: {
          event?: string;
          data?: { type?: string; familyId?: string } | boolean;
        } | null;
        try {
          frame = JSON.parse(data);
        } catch {
          return;
        }
        if (frame?.event === 'authenticated' && frame.data === true) {
          authenticated = true;
          delay = 1_000;
          scheduleRefresh();
          clearInterval(heartbeat);
          heartbeat = setInterval(() => {
            if (connection.readyState === WebSocket.OPEN) {
              connection.send(JSON.stringify({ event: 'ping' }));
            }
          }, 20_000);
        } else if (
          authenticated &&
          frame?.event === 'change' &&
          typeof frame.data === 'object' &&
          frame.data?.type === 'task_expired' &&
          frame.data.familyId === familyId
        ) {
          scheduleRefresh();
        }
      };
      connection.onclose = ({ code }) => {
        clearInterval(heartbeat);
        if (code === 4401 || code === 4403 || code === 1008) return;
        retry = setTimeout(connect, delay + Math.random() * 500);
        delay = Math.min(delay * 2, 30_000);
      };
    }

    connect();
    return () => {
      clearTimeout(retry);
      clearTimeout(refresh);
      clearInterval(heartbeat);
      if (!socket) return;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.close();
    };
  }, [accessToken, familyId, queryClient]);
}
