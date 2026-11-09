import type { ChildWallet, PayoutPayload, Wallet } from '../model/wallet';
import { mockServer } from './mock-server';

// Эндпоинты кошелька. Пока бэкенда нет, тело ходит в mockServer; с API здесь
// будут запросы (GET /wallet, GET /children/:id/wallet; выплату при
// подтверждении задания сервер проведёт сам), сигнатуры и остальной код не
// меняются.

export async function fetchWallet(): Promise<Wallet> {
  return mockServer.wallet();
}

export async function fetchChildWallet(childId: number): Promise<ChildWallet> {
  return mockServer.childWallet(childId);
}

/** Выплата за подтверждённое задание: родитель → ребёнок. */
export async function payReward(payload: PayoutPayload): Promise<void> {
  mockServer.payout(payload);
}
