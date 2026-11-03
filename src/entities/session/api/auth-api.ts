import { apiRequest } from '@shared/api';
import type {
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  Session,
  VerifyEmailPayload,
} from '../model/session';

// Эндпоинты авторизации. Ошибки приходят как ApiError из @shared/api.

/**
 * POST /auth/register — новый аккаунт родителя. Сервер отправляет на почту
 * письмо с кодом и ссылкой подтверждения. 400 — неверные данные или почта
 * уже занята.
 */
export function register(payload: RegisterPayload) {
  return apiRequest<MessageResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

/**
 * POST /auth/resend-verification — письмо подтверждения ещё раз. 400 —
 * пользователь не найден или почта уже подтверждена.
 */
export function resendVerification(email: string) {
  return apiRequest<MessageResponse>('/auth/resend-verification', {
    method: 'POST',
    body: { email },
  });
}

/**
 * POST /auth/verify-email — подтвердить почту кодом из письма. 400 — неверный
 * код или кончились попытки.
 */
export function verifyEmail(payload: VerifyEmailPayload) {
  return apiRequest<MessageResponse>('/auth/verify-email', {
    method: 'POST',
    body: payload,
  });
}

/**
 * POST /auth/login — вход: токены и пользователь. 401 — неверная почта или
 * пароль либо почта ещё не подтверждена.
 */
export function login(payload: LoginPayload) {
  return apiRequest<Session>('/auth/login', { method: 'POST', body: payload });
}
