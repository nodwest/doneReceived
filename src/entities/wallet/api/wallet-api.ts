import type { ChildWallet } from '../model/wallet';
import { fetchServerChildWallet } from './child-wallet-api';

export async function fetchChildWallet(
  childId: string,
  familyId: string | null,
): Promise<ChildWallet> {
  if (!familyId) throw new Error('No family');
  return fetchServerChildWallet(familyId, childId);
}
