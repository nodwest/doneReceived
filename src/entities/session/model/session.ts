/** Пользователь, который вошёл: приходит в ответе логина. */
export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  /** Статус аккаунта, например `active`. */
  status: string;
};

/** Сессия: токены и пользователь из ответа POST /auth/login. */
export type Session = {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
};

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyEmailPayload = {
  email: string;
  /** Шесть символов из письма, например A1B2C3. */
  code: string;
};

/** Ответ сервера без данных: только текст результата. */
export type MessageResponse = {
  message: string;
};
