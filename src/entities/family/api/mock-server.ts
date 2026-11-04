import {
  childrenMock,
  familyInvitesMock,
  inviteCodesMock,
  newChildrenMock,
} from '@shared/mocks';
import type { FamilyInvite } from '../model/family-invite';
import type { InviteCodes } from '../model/invite-codes';
import type { NewChild, NewChildPayload } from '../model/new-child';

// Новые профили детей живут в памяти до перезапуска приложения.
let newChildren: NewChild[] = newChildrenMock.map((child) => ({ ...child }));
let nextChildId =
  Math.max(
    ...childrenMock.map((child) => child.id),
    ...newChildren.map((child) => child.id),
  ) + 1;

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

  newChildren: (): NewChild[] => newChildren.map((child) => ({ ...child })),

  createChild: ({ name }: NewChildPayload): NewChild => {
    const child: NewChild = {
      id: nextChildId++,
      name,
      role: 'child',
      createdAt: new Date().toISOString(),
    };
    newChildren = [...newChildren, child];
    return { ...child };
  },

  // Удалить можно только профиль без устройства — такие и лежат здесь.
  deleteChild: (id: number): void => {
    if (!newChildren.some((child) => child.id === id)) {
      throw new Error(`Child ${id} not found`);
    }
    newChildren = newChildren.filter((child) => child.id !== id);
  },
};
