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
} as const;

type DataArea = keyof typeof queryRoots;

/**
 * Что изменилось. Шлют мутации после своего ответа сервера, а позже — и
 * события сервера по WebSocket (изменения с других устройств, Идеи.md п. 31).
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
  | 'profile-changed';

/**
 * Какие данные задевает изменение. Одно место для всех связей: новая
 * мутация или новое событие сервера — новая строка здесь.
 */
const AFFECTS: Record<DataChange, readonly DataArea[]> = {
  // Награда резервируется и возвращается — кошелёк родителя меняется.
  'task-created': ['tasks', 'wallet', 'activity'],
  'task-updated': ['tasks', 'wallet', 'activity'],
  'task-cancelled': ['tasks', 'wallet', 'activity'],
  'task-submitted': ['tasks', 'activity'],
  'task-withdrawn': ['tasks', 'activity'],
  'checklist-ticked': ['tasks'],
  // Деньги из резерва — ребёнку: кошельки, история наград, баланс в Family.
  'task-approved': ['tasks', 'wallet', 'operations', 'activity', 'families'],
  // На переделку — резерв остаётся, закрыть — возвращается.
  'task-rejected': ['tasks', 'wallet', 'operations', 'activity'],
  'wish-changed': ['wishes', 'activity'],
  'funds-deposited': ['wallet', 'activity'],
  // Имя и фото ребёнка видны в заданиях и истории.
  'child-changed': ['families', 'devices', 'tasks', 'wallet', 'operations'],
  'device-changed': ['devices', 'families'],
  'family-changed': ['families', 'tasks', 'wallet', 'operations', 'activity'],
  // Своё имя и фото — в шапках, заданиях, ленте и истории.
  'profile-changed': [
    'me',
    'families',
    'tasks',
    'wallet',
    'operations',
    'activity',
  ],
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
export function syncData(queryClient: QueryClient, change: DataChange) {
  return Promise.all(
    AFFECTS[change].map((area) =>
      queryClient.invalidateQueries({
        queryKey: queryRoots[area],
        predicate: syncable,
      }),
    ),
  );
}

/**
 * Как часто перечитывать то, что может поменять другой человек (ребёнок
 * сдал задание — родитель видит). Временно: когда сервер начнёт присылать
 * события по WebSocket (Идеи.md п. 31), таймер уберём.
 */
export const SYNC_POLL_MS = 15_000;
