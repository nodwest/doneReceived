import { apiRequest, authorizedImage } from '@shared/api';
import { withTimeout } from '@shared/lib';
import type { Transaction } from '../model/wallet';

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

function fetchTransactions(
  familyId: string,
  limit: number,
  before?: string,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (before) query.set('before', before);
  return apiRequest<TransactionsDto>(
    `/families/${familyId}/wallet/transactions?${query.toString()}`,
    { signal },
  );
}

export async function fetchParentTransactionPage(
  familyId: string,
  limit: number,
  before: string | undefined,
  signal: AbortSignal,
) {
  const page = await fetchTransactions(familyId, limit, before, signal);
  return {
    transactions: mapTransactions(
      page.items,
      await fetchChildren(familyId, page.items, signal),
    ),
    next: page.next,
    balance: 0,
  };
}

function fetchChildren(
  familyId: string,
  items: TransactionsDto['items'],
  signal?: AbortSignal,
) {
  if (!items.some((item) => item.kind === 'payout')) return Promise.resolve([]);
  return withTimeout(
    apiRequest<ChildDto[]>(`/families/${familyId}/children`, {
      signal,
      timeoutMs: 5_000,
    }),
    [] as ChildDto[],
  );
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

function mapTransactions(
  historyItems: TransactionsDto['items'],
  children: ChildDto[],
) {
  return historyItems.map((item): Transaction => {
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
}
