import type { ConnectCode, ConnectCodeOwner, Device } from '../model/device';
import { mockServer } from './mock-server';

// Эндпоинты устройств детей. Пока бэкенда нет, тело ходит в mockServer; с
// API здесь будут запросы, сигнатуры и остальной код не меняются.

/** GET /family/devices — устройства всех детей семьи. */
export async function fetchDevices(): Promise<Device[]> {
  return mockServer.devices();
}

/** GET /children/:id/connect-code — действующий код подключения устройства. */
export async function fetchConnectCode(childId: number): Promise<ConnectCode> {
  return mockServer.connectCode(childId);
}

/** POST /children/:id/connect-code — новый код, старый перестаёт работать. */
export async function renewConnectCode(childId: number): Promise<ConnectCode> {
  return mockServer.renewConnectCode(childId);
}

/**
 * GET /connect-codes/:code — чей код: ребёнок вводит его при входе. Код
 * истёк, использован или неизвестен — null.
 */
export async function fetchConnectCodeOwner(
  code: string,
): Promise<ConnectCodeOwner | null> {
  return mockServer.connectCodeOwner(code);
}
