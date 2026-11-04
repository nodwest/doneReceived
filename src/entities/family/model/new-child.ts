/**
 * Профиль ребёнка, который родитель создал на вкладке Family, а устройство
 * ещё не подключил: только имя и когда добавлен. Фото пока нет.
 */
export interface NewChild {
  id: number;
  name: string;
  role: 'child';
  /** Когда профиль создан (ISO). */
  createdAt: string;
}

export type NewChildPayload = {
  name: string;
};

/** Сколько символов можно в имени ребёнка. */
export const CHILD_NAME_MAX_LENGTH = 40;
