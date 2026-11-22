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

/** Код ошибки сервера из поля `code` тела ответа; нет — null. */
export const apiErrorCode = (error: ApiError): string | null => {
  const { data } = error;
  if (!data || typeof data !== 'object' || !('code' in data)) return null;
  const { code } = data as { code: unknown };
  return typeof code === 'string' ? code : null;
};

/**
 * Сервер ответил этим кодом ошибки: в поле `code` или в начале текста
 * `message` («EMAIL_TAKEN» или «EMAIL_TAKEN. Адрес уже занят…»).
 */
export const hasApiErrorCode = (error: ApiError, code: string) =>
  apiErrorCode(error) === code ||
  error.messages.some(
    (message) => message === code || new RegExp(`^${code}\\b`).test(message),
  );

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** JSON-тело; FormData — multipart с файлами. */
  body?: unknown;
  /**
   * Не обновлять токены при 401: сам запрос обновления и выход — их 401
   * значит «сессии нет», повторять нечего.
   */
  skipRefresh?: boolean;
  /** Свой таймаут; по умолчанию GET — 15 с, изменения — 60 с, файлы — 120 с. */
  timeoutMs?: number;
  signal?: AbortSignal;
};

// Зависший запрос не должен оставлять экран в вечной загрузке: обрываем
// соединение, а React Query повторит запрос.
const GET_TIMEOUT_MS = 15_000;
const MUTATION_TIMEOUT_MS = 60_000;
const UPLOAD_TIMEOUT_MS = 120_000;

// Токен доступа подставляет сессия: shared не знает, где он хранится.
let getAccessToken: () => string | null = () => null;
let getSessionScope: () => symbol | undefined = () => undefined;

/** Откуда брать токен для заголовка `Authorization: Bearer …`. */
export function setAccessTokenGetter(
  getter: () => string | null,
  scope: () => symbol,
) {
  getAccessToken = getter;
  getSessionScope = scope;
}

/**
 * Картинка API для `<Image>`: относительный адрес дополняется API_URL,
 * запрос идёт с Bearer-токеном (без него сервер ответит 401). Адрес с
 * токеном не логируем.
 */
export function authorizedImage(url: string): {
  uri: string;
  headers: Record<string, string> | undefined;
} {
  const token = getAccessToken();
  const absolute = /^https?:\/\//i.test(url)
    ? (fromParentDomain(url) ?? url)
    : apiUrlFor(url);
  let trustedApiUrl = false;
  try {
    const target = new URL(absolute);
    trustedApiUrl =
      /^https?:$/.test(target.protocol) &&
      !target.username &&
      !target.password &&
      target.origin === new URL(API_URL).origin;
  } catch {
    // Некорректный URL не получает заголовок авторизации.
  }
  // Заголовки есть у любой картинки нашего API, даже если токена ещё нет:
  // ApiImage подставит текущий токен при загрузке.
  return {
    uri: absolute,
    headers: trustedApiUrl
      ? token
        ? { Authorization: `Bearer ${token}` }
        : {}
      : undefined,
  };
}

/**
 * Сервер отдаёт `avatarUrl` с хостом сайта, а не API
 * (`https://divmaster.space/users/avatars/…` вместо
 * `https://api.divmaster.space/doneReceived/users/avatars/…`): туда без
 * токена — 401, а токен на чужой хост мы не шлём. Адрес на родительском
 * домене API переводим на сам API; остальные не трогаем.
 */
function fromParentDomain(url: string) {
  try {
    const target = new URL(url);
    const api = new URL(API_URL);
    if (target.origin === api.origin) return null;
    if (!api.hostname.endsWith(`.${target.hostname}`)) return null;
    return apiUrlFor(`${target.pathname}${target.search}`);
  } catch {
    return null;
  }
}

/**
 * Относительный адрес API → полный. Адрес уже с базовым путём API
 * (`/doneReceived/users/avatars/…`) не получает его второй раз.
 */
function apiUrlFor(path: string) {
  try {
    const base = new URL(API_URL);
    const prefix = base.pathname.replace(/\/$/, '');
    if (prefix && (path === prefix || path.startsWith(`${prefix}/`))) {
      return `${base.origin}${path}`;
    }
  } catch {
    // API_URL без схемы — просто склеиваем.
  }
  return `${API_URL}${path}`;
}

// Обновление токенов подставляет сессия: true — новая пара сохранена.
let refreshTokens: (() => Promise<boolean>) | null = null;
// Идущее обновление: несколько запросов с протухшим токеном ждут одно.
let refreshing: {
  scope: symbol | undefined;
  promise: Promise<boolean>;
} | null = null;

/**
 * Как обновить токены, когда сервер ответил 401 на запрос с токеном. Вызов
 * один на все одновременные 401; после него запрос повторяется один раз.
 */
export function setTokenRefresher(refresher: () => Promise<boolean>) {
  refreshTokens = refresher;
}

function refreshOnce(
  refresher: () => Promise<boolean>,
  scope: symbol | undefined,
) {
  if (refreshing?.scope === scope && refreshing) return refreshing.promise;
  const promise = refresher().finally(() => {
    if (refreshing?.promise === promise) refreshing = null;
  });
  refreshing = { scope, promise };
  return promise;
}

/** Текущий токен доступа или null (не вошли). */
export const currentAccessToken = () => getAccessToken();

/**
 * Сервер не принял токен `stale` вне `apiRequest` (сокет закрыт с 4401):
 * обновить токены тем же единственным вызовом, что и у запросов, — иначе
 * один refresh-токен ушёл бы дважды. Токен уже сменили — сразу true.
 */
export async function refreshAccessToken(stale: string) {
  if (getAccessToken() !== stale) return getAccessToken() !== null;
  return refreshTokens ? refreshOnce(refreshTokens, getSessionScope()) : false;
}

/**
 * Запрос к API: JSON туда и обратно, ошибки — `ApiError`. Токен устарел
 * (401 на запрос с токеном) — обновляем токены и повторяем запрос один раз;
 * не вышло — отдаём 401.
 */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, skipRefresh, timeoutMs, signal }: RequestOptions = {},
): Promise<T> {
  const send = async (token: string | null) => {
    const headers: Record<string, string> = { Accept: 'application/json' };
    // FormData (файлы) уходит как есть: границу multipart fetch проставит сам.
    const form = body instanceof FormData;
    if (body !== undefined && !form) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) headers.Authorization = `Bearer ${token}`;
    const timeout =
      timeoutMs ??
      (form
        ? UPLOAD_TIMEOUT_MS
        : method === 'GET'
          ? GET_TIMEOUT_MS
          : MUTATION_TIMEOUT_MS);
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(abort, timeout);
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        signal: controller.signal,
        body: form
          ? body
          : body === undefined
            ? undefined
            : JSON.stringify(body),
      });
      return { response, text: await response.text() };
    } catch {
      throw new ApiError(0, []);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  };

  const token = getAccessToken();
  const scope = getSessionScope();
  let result = await send(token);
  if (
    result.response.status === 401 &&
    !signal?.aborted &&
    token &&
    !skipRefresh &&
    refreshTokens &&
    getSessionScope() === scope
  ) {
    // Пока запрос шёл, токены могли уже обновить — тогда сразу повторяем.
    const fresh =
      getAccessToken() !== token || (await refreshOnce(refreshTokens, scope));
    const next = getAccessToken();
    if (fresh && next && !signal?.aborted && getSessionScope() === scope)
      result = await send(next);
  }

  const { response, text } = result;
  if (signal?.aborted || (token && getSessionScope() !== scope))
    throw new ApiError(0, []);
  const data: unknown = text ? safeParse(text) : null;
  // Тела ответов могут содержать токены, коды и персональные данные.
  if (__DEV__) {
    console.log(`[api] ${method} → ${response.status}`);
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
export function parseRetryAfter(value: string | null): number | null {
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
