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
  /** ISO-время позиции. */
  updatedAt?: string;
};
