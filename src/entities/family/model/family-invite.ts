/** Кем человек войдёт в семью по коду; совпадает с FamilyRole из user. */
export type InviteRole = 'parent' | 'child';

/** Семья, найденная по коду приглашения, и роль, которую даёт код. */
export interface FamilyInvite {
  /** Фамилия семьи: «Miller» → «Miller family». */
  familyName: string;
  role: InviteRole;
}

// Код — пять групп по четыре символа: KID4-821X-9Q7M-2LP8-3RTW.
const GROUP_SIZE = 4;
const CODE_LENGTH = 5 * GROUP_SIZE;

/** Шаблон кода для плейсхолдера поля. */
export const INVITE_CODE_TEMPLATE = 'XXXX-XXXX-XXXX-XXXX-XXXX';

/**
 * Приводит ввод к виду кода: заглавные буквы и цифры, дефисы между группами.
 * Вставленный код с пробелами или строчными буквами тоже становится кодом.
 */
export function formatInviteCode(input: string) {
  const chars = input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_LENGTH);
  return chars.match(new RegExp(`.{1,${GROUP_SIZE}}`, 'g'))?.join('-') ?? '';
}

/** Введены все символы кода — можно искать семью. */
export const isCompleteInviteCode = (code: string) =>
  code.replace(/-/g, '').length === CODE_LENGTH;
