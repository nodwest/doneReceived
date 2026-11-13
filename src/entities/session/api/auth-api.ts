import { apiRequest } from '@shared/api';
import type {
  ChangePasswordPayload,
  LoginPayload,
  MessageResponse,
  PairDevicePayload,
  PairedDevice,
  RegisterPayload,
  Session,
  SessionUser,
  UpdateMePayload,
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

/**
 * POST /auth/logout — сервер отзывает refresh-токен этой сессии. Токены на
 * устройстве стирает `signOut` сессии.
 */
export function logout(refreshToken: string) {
  return apiRequest<MessageResponse>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
    skipRefresh: true,
  });
}

/**
 * POST /auth/refresh — новая пара токенов (и пользователь) по refresh-токену;
 * старый refresh-токен больше не годится. 401 — refresh-токен отозван или
 * истёк: нужно войти заново.
 */
export function refreshSession(refreshToken: string) {
  return apiRequest<Session>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    skipRefresh: true,
  });
}

/**
 * POST /child-devices/pair — ребёнок подключает устройство одноразовым кодом
 * от родителя и получает свою сессию (`user.kind === 'child'`). 400 — код
 * неверен, истёк или уже использован.
 */
export function pairChildDevice(payload: PairDevicePayload) {
  return apiRequest<PairedDevice>('/child-devices/pair', {
    method: 'POST',
    body: payload,
  });
}

/**
 * PATCH /users/me — сменить своё отображаемое имя (родитель или ребёнок).
 * Пробелы по краям сервер обрезает, почта этой ручкой не меняется. 400 —
 * имя пустое или длиннее 100 символов.
 */
export function updateMe(payload: UpdateMePayload) {
  return apiRequest<SessionUser>('/users/me', {
    method: 'PATCH',
    body: payload,
  });
}

/**
 * POST /users/me/password — сменить пароль родителя. Текущая сессия
 * остаётся, остальные сессии аккаунта сервер отзывает. 400 —
 * `INVALID_CURRENT_PASSWORD` или `PASSWORD_SAME_AS_CURRENT`, 403 — у
 * ребёнка пароля нет, 429 — много попыток (`Retry-After`).
 */
export function changePassword(payload: ChangePasswordPayload) {
  return apiRequest<void>('/users/me/password', {
    method: 'POST',
    body: payload,
  });
}
