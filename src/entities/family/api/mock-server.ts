import { inviteCodesMock } from '@shared/mocks';
import type { InviteCodes } from '../model/invite-codes';

/**
 * Имитация бэкенда, пока его нет: коды приглашения — из моков. Эндпоинты в
 * ./family-api ходят сюда. С настоящим API этот файл удаляется целиком.
 */
export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  inviteCodes: (): InviteCodes => ({ ...inviteCodesMock }),
};
