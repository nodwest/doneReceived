import { apiRequest } from '@shared/api';
import { appendPhoto, type PickedPhoto } from '@shared/lib';
import {
  inviteCodeForApi,
  type Family,
  type FamilyChild,
  type FamilyChildDetails,
  type FamilyDetails,
  type FamilyInvitePreview,
  type FamilyMember,
  type FamilyMembership,
  type ParentInvite,
} from '../model/family';

// Эндпоинты семьи. Ошибки приходят как ApiError из @shared/api.

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
 * DELETE /families/:id/invites/current — погасить живой код «Add family
 * member» (отправили не тому). Следующий POST /families/:id/invites выдаст
 * новый. Кода нет — тоже 204. 403 — нужна роль owner или admin.
 */
export function revokeParentInvite(familyId: string) {
  return apiRequest<void>(`/families/${familyId}/invites/current`, {
    method: 'DELETE',
  });
}

/**
 * GET /families/invites/:code — в какую семью ведёт код второго родителя и
 * кто в ней уже есть, не гася код. 400 — код неверен, истёк или использован
 * (в теле `attemptsLeft`), 429 — лимит неверных кодов (общий со
 * вступлением).
 */
export function previewFamilyInvite(code: string) {
  return apiRequest<FamilyInvitePreview>(
    `/families/invites/${encodeURIComponent(inviteCodeForApi(code))}`,
  );
}

type FamilyDetailsDto = Omit<FamilyDetails, 'children'> & {
  children: (Omit<FamilyChildDetails, 'balance'> & { balancePoints: string })[];
};

/**
 * GET /families/:id — семья целиком для экрана Family: родители с ролями,
 * дети с балансом и числом устройств. Только родителям (ребёнку 403).
 */
export async function fetchFamilyDetails(
  familyId: string,
): Promise<FamilyDetails> {
  const dto = await apiRequest<FamilyDetailsDto>(`/families/${familyId}`);
  return {
    ...dto,
    children: dto.children.map(({ balancePoints, ...child }) => ({
      ...child,
      balance: Number(balancePoints),
    })),
  };
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
 * PUT /families/:id/children/:childId/avatar — фото ребёнку от родителя
 * (owner или admin): multipart, поле `photo`, PNG/JPEG/WebP до 2 МиБ.
 * 413 — файл велик, 503 — сервер занят обработкой фото.
 */
export async function setChildAvatar(
  familyId: string,
  childId: string,
  photo: PickedPhoto,
) {
  const form = new FormData();
  await appendPhoto(form, 'photo', photo);
  return apiRequest<unknown>(
    `/families/${familyId}/children/${childId}/avatar`,
    { method: 'PUT', body: form },
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

/**
 * GET /families/:id/members — участники с активным членством (родители и
 * дети). Только родителям: ребёнку 403 (Идеи.md п. 8).
 */
export function fetchFamilyMembers(familyId: string) {
  return apiRequest<FamilyMember[]>(`/families/${familyId}/members`);
}

/**
 * POST /families/:id/members/:memberId/transfer-ownership — владелец
 * передаёт роль owner другому родителю (memberId — id членства), сам
 * становится admin. 403 — вошедший не владелец.
 */
export function transferOwnership(familyId: string, memberId: string) {
  return apiRequest<null>(
    `/families/${familyId}/members/${memberId}/transfer-ownership`,
    { method: 'POST' },
  );
}
