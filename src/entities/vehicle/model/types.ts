export type RoadMovement = {
  /** Координаты [долгота, широта] вдоль дороги. */
  coordinates: [number, number][];
  /** Накопленное расстояние в метрах для каждой координаты. */
  distancesM: number[];
  /** Время начала участка, миллисекунды от эпохи. */
  startAt: number;
  /** Время конца участка, миллисекунды от эпохи. */
  endAt: number;
  /**
   * `road` — путь OSRM по дорогам, `direct` — короткий отрезок без привязки.
   * У старых сообщений поля нет; такой путь считаем непроверенным.
   */
  source?: 'road' | 'direct';
};

export interface Bus {
  type: number;
  route: string;
  longitude: number;
  latitude: number;
  speed: number;
  bearing: number;
  vehicle: string;
  /** Участок движения по дорогам, который прислал бэкенд. */
  movement?: RoadMovement;
}

/** Снапшот для истории, которую сервер отдаёт при подключении. */
export type VehicleSnapshot = {
  serverTime: number;
  vehicles: Bus[];
};
