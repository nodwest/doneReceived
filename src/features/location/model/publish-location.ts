import { API_URL } from '@shared/config';
import { ApiError, refreshAccessToken } from '@shared/api';
import { useSessionStore } from '@entities/session';

/**
 * Привязка фоновой точки к конкретной сессии и семье. storageEpoch меняется
 * при выходе и входе, поэтому старый callback не отправит координаты с токеном
 * нового аккаунта.
 */
export type LocationSessionBinding = {
  userId: string;
  familyId: string;
  storageEpoch: number;
};

export type PublishLocationPoint = {
  lat: number;
  lng: number;
  accuracy?: number | null;
  recordedAt: string;
};

function sessionMatches(binding: LocationSessionBinding) {
  const session = useSessionStore.getState().session;
  return Boolean(
    session &&
    session.user.id === binding.userId &&
    session.user.kind === 'child' &&
    session.user.family?.id === binding.familyId &&
    (session.storageEpoch ?? 0) === binding.storageEpoch,
  );
}

function errorFrom(status: number, text: string) {
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }
  const message =
    data && typeof data === 'object' && 'message' in data
      ? (data as { message: unknown }).message
      : null;
  const messages = Array.isArray(message)
    ? message.map(String)
    : typeof message === 'string'
      ? [message]
      : [];
  return new ApiError(status, messages, data);
}

let activeRequest: AbortController | null = null;

/** Отменяет незавершённую отправку при выходе, смене аккаунта или семьи. */
export function cancelActiveLocationPublish() {
  activeRequest?.abort();
  activeRequest = null;
}

async function send(
  binding: LocationSessionBinding,
  point: PublishLocationPoint,
  token: string,
  signal: AbortSignal,
) {
  const body: Record<string, unknown> = {
    lat: point.lat,
    lng: point.lng,
    recordedAt: point.recordedAt,
  };
  if (typeof point.accuracy === 'number' && Number.isFinite(point.accuracy)) {
    body.accuracy = point.accuracy;
  }
  const response = await fetch(
    `${API_URL}/families/${binding.familyId}/children/me/location`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal,
    },
  );
  if (!response.ok) {
    throw errorFrom(response.status, await response.text());
  }
}

/**
 * Единственная сетевая запись координат. Токен берётся из актуальной сессии,
 * но перед каждым вызовом и повтором проверяется привязка к задаче.
 */
export async function publishChildLocation(
  binding: LocationSessionBinding,
  point: PublishLocationPoint,
) {
  const current = useSessionStore.getState().session;
  if (!sessionMatches(binding) || !current) {
    throw new ApiError(401, ['SESSION_CHANGED']);
  }

  cancelActiveLocationPublish();
  const controller = new AbortController();
  activeRequest = controller;
  try {
    try {
      await send(binding, point, current.accessToken, controller.signal);
      return;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
    }

    if (!sessionMatches(binding)) throw new ApiError(401, ['SESSION_CHANGED']);
    const refreshed = await refreshAccessToken(current.accessToken);
    const next = useSessionStore.getState().session;
    if (!refreshed || !next || !sessionMatches(binding)) {
      throw new ApiError(401, ['SESSION_CHANGED']);
    }
    await send(binding, point, next.accessToken, controller.signal);
  } finally {
    if (activeRequest === controller) activeRequest = null;
  }
}
