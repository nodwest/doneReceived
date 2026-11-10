/**
 * Устройство ребёнка, подключённое к семье. У устройств с сервера есть
 * только название и когда подключено; на связи ли оно — пока знают лишь моки
 * (Emma и Liam).
 */
export interface Device {
  id: string;
  childId: string;
  /** Как назвало себя устройство при подключении: «iPhone 15». */
  name: string;
  /** На связи сейчас. */
  online?: boolean;
  /** Когда последний раз выходило на связь (ISO). */
  lastSeenAt?: string;
  /** Когда подключено (ISO). */
  connectedAt?: string;
}

/**
 * Одноразовый код подключения устройства ребёнка: ребёнок вводит его на
 * своём телефоне при входе. После входа код перестаёт работать.
 */
export interface ConnectCode {
  childId: string;
  /** Как показываем: `XXXX-XXXX`. */
  code: string;
  /** До какого момента код действует (ISO). */
  expiresAt: string;
}

/** Профиль, в который ведёт код подключения: POST /child-devices/pair/preview. */
export interface PairingPreview {
  childId: string;
  name: string;
  avatarUrl: string | null;
  familyName: string;
}

/** Сколько живёт код подключения. */
export const CONNECT_CODE_TTL_MS = 15 * 60_000;

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

/** Код для запроса: без дефиса, заглавными (`K7QM-2LP8` → `K7QM2LP8`). */
export const connectCodeForApi = (code: string) =>
  code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
