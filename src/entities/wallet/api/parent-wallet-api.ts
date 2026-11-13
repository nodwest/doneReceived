import { apiRequest, authorizedImage } from '@shared/api';
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
};

/** Дети семьи — только чтобы подписать выплаты именем. */
type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

/**
 * GET /families/:id/wallet/transactions и свободный баланс GET
 * /families/:id/wallet. Выплата ведёт в историю наград по id назначения
 * (`operationId`), у пополнений и выводов карты нет.
 */
export async function fetchServerWallet(familyId: string): Promise<Wallet> {
  const [history, funds, children] = await Promise.all([
    apiRequest<TransactionsDto>(`/families/${familyId}/wallet/transactions`),
    apiRequest<{ balancePoints: string }>(`/families/${familyId}/wallet`),
    apiRequest<ChildDto[]>(`/families/${familyId}/children`).catch(
      () => [] as ChildDto[],
    ),
  ]);
  const transactions = history.items.map((item, index): Transaction => {
    const base = {
      // Экраны ключуют транзакции числом: номер по порядку в ответе.
      id: index + 1,
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
