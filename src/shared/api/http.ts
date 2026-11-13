import { API_URL } from '../config';

/**
 * Ошибка запроса к API. `status` — HTTP-код, 0 — до сервера не достучались
 * (нет сети, сервер недоступен, на вебе — запрос заблокирован CORS).
 * `messages` — тексты ошибок от сервера: NestJS отдаёт `message` строкой
 * или массивом (ошибки валидации полей). `data` — всё тело ответа (там
 * бывают свои поля, например `attemptsLeft`). `retryAfter` — через сколько
 * секунд можно повторить (заголовок `Retry-After` у 429), иначе null.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];
  readonly data: unknown;
  readonly retryAfter: number | null;

  constructor(
    status: number,
    messages: string[],
    data: unknown = null,
    retryAfter: number | null = null,
  ) {
    super(messages[0] ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
    this.data = data;
    this.retryAfter = retryAfter;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** JSON-тело; FormData — multipart с файлами. */
  body?: unknown;
  /**
   * Не обновлять токены при 401: сам запрос обновления и выход — их 401
   * значит «сессии нет», повторять нечего.
   */
  skipRefresh?: boolean;
};

// Токен доступа подставляет сессия: shared не знает, где он хранится.
let getAccessToken: () => string | null = () => null;

/** Откуда брать токен для заголовка `Authorization: Bearer …`. */
export function setAccessTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

/**
 * Картинка API для `<Image>`: относительный адрес дополняется API_URL,
 * запрос идёт с Bearer-токеном (без него сервер ответит 401). Адрес с
 * токеном не логируем.
 */
export function authorizedImage(url: string) {
  const token = getAccessToken();
  return {
    uri: /^https?:\/\//i.test(url) ? url : `${API_URL}${url}`,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}

// Обновление токенов подставляет сессия: true — новая пара сохранена.
let refreshTokens: (() => Promise<boolean>) | null = null;
// Идущее обновление: несколько запросов с протухшим токеном ждут одно.
let refreshing: Promise<boolean> | null = null;

/**
 * Как обновить токены, когда сервер ответил 401 на запрос с токеном. Вызов
 * один на все одновременные 401; после него запрос повторяется один раз.
 */
export function setTokenRefresher(refresher: () => Promise<boolean>) {
  refreshTokens = refresher;
}

function refreshOnce(refresher: () => Promise<boolean>) {
  refreshing ??= refresher().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/**
 * Запрос к API: JSON туда и обратно, ошибки — `ApiError`. Токен устарел
 * (401 на запрос с токеном) — обновляем токены и повторяем запрос один раз;
 * не вышло — отдаём 401.
 */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, skipRefresh }: RequestOptions = {},
): Promise<T> {
  const send = async (token: string | null) => {
    const headers: Record<string, string> = { Accept: 'application/json' };
    // FormData (файлы) уходит как есть: границу multipart fetch проставит сам.
    const form = body instanceof FormData;
    if (body !== undefined && !form) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      return await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: form
          ? body
          : body === undefined
            ? undefined
            : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(0, []);
    }
  };

  const token = getAccessToken();
  let response = await send(token);
  if (response.status === 401 && token && !skipRefresh && refreshTokens) {
    // Пока запрос шёл, токены могли уже обновить — тогда сразу повторяем.
    const fresh =
      getAccessToken() !== token || (await refreshOnce(refreshTokens));
    const next = getAccessToken();
    if (fresh && next) response = await send(next);
  }

  const text = await response.text();
  const data: unknown = text ? safeParse(text) : null;
  // В разработке — каждый запрос в консоль: видно, что ушло и что ответили.
  if (__DEV__) {
    console.log(`[api] ${method} ${path} → ${response.status}`, data);
  }
  if (!response.ok) {
    throw new ApiError(
      response.status,
      errorMessages(data),
      data,
      parseRetryAfter(response.headers.get('Retry-After')),
    );
  }
  return data as T;
}

/** `Retry-After`: секунды или дата HTTP; в секундах, иначе null. */
function parseRetryAfter(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(seconds, 0);
  const date = Date.parse(value);
  return Number.isNaN(date) ? null : Math.max((date - Date.now()) / 1000, 0);
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorMessages(data: unknown): string[] {
  if (data && typeof data === 'object' && 'message' in data) {
    const { message } = data as { message: unknown };
    if (Array.isArray(message)) return message.map(String);
    if (typeof message === 'string') return [message];
  }
  return [];
}
