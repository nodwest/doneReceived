import { API_URL } from '../config';

/**
 * Ошибка запроса к API. `status` — HTTP-код, 0 — до сервера не достучались
 * (нет сети, сервер недоступен, на вебе — запрос заблокирован CORS).
 * `messages` — тексты ошибок от сервера: NestJS отдаёт `message` строкой
 * или массивом (ошибки валидации полей).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

// Токен доступа подставляет сессия: shared не знает, где он хранится.
let getAccessToken: () => string | null = () => null;

/** Откуда брать токен для заголовка `Authorization: Bearer …`. */
export function setAccessTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

/** Запрос к API: JSON туда и обратно, ошибки — `ApiError`. */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, []);
  }

  const text = await response.text();
  const data: unknown = text ? safeParse(text) : null;
  if (!response.ok) throw new ApiError(response.status, errorMessages(data));
  return data as T;
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
