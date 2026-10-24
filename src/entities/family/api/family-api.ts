import type { InviteCodes } from '../model/invite-codes';
import { mockServer } from './mock-server';

// Эндпоинты семьи. Пока бэкенда нет, тело ходит в mockServer; с API здесь
// будет запрос (GET /family/invite-codes), сигнатура и остальной код не меняются.

export async function fetchInviteCodes(): Promise<InviteCodes> {
  return mockServer.inviteCodes();
}
