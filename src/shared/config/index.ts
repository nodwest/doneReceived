/** Адрес REST API бэкенда, без слэша в конце. */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.divmaster.space/doneReceived';

const wsBaseUrl = (
  process.env.EXPO_PUBLIC_WS_URL ?? API_URL.replace(/^http/, 'ws')
).replace(/\/+$/, '');

export const WS_URL = `${wsBaseUrl}/`;
export const LOCATION_WS_URL = `${wsBaseUrl}/location`;
