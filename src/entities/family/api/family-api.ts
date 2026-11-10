import type { FamilyInvite } from '../model/family-invite';
import type { InviteCodes } from '../model/invite-codes';
import { mockServer } from './mock-server';

// Эндпоинты семьи. Пока бэкенда нет, тело ходит в mockServer; с API здесь
// будут запросы, сигнатуры и остальной код не меняются.

/** GET /family/invite-codes — коды для приглашения в нашу семью. */
export async function fetchInviteCodes(): Promise<InviteCodes> {
  return mockServer.inviteCodes();
}

/** GET /family/invites/:code — семья по коду; null, если код неизвестен. */
export async function fetchFamilyInvite(
  code: string,
): Promise<FamilyInvite | null> {
  return mockServer.invite(code);
}

/** POST /family/join — вступить в семью по коду. */
export async function joinFamily(code: string): Promise<FamilyInvite> {
  return mockServer.join(code);
}
