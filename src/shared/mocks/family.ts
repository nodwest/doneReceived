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

/** Родители: статус «дома» и место на карте (выплаченное считается по истории). */
export const parentProfilesMock = [
  {
    id: parentMock.id,
    name: parentMock.name,
    role: parentMock.role,
    avatar: parentMock.avatar,
    presence: { atHome: true, since: ago(HOUR) },
    position: { lat: 47.2225, lng: 39.7188 },
  },
  {
    ...coParentMock,
    presence: { atHome: false, since: ago(25 * MINUTE) },
    position: { lat: 47.2268, lng: 39.7452 },
  },
];

/** Коды приглашения в семью: для второго родителя и для ребёнка. */
export const inviteCodesMock = {
  parent: 'PR7Q-2KD8',
  child: 'KD4X-9Q7M',
};

/**
 * Коды приглашения, которые знает «сервер»: наши (inviteCodesMock — с ними
 * входят в семью Miller) и коды чужой семьи Johnson, чтобы проверить
 * вступление в другую семью с вкладки Family.
 */
export const familyInvitesMock = [
  { code: inviteCodesMock.parent, familyName: 'Miller', role: 'parent' },
  { code: inviteCodesMock.child, familyName: 'Miller', role: 'child' },
  { code: 'PJ5K-7QW3', familyName: 'Johnson', role: 'parent' },
  { code: 'KJ9F-6RZ1', familyName: 'Johnson', role: 'child' },
] as const;
