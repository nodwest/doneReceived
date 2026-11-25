import { useMemo } from 'react';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import {
  useFamilyEventQuery,
  useFamilyEventsQuery,
  type FamilyEvent,
} from '@entities/family-event';
import { addDays, monthGrid, startOfDay, useNow } from '@shared/lib';

const EMPTY_EVENTS: FamilyEvent[] = [];

/**
 * События календаря. Два диапазона:
 * - rolling — 30 дней назад и 60 вперёд для недели, героя и «Ближайших»;
 * - month — сетка выбранного месяца для развернутого календаря.
 * Сервер принимает не шире 92 дней; каждый диапазон укладывается в лимит.
 */
export function useFamilyEvents(monthOffset = 0, includeMonth = true) {
  const now = useNow(60_000);
  const today = useMemo(() => startOfDay(now), [now]);
  const month = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1),
    [monthOffset, today],
  );
  const rollingFrom = useMemo(() => startOfDay(addDays(today, -30)), [today]);
  const rollingTo = useMemo(() => addDays(today, 61), [today]);
  const grid = useMemo(() => monthGrid(month), [month]);
  const monthFrom = useMemo(() => startOfDay(grid.start), [grid.start]);
  const monthTo = useMemo(() => addDays(grid.end, 1), [grid.end]);
  // Оба хука вызываем всегда: нельзя пропускать useSessionUser через `??`,
  // иначе порядок хуков меняется, когда семья появляется из GET /families.
  const currentFamily = useCurrentFamily();
  const sessionUser = useSessionUser();
  // Список семей грузится только родителю; ребёнку семья приходит из сессии.
  // Родителю fallback не нужен: после удаления из семьи старый session.family
  // не должен открывать кэш чужого календаря.
  const familyId =
    currentFamily?.id ??
    (sessionUser?.kind === 'child' ? sessionUser.family?.id : undefined) ??
    null;
  const rolling = useFamilyEventsQuery(familyId, rollingFrom, rollingTo);
  const monthQuery = useFamilyEventsQuery(
    familyId,
    monthFrom,
    monthTo,
    includeMonth,
    false,
  );
  const rollingEvents = rolling.data ?? EMPTY_EVENTS;
  const monthEvents = monthQuery.data ?? EMPTY_EVENTS;
  const refetchRolling = rolling.refetch;
  const refetchMonth = monthQuery.refetch;

  return useMemo(() => {
    const upcoming = rollingEvents
      .filter(
        (event) =>
          event.endsAt.getTime() > now.getTime() ||
          event.startsAt.getTime() === now.getTime(),
      )
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    const next = upcoming[0];
    const featured = next ? { ...next, featured: true } : null;
    const monthFeatured = featured
      ? monthEvents.find(
          (event) =>
            event.id === featured.id &&
            event.startsAt.getTime() === featured.startsAt.getTime(),
        )
      : undefined;

    return {
      now,
      today,
      month,
      rollingEvents: featured
        ? rollingEvents.map((event) => (event === next ? featured : event))
        : rollingEvents,
      monthEvents: monthFeatured
        ? monthEvents.map((event) =>
            event === monthFeatured ? { ...event, featured: true } : event,
          )
        : monthEvents,
      featured,
      upcoming: upcoming.slice(1),
      isPending: !!familyId && rolling.isPending,
      isMonthPending: !!familyId && includeMonth && monthQuery.isPending,
      isError: rolling.isError || (includeMonth && monthQuery.isError),
      isFetching: rolling.isFetching || (includeMonth && monthQuery.isFetching),
      error: rolling.error ?? (includeMonth ? monthQuery.error : null),
      rollingError: rolling.error,
      monthError: includeMonth ? monthQuery.error : null,
      refetchRolling,
      refetchMonth,
      refetch: async () => {
        await Promise.all([
          refetchRolling(),
          includeMonth ? refetchMonth() : Promise.resolve(),
        ]);
      },
    };
  }, [
    familyId,
    includeMonth,
    monthEvents,
    monthQuery.error,
    monthQuery.isError,
    monthQuery.isFetching,
    monthQuery.isPending,
    now,
    refetchMonth,
    refetchRolling,
    rolling.error,
    rolling.isError,
    rolling.isFetching,
    rolling.isPending,
    rollingEvents,
    today,
    month,
  ]);
}

/** Одно событие по id; year — конкретное наступление ежегодного события. */
export function useFamilyEvent(eventId: string | null, year?: number | null) {
  // Оба хука вызываем всегда: нельзя пропускать useSessionUser через `??`,
  // иначе порядок хуков меняется, когда семья появляется из GET /families.
  const currentFamily = useCurrentFamily();
  const sessionUser = useSessionUser();
  const familyId =
    currentFamily?.id ??
    (sessionUser?.kind === 'child' ? sessionUser.family?.id : undefined) ??
    null;
  const query = useFamilyEventQuery(familyId, eventId, year);
  return {
    event: query.isError ? null : (query.data ?? null),
    isPending: !!familyId && !!eventId && query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
