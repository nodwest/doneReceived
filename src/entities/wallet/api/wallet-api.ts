import type { ChildWallet, Wallet } from '../model/wallet';
import { mockServer } from './mock-server';

// Эндпоинты кошелька. Пока бэкенда нет, тело ходит в mockServer; с API здесь
// будут запросы (GET /wallet, GET /children/:id/wallet), сигнатуры и
// остальной код не меняются.

export async function fetchWallet(): Promise<Wallet> {
  return mockServer.wallet();
}

export async function fetchChildWallet(childId: number): Promise<ChildWallet> {
  return mockServer.childWallet(childId);
}
