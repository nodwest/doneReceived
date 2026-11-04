export const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:3001';

/** Адрес REST API бэкенда, без слэша в конце. */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.divmaster.space/doneReceived';
