import { connectCodesMock, devicesMock } from '@shared/mocks';
import {
  CONNECT_CODE_TTL_MS,
  type ConnectCode,
  type Device,
} from '../model/device';

/**
 * Имитация бэкенда устройств для моковых детей (Emma, Liam): устройства из
 * моков, коды подключения выдаются по кругу из списка и живут 15 минут.
 * Пока код жив, отдаётся он же — как на настоящем сервере. Всё в памяти до
 * перезапуска приложения.
 */
const devices: Device[] = devicesMock.map((device) => ({
  ...device,
  id: String(device.id),
  childId: String(device.childId),
}));
const codes = new Map<string, ConnectCode>();
let nextCode = 0;

const issueCode = (childId: string): ConnectCode => {
  const code: ConnectCode = {
    childId,
    code: connectCodesMock[nextCode++ % connectCodesMock.length],
    expiresAt: new Date(Date.now() + CONNECT_CODE_TTL_MS).toISOString(),
  };
  codes.set(childId, code);
  return code;
};

export const mockServer = {
  devices: (): Device[] => devices.map((device) => ({ ...device })),

  connectCode: (childId: string): ConnectCode => {
    const current = codes.get(childId);
    const alive = current && new Date(current.expiresAt).getTime() > Date.now();
    return { ...(alive ? current : issueCode(childId)) };
  },
};
