import { EVENTS_WS_URL } from '../config';
import type { DataChange } from './data-sync';
import { currentAccessToken, refreshAccessToken } from './http';

// События сервера «что изменилось» (Идеи.md п. 31): сокет /events, вход
// access-токеном, затем `change` с `data.type`. Данные в событии не берём —
// по типу перечитываем нужное обычными GET через `syncData`.

/** Тип события сервера → изменение в приложении. Неизвестные пропускаем. */
const SERVER_CHANGES: Record<string, DataChange> = {
  task_created: 'task-created',
  task_updated: 'task-updated',
  task_cancelled: 'task-cancelled',
  task_submitted: 'task-submitted',
  task_withdrawn: 'task-withdrawn',
  checklist_ticked: 'checklist-ticked',
  task_approved: 'task-approved',
  task_rejected: 'task-rejected',
  task_expired: 'task-expired',
  wish_changed: 'wish-changed',
  deposit: 'funds-deposited',
  child_changed: 'child-changed',
  device_changed: 'device-changed',
  family_changed: 'family-changed',
  profile_changed: 'profile-changed',
  email_changed: 'email-changed',
  calendar_changed: 'calendar-changed',
};

/** Мобильная сеть рвёт сокет молча: проверяем связь ping / pong. */
const PING_MS = 25_000;
const PONG_TIMEOUT_MS = 10_000;
/** Паузы перед переподключением подряд; дальше — последняя. */
const RECONNECT_MS = [1_000, 2_000, 5_000, 10_000, 30_000];

/** Токен отклонён или истёк. */
const CLOSE_TOKEN_EXPIRED = 4401;
/** Сессия недействительна (отозвана, устройство отключено). */
const CLOSE_SESSION_INVALID = 4403;

type ServerMessage = { event?: unknown; data?: unknown };

type ServerEventsHandlers = {
  /** Пришло изменение — перечитать задетое. */
  onChange: (change: DataChange) => void;
  /**
   * Связь вернулась после обрыва: события за это время сервер не досылает,
   * поэтому всё открытое нужно перечитать.
   */
  onReconnect: () => void;
};

const parse = (raw: unknown): ServerMessage | null => {
  if (typeof raw !== 'string') return null;
  try {
    const message: unknown = JSON.parse(raw);
    return message && typeof message === 'object' ? message : null;
  } catch {
    return null;
  }
};

const changeOf = (data: unknown) =>
  data && typeof data === 'object' && 'type' in data
    ? SERVER_CHANGES[String(data.type)]
    : undefined;

const log = (message: string) => {
  if (__DEV__) console.log(`[events] ${message}`);
};

/**
 * Подключиться к событиям сервера и держать связь: обрыв — переподключение
 * с паузой, 4401 / 4403 — обновить токены (тем же вызовом, что и запросы) и
 * подключиться снова. Сервер не принял refresh-токен — сессия стирается
 * сама, и тот, кто подключал, закрывает сокет. Возвращает отключение.
 * Токен не логируем.
 */
export function connectServerEvents({
  onChange,
  onReconnect,
}: ServerEventsHandlers): () => void {
  let socket: WebSocket | null = null;
  let stopped = false;
  let attempt = 0;
  let connectedBefore = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let pingTimer: ReturnType<typeof setInterval> | undefined;
  let pongTimer: ReturnType<typeof setTimeout> | undefined;

  const stopHeartbeat = () => {
    clearInterval(pingTimer);
    clearTimeout(pongTimer);
  };

  const scheduleReconnect = () => {
    if (stopped) return;
    const delay = RECONNECT_MS[Math.min(attempt, RECONNECT_MS.length - 1)];
    attempt += 1;
    reconnectTimer = setTimeout(open, delay);
  };

  /** Бросить сокет без ожидания закрытия (сеть пропала) и переподключиться. */
  const drop = (ws: WebSocket) => {
    ws.onclose = null;
    ws.onmessage = null;
    ws.close();
    stopHeartbeat();
    socket = null;
    log('нет ответа на ping, переподключаемся');
    scheduleReconnect();
  };

  const startHeartbeat = (ws: WebSocket) => {
    stopHeartbeat();
    pingTimer = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ event: 'ping' }));
      clearTimeout(pongTimer);
      pongTimer = setTimeout(() => drop(ws), PONG_TIMEOUT_MS);
    }, PING_MS);
  };

  function open() {
    if (stopped) return;
    const token = currentAccessToken();
    if (!token) return;
    const ws = new WebSocket(EVENTS_WS_URL);
    socket = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({ event: 'authenticate', data: { accessToken: token } }),
      );
    };

    ws.onmessage = ({ data }) => {
      const message = parse(data);
      if (!message) return;
      if (message.event === 'authenticated') {
        // false — сервер сам закроет сокет с 4401.
        if (message.data !== true) return;
        attempt = 0;
        startHeartbeat(ws);
        log(connectedBefore ? 'снова на связи' : 'на связи');
        if (connectedBefore) onReconnect();
        connectedBefore = true;
        return;
      }
      if (message.event === 'pong') {
        clearTimeout(pongTimer);
        return;
      }
      if (message.event !== 'change') return;
      const change = changeOf(message.data);
      if (!change) return;
      log(change);
      onChange(change);
    };

    ws.onclose = async ({ code }) => {
      stopHeartbeat();
      socket = null;
      if (stopped) return;
      log(`закрыт, код ${code}`);
      if (code === CLOSE_TOKEN_EXPIRED || code === CLOSE_SESSION_INVALID) {
        await refreshAccessToken(token);
        if (stopped) return;
      }
      scheduleReconnect();
    };
  }

  open();

  return () => {
    stopped = true;
    clearTimeout(reconnectTimer);
    stopHeartbeat();
    if (!socket) return;
    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.close(1000);
    socket = null;
  };
}
