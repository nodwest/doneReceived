import { apiRequest } from '@shared/api';
import type { ChildWallet, RewardTransaction } from '../model/wallet';

/**
 * Кошелёк ребёнка на сервере: баланс строкой с целым числом баллов (1 балл
 * = $1) и до 100 последних начислений — каждое за одобренное назначение, с
 * названием задания и тем, кто его одобрил.
 */
type ChildWalletDto = {
  balancePoints: string;
  entries: {
    id: string;
    assignmentId: string;
    points: number;
    createdAt: string;
    /** Название задания на момент запроса истории. */
    taskTitle: string;
    /** userId родителя, который одобрил отчёт. */
    approvedBy: string | null;
    /** Когда сдан одобренный отчёт. */
    submittedAt: string | null;
  }[];
};

/** Участники семьи — только чтобы подписать, от кого награда. */
type MemberDto = { userId: string; displayName: string };

/**
 * GET /families/:id/children/:childId/wallet — родитель видит кошелёк
 * ребёнка своей семьи, ребёнок — свой. Начисления становятся наградами
 * (`reward`): название задания — из начисления, от кого — имя одобрившего из
 * участников семьи (не ответили — имя пустое). Выводов на карту на сервере
 * нет.
 */
export async function fetchServerChildWallet(
  familyId: string,
  childId: string,
): Promise<ChildWallet> {
  const [wallet, members] = await Promise.all([
    apiRequest<ChildWalletDto>(
      `/families/${familyId}/children/${childId}/wallet`,
    ),
    apiRequest<MemberDto[]>(`/families/${familyId}/members`).catch(
      () => [] as MemberDto[],
    ),
  ]);
  const names = new Map(
    members.map((member) => [member.userId, member.displayName]),
  );
  const transactions: RewardTransaction[] = wallet.entries
    .map((entry, index) => ({
      // Экраны ключуют транзакции числом: номер по порядку в ответе.
      id: index + 1,
      kind: 'reward' as const,
      amount: entry.points,
      at: entry.createdAt,
      task: entry.taskTitle,
      // Та же награда в истории (Rewards history) — с тем же id.
      operationId: entry.id,
      taskDoneAt: entry.submittedAt,
      from: {
        id: entry.approvedBy ?? '',
        name: (entry.approvedBy && names.get(entry.approvedBy)) || '',
        avatar: null,
      },
    }))
    .sort((a, b) => b.at.localeCompare(a.at));
  return { balance: Number(wallet.balancePoints), transactions };
}
