import { useEffect, useRef } from 'react';

import { useFamilyChildren } from '@entities/family';
import { useSessionKind, useSessionStore } from '@entities/session';
import {
  currentAccessToken,
  openPrivateWebSocket,
  refreshAccessToken,
} from '@shared/api';
import { LOCATION_WS_URL } from '@shared/config';
import type { Location } from '@entities/user';

const RECONNECT_MS = [1_000, 2_000, 5_000, 10_000, 30_000];
const CLOSE_TOKEN_EXPIRED = 4401;
/** Старый сервер также использует этот код при истечении токена. */
const CLOSE_POLICY_VIOLATION = 1008;

type Message = { event?: unknown; data?: unknown };

const parse = (raw: unknown): Message | null => {
  if (typeof raw !== 'string') return null;
  try {
    const message: unknown = JSON.parse(raw);
    return message && typeof message === 'object' ? message : null;
  } catch {
    return null;
  }
};

/**
 * Сокет геолокации только для приёма. Координаты ребёнок отправляет через
 * POST в фоновой задаче; этот сокет нужен родителю и карте для live-событий.
 * События без childId, чужих детей и от скрытых участников не принимаем.
 */
export const useLocationSocket = (
  onLocation: (location: Location) => void,
  onAccessChanged?: (userId: string, visible: boolean) => void,
  onAuthenticated?: () => void,
  familyId?: string | null,
) => {
  const accessToken = useSessionStore((state) => state.session?.accessToken);
  const kind = useSessionKind();
  const myUserId = useSessionStore((state) => state.session?.user.id ?? null);
  const myChildId = useSessionStore((state) => state.session?.childId ?? null);
  const { data: children } = useFamilyChildren(
    kind === 'parent' ? (familyId ?? null) : null,
  );
  // Список детей — в ref, чтобы его загрузка не переоткрывала сокет.
  const childIds = useRef<ReadonlySet<string> | null>(null);

  useEffect(() => {
    childIds.current = children
      ? new Set(children.map((child) => child.id))
      : null;
  }, [children]);

  useEffect(() => {
    if (!accessToken || !familyId) return;

    let stopped = false;
    let attempt = 0;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleReconnect = () => {
      if (stopped) return;
      const delay = RECONNECT_MS[Math.min(attempt, RECONNECT_MS.length - 1)];
      attempt += 1;
      reconnectTimer = setTimeout(connect, delay);
    };

    function connect() {
      if (stopped) return;
      const token = currentAccessToken();
      if (!token) return;

      const ws = openPrivateWebSocket(LOCATION_WS_URL);
      socket = ws;
      let authenticated = false;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            event: 'authenticate',
            data: { accessToken: token },
          }),
        );
      };

      ws.onmessage = (event) => {
        const message = parse(event.data);
        if (!message) return;

        if (message.event === 'authenticated') {
          if (message.data !== true) return;
          authenticated = true;
          attempt = 0;
          onAuthenticated?.();
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
        if (!location?.userId || !location.childId) return;
        if (
          kind === 'child' &&
          location.userId !== myUserId &&
          location.childId !== myChildId
        )
          return;
        if (
          kind === 'parent' &&
          childIds.current &&
          !childIds.current.has(location.childId)
        )
          return;
        onLocation(location);
      };

      ws.onclose = async ({ code, reason }) => {
        socket = null;
        if (stopped) return;
        if (__DEV__) {
          console.info(
            '[location:ws] закрыт',
            code,
            authenticated ? 'после входа' : 'до входа',
            reason,
          );
        }
        if (
          code === CLOSE_TOKEN_EXPIRED ||
          (code === CLOSE_POLICY_VIOLATION && authenticated)
        ) {
          await refreshAccessToken(token).catch(() => null);
          if (stopped) return;
        }
        scheduleReconnect();
      };
    }

    connect();

    return () => {
      stopped = true;
      clearTimeout(reconnectTimer);
      if (!socket) return;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.close(1000);
      socket = null;
    };
  }, [
    accessToken,
    familyId,
    kind,
    myChildId,
    myUserId,
    onAccessChanged,
    onAuthenticated,
    onLocation,
  ]);
};
