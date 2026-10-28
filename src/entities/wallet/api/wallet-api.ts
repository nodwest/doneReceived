import type { Wallet } from '../model/wallet';
import { mockServer } from './mock-server';

// Эндпоинты кошелька. Пока бэкенда нет, тело ходит в mockServer; с API здесь
// будет запрос (GET /wallet), сигнатура и остальной код не меняются.

export async function fetchWallet(): Promise<Wallet> {
  return mockServer.wallet();
}
