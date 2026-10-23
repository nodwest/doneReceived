import { childrenMock } from './children';

const [emma, liam] = childrenMock;

const MINUTE = 60_000;

// Время считается от момента загрузки, чтобы «5 min ago» было правдой.
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

/**
 * Дети с данными для профиля: баланс, статус «дома» и место на карте
 * (Ростов-на-Дону, как на вкладке Map). Счётчики заданий здесь не храним —
 * страницы считают их по списку задач.
 */
export const childProfilesMock = [
  {
    ...emma,
    balance: 42,
    presence: { atHome: true, since: ago(5 * MINUTE) },
    position: { lat: 47.2225, lng: 39.7188 },
  },
  {
    ...liam,
    balance: 27,
    presence: { atHome: false, since: ago(12 * MINUTE) },
    position: { lat: 47.2313, lng: 39.735 },
  },
];
