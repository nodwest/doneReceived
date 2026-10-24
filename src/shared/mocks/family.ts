import { childrenMock } from './children';
import { coParentMock, parentMock } from './parent';

const [emma, liam] = childrenMock;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

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

/** Родители: сколько выплатили наград, статус «дома» и место на карте. */
export const parentProfilesMock = [
  {
    id: parentMock.id,
    name: parentMock.name,
    avatar: parentMock.avatar,
    rewardsPaid: 128,
    presence: { atHome: true, since: ago(HOUR) },
    position: { lat: 47.2225, lng: 39.7188 },
  },
  {
    ...coParentMock,
    rewardsPaid: 86,
    presence: { atHome: false, since: ago(25 * MINUTE) },
    position: { lat: 47.2268, lng: 39.7452 },
  },
];

/** Коды приглашения в семью: для второго родителя и для ребёнка. */
export const inviteCodesMock = {
  parent: 'PAR7-390L-2DK8-VQ41-ZMTW',
  child: 'KID4-821X-9Q7M-2LP8-3RTW',
};
