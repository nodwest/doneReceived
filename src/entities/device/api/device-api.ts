import { apiRequest } from '@shared/api';
import {
  connectCodeForApi,
  formatConnectCode,
  type ConnectCode,
  type Device,
  type PairingPreview,
} from '../model/device';
import { mockServer } from './mock-server';

// Эндпоинты устройств детей. Дети с сервера (есть familyId) ходят в API,
// моковые Emma и Liam (familyId — null) — в mockServer, пока их профили,
// задания и кошельки на моках.

/** Устройства моковых детей (Emma, Liam). */
export async function fetchMockDevices(): Promise<Device[]> {
  return mockServer.devices();
}

type DeviceDto = {
  id: string;
  label: string;
  createdAt: string;
  /** Последний запрос с токеном устройства; null — ещё не было. */
  lastSeenAt: string | null;
};

/** Был запрос не дольше этого назад — устройство «на связи». */
const ONLINE_WINDOW_MS = 2 * 60_000;

/** GET /families/:id/children/:childId/devices — подключённые устройства. */
export async function fetchChildDevices(
  familyId: string,
  childId: string,
): Promise<Device[]> {
  const devices = await apiRequest<DeviceDto[]>(
    `/families/${familyId}/children/${childId}/devices`,
  );
  return devices.map((device) => ({
    id: device.id,
    childId,
    name: device.label,
    connectedAt: device.createdAt,
    lastSeenAt: device.lastSeenAt ?? undefined,
    online:
      device.lastSeenAt !== null &&
      Date.now() - new Date(device.lastSeenAt).getTime() < ONLINE_WINDOW_MS,
  }));
}

/**
 * POST /families/:id/children/:childId/device-codes — код подключения
 * (8 символов, 15 минут). Пока код жив, сервер отдаёт его же, истёк — новый.
 * Без семьи (моковый ребёнок) — код из mockServer.
 */
export async function fetchConnectCode(
  familyId: string | null,
  childId: string,
): Promise<ConnectCode> {
  if (!familyId) return mockServer.connectCode(childId);
  const { code, expiresAt } = await apiRequest<{
    code: string;
    expiresAt: string;
  }>(`/families/${familyId}/children/${childId}/device-codes`, {
    method: 'POST',
  });
  return { childId, code: formatConnectCode(code), expiresAt };
}

/**
 * DELETE /families/:id/child-devices/:deviceId — отключить устройство:
 * его сессии отзываются, на нём ребёнок выйдет при следующем запросе.
 */
export function revokeDevice(familyId: string, deviceId: string) {
  return apiRequest<null>(`/families/${familyId}/child-devices/${deviceId}`, {
    method: 'DELETE',
  });
}

type PreviewDto = {
  profile: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    familyName: string;
  };
};

/**
 * POST /child-devices/pair/preview — чей код подключения: ребёнок видит своё
 * имя и семью до входа, код при этом не гасится. 404 — кода нет (истёк,
 * использован, неизвестен), 400 — не тот формат.
 */
export async function previewPairing(code: string): Promise<PairingPreview> {
  const { profile } = await apiRequest<PreviewDto>(
    '/child-devices/pair/preview',
    { method: 'POST', body: { code: connectCodeForApi(code) } },
  );
  return {
    childId: profile.id,
    name: profile.displayName,
    avatarUrl: profile.avatarUrl,
    familyName: profile.familyName,
  };
}
