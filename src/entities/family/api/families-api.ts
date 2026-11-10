import { apiRequest } from '@shared/api';
import {
  inviteCodeForApi,
  type Family,
  type FamilyChild,
  type FamilyInvitePreview,
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
 * POST /families/:id/invites — коды «Add family member» (8 символов, живут
 * 15 минут): для второго родителя и общий детский. Пока пара жива, сервер
 * отдаёт её же, истекла — выдаёт новую. Зовём только при открытии окна.
 * 403 — нужна роль owner или admin.
 */
export function createParentInvite(familyId: string) {
  return apiRequest<ParentInvite>(`/families/${familyId}/invites`, {
    method: 'POST',
  });
}

/**
 * POST /families/invites/preview — в какую семью ведёт код второго родителя,
 * не гася его. 400 — код неверен, истёк или использован (в теле
 * `attemptsLeft`), 429 — лимит неверных кодов (общий со вступлением).
 */
export function previewFamilyInvite(code: string) {
  return apiRequest<FamilyInvitePreview>('/families/invites/preview', {
    method: 'POST',
    body: { code: inviteCodeForApi(code) },
  });
}

/** GET /families/:id/children — профили детей семьи. */
export function fetchFamilyChildren(familyId: string) {
  return apiRequest<FamilyChild[]>(`/families/${familyId}/children`);
}

/**
 * POST /families/:id/children — профиль ребёнка без почты и пароля;
 * устройство подключают потом кодом. 409 — в семье нет мест.
 */
export function createChild(familyId: string, displayName: string) {
  return apiRequest<{ id: string; displayName: string }>(
    `/families/${familyId}/children`,
    { method: 'POST', body: { displayName } },
  );
}

/**
 * DELETE /families/:id/children/:childId — удалить профиль ребёнка.
 * 409 — на счету есть деньги (`CHILD_BALANCE_NOT_ZERO`) или открытые задания
 * (`CHILD_HAS_TASKS`).
 */
export function deleteChild(familyId: string, childId: string) {
  return apiRequest<null>(`/families/${familyId}/children/${childId}`, {
    method: 'DELETE',
  });
}
