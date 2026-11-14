import { apiRequest } from '@shared/api';
import { appendPhoto, type PickedPhoto } from '@shared/lib';
import type {
  ChangePasswordPayload,
  LoginPayload,
  MessageResponse,
  PairDevicePayload,
  PairedDevice,
  RegisterPayload,
  RequestEmailChangePayload,
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

/**
 * POST /users/me/email — сменить почту родителя: новый адрес становится
 * ожидающим (`pendingEmail` в GET /users/me), на него уходит письмо с кодом
 * и ссылкой. До подтверждения вход и письма — по старой почте. Повторный
 * запрос заменяет ожидающий адрес, прежние код и ссылка гаснут. 400 —
 * неверный адрес, `INVALID_CURRENT_PASSWORD`, `EMAIL_SAME_AS_CURRENT`;
 * 409 `EMAIL_TAKEN`; 403 — у ребёнка почты нет; 429 — много попыток
 * (`Retry-After`, общий лимит со сменой пароля).
 */
export function requestEmailChange(payload: RequestEmailChangePayload) {
  return apiRequest<MessageResponse>('/users/me/email', {
    method: 'POST',
    body: payload,
  });
}

/**
 * POST /users/me/email/confirm — подтвердить новую почту кодом из письма.
 * Ответ — профиль с новой почтой и `pendingEmail: null`. Текущая сессия
 * остаётся, остальные сессии аккаунта сервер отзывает, на старую почту
 * уходит письмо «Это был не я». 400 — `INVALID_CODE` (`attemptsLeft` в
 * теле) или `CODE_EXPIRED`; 404 — смены нет; 409 `EMAIL_TAKEN` — адрес
 * успели занять.
 */
export function confirmEmailChange(code: string) {
  return apiRequest<SessionUser>('/users/me/email/confirm', {
    method: 'POST',
    body: { code },
  });
}

/**
 * POST /users/me/email/resend — письмо на ожидающий адрес ещё раз (прежние
 * код и ссылка гаснут). Не чаще раза в 60 с: иначе 429 с `Retry-After`.
 * 404 — смены нет.
 */
export function resendEmailChange() {
  return apiRequest<MessageResponse>('/users/me/email/resend', {
    method: 'POST',
  });
}

/**
 * PUT /users/me/avatar — поставить или заменить своё фото: multipart, поле
 * `photo`, PNG/JPEG/WebP до 2 МиБ. Ответ — профиль с новым `avatarUrl`.
 * 413 — файл велик, 503 — сервер занят обработкой фото.
 */
export async function uploadMyAvatar(photo: PickedPhoto) {
  const form = new FormData();
  await appendPhoto(form, 'photo', photo);
  return apiRequest<SessionUser>('/users/me/avatar', {
    method: 'PUT',
    body: form,
  });
}

/** DELETE /users/me/avatar — убрать своё фото (вместо него — буква). */
export function deleteMyAvatar() {
  return apiRequest<null>('/users/me/avatar', { method: 'DELETE' });
}
