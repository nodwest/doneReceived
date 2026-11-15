/** Подтверждённое состояние ребёнка в геозоне. */
export type ZonePresenceState = 'inside' | 'outside';

export type ZonePresence = {
  zoneId: string;
  state: ZonePresenceState;
  /** Когда состояние подтвердилось (ISO). */
  since: string;
};

/** Позиция ребёнка с сервера (событие `location` сокета геолокации). */
export type Location = {
  /** Аккаунт ребёнка, приславшего координаты. */
  userId: string;
  /** Профиль ребёнка в семье; null — прислал не ребёнок, такое не рисуем. */
  childId: string | null;
  lat: number;
  lng: number;
  /** Точность в метрах, если устройство её дало. */
  accuracy?: number | null;
  /** Геозона, в которой ребёнок сейчас, если есть. */
  zoneId?: string | null;
  /** Подтверждённые состояния по зонам с буферами и задержками. */
  zones?: ZonePresence[];
  /** ISO-время позиции. */
  updatedAt?: string;
};
