import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';

/** Семья для запросов: у родителя — из GET /families, у ребёнка — из сессии. */
export function useWordsFamilyId() {
  const family = useCurrentFamily();
  const user = useSessionUser();
  return family?.id ?? user?.family?.id ?? null;
}
