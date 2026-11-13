import type { ChildWallet, Wallet } from '../model/wallet';
import { fetchServerChildWallet } from './child-wallet-api';
import { fetchServerWallet } from './parent-wallet-api';

// Эндпоинты кошелька: транзакции родителя и кошельки детей — с сервера.

/** Транзакции вошедшего родителя; без семьи — пусто. */
export async function fetchWallet(familyId: string | null): Promise<Wallet> {
  if (!familyId) return { balance: 0, transactions: [] };
  return fetchServerWallet(familyId);
}

/** Кошелёк ребёнка семьи: баланс, награды и выводы. */
export async function fetchChildWallet(
  childId: string,
  familyId: string | null,
): Promise<ChildWallet> {
  if (!familyId) throw new Error('No family');
  return fetchServerChildWallet(familyId, childId);
}
