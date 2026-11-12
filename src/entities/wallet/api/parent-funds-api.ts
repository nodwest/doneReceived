import { apiRequest } from '@shared/api';
import { getParentFunds, type ParentFunds } from '../model/funds';

/**
 * Кошелёк родителя на сервере: `balancePoints` — свободно после резерва,
 * `reservedPoints` — обещано за ещё не выплаченные назначения. Баллы — строки
 * с целым числом, 1 балл = $1.
 */
type ParentWalletDto = {
  balancePoints: string;
  reservedPoints: string;
};

const toFunds = ({ balancePoints, reservedPoints }: ParentWalletDto) => {
  const available = Number(balancePoints);
  const reserved = Number(reservedPoints);
  return getParentFunds(available + reserved, reserved);
};

/**
 * GET /families/:id/wallet — деньги вошедшего родителя (кошелёк у каждого
 * родителя свой; familyId только в адресе).
 */
export async function fetchParentFunds(familyId: string): Promise<ParentFunds> {
  return toFunds(
    await apiRequest<ParentWalletDto>(`/families/${familyId}/wallet`),
  );
}

/**
 * POST /families/:id/wallet/deposit — ВРЕМЕННОЕ тестовое пополнение
 * условными деньгами (целые $1–$1 000 000), пока нет настоящих платежей.
 * 404 — на сервере пополнение выключено, 400 `INVALID_AMOUNT`.
 */
export async function depositFunds(
  familyId: string,
  amount: number,
): Promise<ParentFunds> {
  return toFunds(
    await apiRequest<ParentWalletDto>(`/families/${familyId}/wallet/deposit`, {
      method: 'POST',
      body: { amount },
    }),
  );
}
