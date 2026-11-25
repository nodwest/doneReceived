import type { Query, QueryClient } from '@tanstack/react-query';

/**
 * Корни ключей React Query — «теги» данных. Ключи сущностей начинаются с
 * них (`taskKeys.all = queryRoots.tasks`), поэтому сброс корня сбрасывает
 * все запросы этой области: любой семьи и любого ребёнка.
 */
export const queryRoots = {
  tasks: ['tasks'],
  wallet: ['wallet'],
  operations: ['operations'],
  activity: ['activity'],
  families: ['families'],
  wishes: ['wishes'],
  devices: ['devices'],
  me: ['me'],
  calendar: ['calendar'],
  words: ['words'],
} as const;

type DataArea = keyof typeof queryRoots;

/**
 * Что изменилось. Шлют мутации после своего ответа сервера и события
 * сервера по WebSocket (`server-events.ts`) — изменения с других устройств.
 */
export type DataChange =
  | 'task-created'
  | 'task-updated'
  | 'task-cancelled'
  | 'task-submitted'
  | 'task-withdrawn'
  | 'checklist-ticked'
  | 'task-approved'
  | 'task-rejected'
  | 'wish-changed'
  | 'funds-deposited'
  | 'child-changed'
  | 'device-changed'
  | 'family-changed'
  | 'profile-changed'
  | 'email-changed'
  | 'calendar-changed'
  | 'words-changed'
  | 'task-expired';

/**
 * Какие данные задевает изменение. Одно место для всех связей: новая
 * мутация или новое событие сервера — новая строка здесь.
 */
const AFFECTS: Record<DataChange, readonly DataArea[]> = {
  // Награда резервируется и возвращается — кошелёк родителя меняется.
  'task-created': ['tasks', 'wallet', 'activity', 'words'],
  'task-updated': ['tasks', 'wallet', 'activity', 'words'],
  'task-cancelled': ['tasks', 'wallet', 'activity', 'words'],
  'task-submitted': ['tasks', 'activity', 'words'],
  'task-withdrawn': ['tasks', 'activity', 'words'],
  'checklist-ticked': ['tasks'],
  // Деньги из резерва — ребёнку: кошельки, история наград, баланс в Family.
  'task-approved': [
    'tasks',
    'wallet',
    'operations',
    'activity',
    'families',
    'words',
  ],
  // На переделку — резерв остаётся, закрыть — возвращается.
  'task-rejected': ['tasks', 'wallet', 'operations', 'activity', 'words'],
  'wish-changed': ['wishes', 'activity'],
  // Хватило денег — сервер сразу выдаёт порцию слов, ждавшую пополнения.
  'funds-deposited': ['wallet', 'activity', 'words', 'tasks'],
  // Имя и фото ребёнка видны в заданиях и истории.
  'child-changed': [
    'families',
    'devices',
    'tasks',
    'wallet',
    'operations',
    'words',
  ],
  'device-changed': ['devices', 'families'],
  'family-changed': [
    'calendar',
    'families',
    'tasks',
    'wallet',
    'operations',
    'activity',
    'words',
  ],
  // Своё имя и фото — в шапках, заданиях, ленте и истории.
  'profile-changed': [
    'me',
    'families',
    'tasks',
    'wallet',
    'operations',
    'activity',
  ],
  // Почта видна только в своём профиле; ожидающая смена — там же.
  'email-changed': ['me'],
  // События календаря семьи.
  'calendar-changed': ['calendar', 'activity'],
  // Слова дня включили, выключили или сменили награду: сервер мог выдать
  // или отменить порцию (резерв у родителя).
  'words-changed': ['words', 'tasks', 'wallet', 'activity'],
  // Срок прошёл, задание не сдано: резерв возвращается, награда — в упущенные.
  'task-expired': ['tasks', 'wallet', 'operations', 'activity'],
};

/**
 * Запросы с `meta: { sync: false }` не перечитываются при синхронизации:
 * это выдача одноразовых кодов (POST), у них свой срок.
 */
export const syncable = (query: Query) => query.meta?.sync !== false;

/**
 * Сбросить всё, что задело изменение. Перечитываются только запросы на
 * открытых экранах — без мигания: старые данные остаются, пока не придут
 * новые; остальные помечаются устаревшими и обновятся при показе.
 */
export function syncData(
  queryClient: QueryClient,
  change: DataChange,
  { clearCalendar = false } = {},
) {
  return Promise.all(
    AFFECTS[change].map((area) => {
      const filters = { queryKey: queryRoots[area], predicate: syncable };
      if (
        clearCalendar &&
        (area === 'calendar' ||
          (area === 'activity' &&
            (change === 'calendar-changed' || change === 'family-changed')))
      ) {
        return queryClient.resetQueries(filters);
      }
      return queryClient.invalidateQueries(filters);
    }),
  );
}
