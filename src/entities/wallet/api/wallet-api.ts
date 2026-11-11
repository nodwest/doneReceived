import type { ChildWallet, PayoutPayload, Wallet } from '../model/wallet';
import { fetchServerChildWallet } from './child-wallet-api';
import { mockServer } from './mock-server';

// Эндпоинты кошелька. Кошелёк ребёнка с сервера (его id — UUID) — из API,
// моковых Emma и Liam и история транзакций родителя — из mockServer.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fetchWallet(): Promise<Wallet> {
  return mockServer.wallet();
}

/**
 * Кошелёк ребёнка: с сервера (UUID и есть семья) или моковый (id — число
 * строкой).
 */
export async function fetchChildWallet(
  childId: string,
  familyId: string | null,
): Promise<ChildWallet> {
  if (UUID.test(childId)) {
    if (!familyId) throw new Error('No family');
    return fetchServerChildWallet(familyId, childId);
  }
  return mockServer.childWallet(Number(childId));
}

/** Выплата за подтверждённое задание: родитель → ребёнок. */
export async function payReward(payload: PayoutPayload): Promise<void> {
  mockServer.payout(payload);
}
