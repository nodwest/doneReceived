/** Подтверждённое состояние ребёнка в геозоне. */
export type ZonePresenceState = 'inside' | 'outside';

export type ZonePresence = {
  zoneId: string;
  state: ZonePresenceState;
  /** Когда состояние подтвердилось (ISO). */
  since: string;
};

/** Позиция члена семьи с сервера (событие `location` сокета геолокации). */
export type Location = {
  /** Аккаунт, приславший координаты. */
  userId: string;
  /** Профиль ребёнка в семье; null — родитель. */
  childId: string | null;
  lat: number;
  lng: number;
  /** Точность в метрах, если устройство её дало. */
  accuracy?: number | null;
  /** Геозона, в которой человек сейчас, если есть. */
  zoneId?: string | null;
  /** Подтверждённые состояния по зонам — только у ребёнка. */
  zones?: ZonePresence[];
  /** Устройство, с которого получена точка. */
  deviceId?: string | null;
  deviceLabel?: string | null;
  /** ISO-время позиции. */
  updatedAt?: string;
};
