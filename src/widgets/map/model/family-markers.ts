import type { FamilyMember } from '@entities/family';
import type { FamilyLocation, LiveLocation } from '@features/location';

/** Метка ребёнка на карте: свежая точка и данные участника семьи. */
export type FamilyMarker = {
  /** id аккаунта: по нему же ищется участник и скрытие в слоях. */
  userId: string;
  /** Профиль ребёнка; у точки без профиля метки нет. */
  childId: string;
  lat: number;
  lng: number;
  zoneId: string | null;
  deviceLabel: string;
  /** Когда измерена точка; undefined — время неизвестно. */
  updatedAt?: string;
  name: string;
  avatarUrl: string | null;
  color: string;
};

/** Что нужно, чтобы собрать метки: одинаково для веба и нативной карты. */
export type FamilyMarkerSource = {
  /** Есть ли семья: без неё метки не показываем. */
  family: unknown;
  /** Участники семьи: имя, аватар и цвет метки берутся отсюда. */
  members: FamilyMember[];
  /** Последние сохранённые точки семьи (GET /families/:id/locations). */
  saved: FamilyLocation[];
  /** Живые точки из сокета: свежее сохранённых по времени. */
  live: Record<string, LiveLocation>;
  /** Кого скрыл сам пользователь в слоях карты. */
  hiddenChildren: string[];
  /** Кому сервер закрыл доступ к геопозиции. */
  hiddenAccess: Record<string, boolean>;
  /** Имя устройства по умолчанию, уже переведённое. */
  deviceFallback: string;
};

const timeOf = (value?: string | null) => {
  if (!value) return Number.NaN;
  return Date.parse(value);
};

/**
 * Собирает метки детей один раз на набор данных: сохранённые точки и живые,
 * если живая строго свежее. Правила видимости и имя устройства по умолчанию
 * общие для веба и натива — раньше они были продублированы, и веб показывал
 * русское «Устройство» даже в английском интерфейсе.
 */
export function collectFamilyMarkers({
  family,
  members,
  saved,
  live,
  hiddenChildren,
  hiddenAccess,
  deviceFallback,
}: FamilyMarkerSource): FamilyMarker[] {
  if (!family) return [];
  const children = new Map(
    members
      .filter((member) => member.kind === 'child' && member.childId)
      .map((member) => [member.userId, member] as const),
  );

  const points = new Map<
    string,
    {
      lat: number;
      lng: number;
      zoneId: string | null;
      deviceLabel: string;
      updatedAt?: string;
    }
  >();
  for (const location of saved) {
    if (!location.childId || !children.has(location.userId)) continue;
    points.set(location.userId, {
      lat: location.lat,
      lng: location.lng,
      zoneId: location.zoneId,
      deviceLabel: location.deviceLabel || deviceFallback,
      updatedAt: location.recordedAt ?? location.updatedAt ?? undefined,
    });
  }
  for (const [userId, location] of Object.entries(live)) {
    if (!location.childId || !children.has(userId)) continue;
    const measuredAt = location.recordedAt ?? location.updatedAt ?? undefined;
    const previous = points.get(userId);
    const measured = timeOf(measuredAt);
    const earlier = timeOf(previous?.updatedAt);
    if (
      Number.isFinite(earlier) &&
      (!Number.isFinite(measured) || measured <= earlier)
    )
      continue;
    points.set(userId, {
      lat: location.lat,
      lng: location.lng,
      zoneId: location.zoneId,
      deviceLabel: location.deviceLabel || deviceFallback,
      updatedAt: measuredAt,
    });
  }

  const markers: FamilyMarker[] = [];
  for (const [userId, point] of points) {
    const member = children.get(userId);
    if (!member?.childId) continue;
    if (hiddenChildren.includes(userId) || hiddenAccess[userId]) continue;
    markers.push({
      userId,
      childId: member.childId,
      lat: point.lat,
      lng: point.lng,
      zoneId: point.zoneId,
      deviceLabel: point.deviceLabel,
      updatedAt: point.updatedAt,
      name: member.displayName,
      avatarUrl: member.avatarUrl,
      color: member.mapColor,
    });
  }
  return markers;
}
