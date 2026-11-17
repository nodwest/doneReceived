import { skipToken, useQuery } from '@tanstack/react-query';
import { queryRoots } from '@shared/api';
import { fetchFamilyEvent, fetchFamilyEvents } from './family-events-api';

/**
 * Ключи календаря. Диапазон входит в ключ: смена периода — отдельный запрос,
 * а старые события остаются в кеше до прихода новых.
 */
export const familyEventsKeys = {
  all: queryRoots.calendar,
  list: (familyId: string | null, from: string, to: string) =>
    [...familyEventsKeys.all, familyId, 'list', from, to] as const,
  detail: (familyId: string | null, eventId: string, year?: number | null) =>
    [
      ...familyEventsKeys.all,
      familyId,
      'detail',
      eventId,
      year ?? 'nearest',
    ] as const,
};

/** События на видимый период календаря. Без семьи запроса нет. */
export function useFamilyEventsQuery(
  familyId: string | null,
  from: Date,
  to: Date,
  enabled = true,
  keepPrevious = true,
) {
  const fromIso = from.toISOString();
  const toIso = to.toISOString();
  return useQuery({
    queryKey: familyEventsKeys.list(familyId, fromIso, toIso),
    queryFn:
      familyId && enabled
        ? () => fetchFamilyEvents(familyId, from, to)
        : skipToken,
    // Пока грузится новый период, показываем предыдущий — без пустого экрана.
    // Но только внутри той же семьи: иначе при смене семьи на секунду
    // показались бы чужие события. Для сетки месяца предыдущий месяц не
    // подставляем: иначе точки событий окажутся не на своих днях.
    placeholderData: (previousData, previousQuery) =>
      keepPrevious && previousQuery?.queryKey[1] === familyId
        ? previousData
        : undefined,
  });
}

/** Одно событие; нужно для прямого перехода и формы правки. */
export function useFamilyEventQuery(
  familyId: string | null,
  eventId: string | null,
  year?: number | null,
) {
  return useQuery({
    queryKey: familyEventsKeys.detail(familyId, eventId ?? '', year),
    queryFn:
      familyId && eventId
        ? () => fetchFamilyEvent(familyId, eventId, year)
        : skipToken,
    retry: 1,
  });
}
