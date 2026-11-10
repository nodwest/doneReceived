/**
 * Роль в семье на сервере: owner — создал семью, admin — второй родитель,
 * вступивший по коду, member — ребёнок. Не путать с `FamilyRole` из
 * `entities/user` (родитель или ребёнок — какой интерфейс показывать).
 */
export type MemberRole = 'owner' | 'admin' | 'member';

/** Семья из ответа POST /families. */
export interface Family {
  id: string;
  name: string;
  /** Сколько участников может быть в семье. */
  userLimit: number;
  createdAt: string;
  updatedAt: string;
}

/** Семья из GET /families: ещё и роль вошедшего в ней. */
export interface FamilyMembership extends Family {
  role: MemberRole;
}

/** Код приглашения второго родителя: POST /families/:id/invites. */
export interface ParentInvite {
  code: string;
  expiresAt: string;
}

/** Название семьи: 1–100 символов без пробелов по краям (правило API). */
export const FAMILY_NAME_MAX_LENGTH = 100;

/**
 * Сколько живёт код второго родителя. Код выдаётся, только когда родитель
 * открыл «Add family member»: пока он жив, сервер отдаёт тот же код,
 * истёк — при следующем открытии выдаёт новый.
 */
export const PARENT_INVITE_TTL_MS = 15 * 60_000;

/** Код для запроса: без дефиса, заглавными (`PR7Q-2KD8` → `PR7Q2KD8`). */
export const inviteCodeForApi = (code: string) =>
  code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
