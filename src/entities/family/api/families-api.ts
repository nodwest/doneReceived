import { apiRequest } from '@shared/api';
import {
  inviteCodeForApi,
  type Family,
  type FamilyMembership,
  type ParentInvite,
} from '../model/family';

// Настоящие эндпоинты семьи. Ошибки приходят как ApiError из @shared/api.
// Остальное в family-api.ts (коды для ребёнка, новые профили детей) пока
// ходит в mock-server.

/** GET /families — семьи, где у вошедшего есть членство, и его роль в них. */
export function fetchMyFamilies() {
  return apiRequest<FamilyMembership[]>('/families');
}

/**
 * POST /families — создать семью, вошедший становится owner. 400 — неверное
 * название, 409 — аккаунт уже в семье.
 */
export function createFamily(name: string) {
  return apiRequest<Family>('/families', { method: 'POST', body: { name } });
}

/**
 * POST /families/join — вступить в семью по коду второго родителя
 * (`XXXX-XXXX`, уходит без дефиса), роль admin. 400 — код неверен, истёк
 * или уже использован, 409 — аккаунт уже в семье или в ней нет мест.
 */
export function joinFamilyByCode(code: string) {
  return apiRequest<{ familyId: string }>('/families/join', {
    method: 'POST',
    body: { code: inviteCodeForApi(code) },
  });
}

/**
 * POST /families/:id/invites — код для второго родителя (`XXXX-XXXX`, живёт
 * 15 минут). Пока прежний код жив, сервер отдаёт его же, истёк — выдаёт
 * новый. Зовём только при открытии «Add family member». 403 — нужна роль
 * owner или admin.
 */
export function createParentInvite(familyId: string) {
  return apiRequest<ParentInvite>(`/families/${familyId}/invites`, {
    method: 'POST',
  });
}
