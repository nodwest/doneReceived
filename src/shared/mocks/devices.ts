import { childrenMock } from './children';

const [emma, liam] = childrenMock;

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

// Время считается от момента загрузки, чтобы «12 d ago» было правдой.
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

/**
 * Устройства детей, подключённые к семье: по два у каждого. `lastSeenAt` —
 * когда устройство последний раз выходило на связь; `online` — на связи
 * сейчас.
 */
export const devicesMock = [
  {
    id: 1,
    childId: emma.id,
    name: 'iPhone 15',
    online: true,
    lastSeenAt: ago(0),
  },
  {
    id: 2,
    childId: emma.id,
    name: 'iPhone 13',
    online: false,
    lastSeenAt: ago(12 * DAY),
  },
  {
    id: 3,
    childId: liam.id,
    name: 'Galaxy A54',
    online: true,
    lastSeenAt: ago(0),
  },
  {
    id: 4,
    childId: liam.id,
    name: 'iPad mini',
    online: false,
    lastSeenAt: ago(3 * HOUR),
  },
];

/**
 * Профили детей, которые родитель создал, но устройство ещё не подключил:
 * Mia добавлена сегодня. Подключить устройство — одноразовым кодом.
 */
export const newChildrenMock = [
  { id: 3, name: 'Mia', role: 'child' as const, createdAt: ago(0) },
];

/**
 * Одноразовые коды подключения устройства ребёнка: «сервер» выдаёт их по
 * кругу, New code берёт следующий. Код живёт 15 минут.
 */
export const connectCodesMock = [
  'K7QM-2LP8',
  'X4TR-9BN2',
  'P8WD-3KZ6',
  'H2JC-7VMQ',
  'R9FL-5XT4',
];

/** Семья вошедшего родителя — её называет «сервер» по коду подключения. */
export const ourFamilyNameMock = 'Miller';

/**
 * Коды подключения, которые «сервер» узнаёт без выдачи из Family: чтобы на
 * выборе роли можно было войти ребёнком, не открывая меню кода у родителя.
 * Код, выданный в Family, важнее: он ведёт к тому ребёнку, кому его выдали.
 */
export const connectCodeOwnersMock = [
  { code: 'K7QM-2LP8', childId: emma.id, familyName: ourFamilyNameMock },
  { code: 'X4TR-9BN2', childId: liam.id, familyName: ourFamilyNameMock },
  { code: 'P8WD-3KZ6', childId: 3, familyName: ourFamilyNameMock },
];
