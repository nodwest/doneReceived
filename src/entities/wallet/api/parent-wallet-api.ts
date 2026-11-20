import { apiRequest, authorizedImage } from '@shared/api';
import { withTimeout } from '@shared/lib';
import type { Transaction, Wallet } from '../model/wallet';

/**
 * Денежные движения вошедшего родителя в семье: пополнения, выплаты детям и
 * выводы, новые первыми (до 100 за запрос). Резерв и его возврат сюда не
 * попадают. `balanceAfter` — свободный баланс сразу после операции.
 */
type TransactionsDto = {
  items: {
    id: string;
    kind: 'payout' | 'deposit' | 'withdrawal';
    points: number;
    createdAt: string;
    balanceAfter: number;
    /** Только у payout: за какое назначение, кому и как называлось задание. */
    assignmentId: string | null;
    childId: string | null;
    taskTitle: string | null;
  }[];
  next?: string | null;
};

/** Дети семьи — только чтобы подписать выплаты именем. */
type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

/**
 * GET /families/:id/wallet/transactions и свободный баланс GET
 * /families/:id/wallet. Выплата ведёт в историю наград по id назначения
 * (`operationId`), у пополнений и выводов карты нет.
 */
/** Все страницы истории родителя; ограничение защищает от бесконечного цикла. */
async function fetchAllTransactions(
  familyId: string,
): Promise<TransactionsDto['items']> {
  const items: TransactionsDto['items'] = [];
  let before: string | null | undefined;
  for (let page = 0; page < 20; page += 1) {
    const query = new URLSearchParams({ limit: '100' });
    if (before) query.set('before', before);
    const data = await apiRequest<TransactionsDto>(
      `/families/${familyId}/wallet/transactions?${query.toString()}`,
    );
    items.push(...data.items);
    before = data.next;
    if (!before) break;
  }
  return items;
}

/** Сумма выплат родителю за всё время — серверный агрегат, не страница истории. */
export function fetchParentPaidTotal(familyId: string, parentId?: string) {
  const query = parentId
    ? `?${new URLSearchParams({ parentId }).toString()}`
    : '';
  return apiRequest<{ points: string }>(
    `/families/${familyId}/wallet/paid-total${query}`,
  );
}

export async function fetchServerWallet(familyId: string): Promise<Wallet> {
  const [historyItems, funds, children] = await Promise.all([
    fetchAllTransactions(familyId),
    apiRequest<{ balancePoints: string }>(`/families/${familyId}/wallet`),
    // Имена детей — подпись выплат; без них история всё равно показывается.
    withTimeout(
      apiRequest<ChildDto[]>(`/families/${familyId}/children`),
      [] as ChildDto[],
    ),
  ]);
  const transactions = historyItems.map((item): Transaction => {
    const base = {
      id: item.id,
      amount: item.points,
      at: item.createdAt,
      balanceAfter: item.balanceAfter,
    };
    if (item.kind === 'payout') {
      const child = children.find((entry) => entry.id === item.childId);
      return {
        ...base,
        kind: 'payout',
        task: item.taskTitle ?? '—',
        operationId: item.assignmentId ?? '',
        taskDoneAt: null,
        child: {
          id: item.childId ?? '',
          name: child?.displayName ?? '—',
          avatar: child?.avatarUrl ? authorizedImage(child.avatarUrl) : null,
        },
      };
    }
    return { ...base, kind: item.kind, card: null };
  });
  return { balance: Number(funds.balancePoints), transactions };
}
