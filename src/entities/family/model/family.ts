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

/**
 * Коды «Add family member»: POST /families/:id/invites. Сервер выдаёт пару —
 * для второго родителя и общий код, по которому ребёнок сам создаёт себе
 * профиль. Общий детский код мы не показываем: ребёнка добавляет родитель
 * (Add a child), а устройство подключается кодом профиля.
 */
export interface ParentInvite {
  /** 8 символов без дефиса; показываем через `formatInviteCode`. */
  parentCode: string;
  childCode: string;
  /** Общий срок пары: 15 минут с первого запроса. */
  expiresAt: string;
  parentUsed: boolean;
  childUsed: boolean;
}

/** Семья по коду приглашения до вступления: GET /families/invites/:code. */
export interface FamilyInvitePreview {
  familyId: string;
  familyName: string;
  role: 'admin';
  expiresAt: string;
  /** Кто уже в семье: имена без почты и id. */
  members: { displayName: string; kind: 'parent' | 'child' }[];
}

/** Профиль ребёнка в семье: GET /families/:id/children. */
export interface FamilyChild {
  /** UUID профиля (childId в ручках). */
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

/**
 * Участник семьи: GET /families/:id/members (только родителям). `id` —
 * членство (для передачи владения), `userId` — аккаунт (автор заданий).
 */
export interface FamilyMember {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: MemberRole;
  kind: 'parent' | 'child';
}

/** Сколько символов можно в имени ребёнка (на сервере до 100). */
export const CHILD_NAME_MAX_LENGTH = 40;

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
