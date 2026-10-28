import { familyInvitesMock, inviteCodesMock } from '@shared/mocks';
import type { FamilyInvite } from '../model/family-invite';
import type { InviteCodes } from '../model/invite-codes';

const findInvite = (code: string): FamilyInvite | null => {
  const invite = familyInvitesMock.find((item) => item.code === code);
  return invite ? { familyName: invite.familyName, role: invite.role } : null;
};

/**
 * Имитация бэкенда, пока его нет: коды приглашения — из моков. Эндпоинты в
 * ./family-api ходят сюда. С настоящим API этот файл удаляется целиком.
 */
export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  inviteCodes: (): InviteCodes => ({ ...inviteCodesMock }),
  // Семья по коду; неизвестный код — null (на сервере это будет 404).
  invite: findInvite,
  // Вступление ничего не запоминает: возвращает семью, в которую вошли.
  join: (code: string): FamilyInvite => {
    const invite = findInvite(code);
    if (!invite) throw new Error('Invite code not found');
    return invite;
  },
};
