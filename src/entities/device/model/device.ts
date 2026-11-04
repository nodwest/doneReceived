/** Устройство ребёнка, подключённое к семье. */
export interface Device {
  id: number;
  childId: number;
  /** Модель, как её назвало устройство: «iPhone 15». */
  name: string;
  /** На связи сейчас. */
  online: boolean;
  /** Когда последний раз выходило на связь (ISO). */
  lastSeenAt: string;
}

/**
 * Одноразовый код подключения устройства ребёнка: ребёнок вводит его на
 * своём телефоне при входе. После входа код перестаёт работать.
 */
export interface ConnectCode {
  childId: number;
  code: string;
  /** До какого момента код действует (ISO). */
  expiresAt: string;
}

/** Сколько живёт код подключения. */
export const CONNECT_CODE_TTL_MS = 15 * 60_000;

/**
 * Чей код подключения: в аккаунт какого ребёнка и в какую семью войдёт
 * устройство. Отвечает «сервер» на ввод кода при входе ребёнка.
 */
export interface ConnectCodeOwner {
  childId: number;
  familyName: string;
}

/** Шаблон кода подключения — он же плейсхолдер поля. */
export const CONNECT_CODE_TEMPLATE = 'XXXX-XXXX';

const CODE_LENGTH = 8;
const GROUP_SIZE = 4;

/**
 * Приводит ввод к виду кода подключения: заглавные латинские буквы и цифры,
 * дефис посередине. Вставленный код с пробелами или строчными тоже подходит.
 */
export function formatConnectCode(input: string) {
  const chars = input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_LENGTH);
  return chars.match(new RegExp(`.{1,${GROUP_SIZE}}`, 'g'))?.join('-') ?? '';
}

/** Введены все символы кода — можно спрашивать «сервер». */
export const isCompleteConnectCode = (code: string) =>
  code.replace(/-/g, '').length === CODE_LENGTH;
