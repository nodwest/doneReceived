/** Родитель или ребёнок: какой интерфейс показывать. */
export type AccountKind = 'parent' | 'child';

/** Семья вошедшего и его роль в ней (owner / admin / member). */
export type SessionFamily = {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
};

/**
 * Пользователь, который вошёл: приходит в ответе логина, обновления токенов
 * и подключения устройства ребёнка.
 */
export type SessionUser = {
  id: string;
  /** У детского аккаунта почты нет. */
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  /** Статус аккаунта, например `active`. */
  status: string;
  /** Сессии, сохранённые до появления поля на сервере, его не содержат. */
  kind?: AccountKind;
  /** Семья на момент входа; null — семьи ещё нет. */
  family?: SessionFamily | null;
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

/** Подключение устройства ребёнка: код от родителя и название устройства. */
export type PairDevicePayload = {
  /** 8 символов без дефиса. */
  code: string;
  /** Как устройство увидит родитель в списке, например «Chrome · macOS». */
  label: string;
};

/** Ответ POST /child-devices/pair: сессия ребёнка и его устройство. */
export type PairedDevice = Session & {
  deviceId: string;
  childId: string;
};

/** Ответ сервера без данных: только текст результата. */
export type MessageResponse = {
  message: string;
};
