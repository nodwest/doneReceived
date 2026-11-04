import {
  connectCodeOwnersMock,
  connectCodesMock,
  devicesMock,
  ourFamilyNameMock,
} from '@shared/mocks';
import {
  CONNECT_CODE_TTL_MS,
  type ConnectCode,
  type ConnectCodeOwner,
  type Device,
} from '../model/device';

/**
 * Имитация бэкенда устройств, пока его нет: устройства — из моков, коды
 * подключения выдаются по кругу из списка и живут 15 минут. Всё в памяти до
 * перезапуска приложения. С настоящим API этот файл удаляется целиком.
 */
const devices: Device[] = devicesMock.map((device) => ({ ...device }));
const codes = new Map<number, ConnectCode>();
let nextCode = 0;

const issueCode = (childId: number): ConnectCode => {
  const code: ConnectCode = {
    childId,
    code: connectCodesMock[nextCode++ % connectCodesMock.length],
    expiresAt: new Date(Date.now() + CONNECT_CODE_TTL_MS).toISOString(),
  };
  codes.set(childId, code);
  return code;
};

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  devices: (): Device[] => devices.map((device) => ({ ...device })),

  // Действующий код ребёнка; если его нет или он истёк — новый.
  connectCode: (childId: number): ConnectCode => {
    const current = codes.get(childId);
    const alive = current && new Date(current.expiresAt).getTime() > Date.now();
    return { ...(alive ? current : issueCode(childId)) };
  },

  // Чей код. Выданный в Family ведёт к тому ребёнку, кому выдан, пока жив;
  // истёк или заменён New code — null. Остальные — из connectCodeOwnersMock.
  connectCodeOwner: (code: string): ConnectCodeOwner | null => {
    const issued = [...codes.values()].find((item) => item.code === code);
    if (issued) {
      const alive = new Date(issued.expiresAt).getTime() > Date.now();
      return alive
        ? { childId: issued.childId, familyName: ourFamilyNameMock }
        : null;
    }
    const known = connectCodeOwnersMock.find((item) => item.code === code);
    return known
      ? { childId: known.childId, familyName: known.familyName }
      : null;
  },

  // New code: старый перестаёт работать, новый живёт 15 минут.
  renewConnectCode: (childId: number): ConnectCode => ({
    ...issueCode(childId),
  }),
};
