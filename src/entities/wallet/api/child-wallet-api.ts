import { apiRequest } from '@shared/api';
import type { ChildWallet, RewardTransaction } from '../model/wallet';

/**
 * Кошелёк ребёнка на сервере: баланс строкой с целым числом баллов (1 балл
 * = $1) и до 100 последних начислений — каждое за одобренное назначение.
 */
type ChildWalletDto = {
  balancePoints: string;
  entries: {
    id: string;
    assignmentId: string;
    points: number;
    createdAt: string;
  }[];
};

/** Назначения семьи — только чтобы подписать начисления названием задания. */
type TaskItemDto = {
  task: { title: string };
  assignment: { id: string };
};

/**
 * GET /families/:id/children/:childId/wallet — родитель видит кошелёк
 * ребёнка своей семьи, ребёнок — свой. Начисления становятся наградами
 * (`reward`): название задания — из GET /families/:id/tasks по назначению.
 * Кто дал задание, пока не знаем (имя пустое), истории наград у них нет,
 * выводов на карту на сервере нет.
 */
export async function fetchServerChildWallet(
  familyId: string,
  childId: string,
): Promise<ChildWallet> {
  const [wallet, tasks] = await Promise.all([
    apiRequest<ChildWalletDto>(
      `/families/${familyId}/children/${childId}/wallet`,
    ),
    apiRequest<TaskItemDto[]>(`/families/${familyId}/tasks`).catch(
      () => [] as TaskItemDto[],
    ),
  ]);
  const titles = new Map(
    tasks.map(({ task, assignment }) => [assignment.id, task.title]),
  );
  const transactions: RewardTransaction[] = wallet.entries
    .map((entry, index) => ({
      // Экраны ключуют транзакции числом: номер по порядку в ответе.
      id: index + 1,
      kind: 'reward' as const,
      amount: entry.points,
      at: entry.createdAt,
      task: titles.get(entry.assignmentId) ?? '—',
      operationId: null,
      taskDoneAt: null,
      from: { id: 0, name: '', avatar: null },
    }))
    .sort((a, b) => b.at.localeCompare(a.at));
  return { balance: Number(wallet.balancePoints), transactions };
}
