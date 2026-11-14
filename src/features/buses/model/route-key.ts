import type { Bus } from '@entities/vehicle';

/**
 * Ключ маршрута для настроек слоёв — номер маршрута. Водители разных видов
 * транспорта с одним номером скрываются вместе: для родителя это один
 * маршрут, а тип в сообщениях PIKAS не описан.
 */
export function busRouteKey(bus: Pick<Bus, 'route'>) {
  return bus.route;
}
