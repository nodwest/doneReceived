import { apiRequest, authorizedImage } from '@shared/api';
import { withTimeout } from '@shared/lib';
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
    /** Слова дня: награда за порцию слов. */
    taskKind?: 'words' | null;
    /** Слова дня: номера первого и последнего слова порции. */
    words?: { from: number; to: number } | null;
  }[];
  next?: string | null;
};

/** Участники семьи — чтобы подписать, от кого награда, и показать фото. */
type MemberDto = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

/**
 * GET /families/:id/children/:childId/wallet — родитель видит кошелёк
 * ребёнка своей семьи, ребёнок — свой. Начисления становятся наградами
 * (`reward`): название задания — из начисления, от кого — имя одобрившего из
 * участников семьи (не ответили — имя пустое). Выводов на карту на сервере
 * нет.
 */
function fetchEntries(
  familyId: string,
  childId: string,
  limit: number,
  before?: string,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (before) query.set('before', before);
  return apiRequest<ChildWalletDto>(
    `/families/${familyId}/children/${childId}/wallet?${query.toString()}`,
    { signal },
  );
}

export async function fetchChildBalance(
  familyId: string,
  childId: string,
  signal: AbortSignal,
) {
  const { balancePoints } = await fetchEntries(
    familyId,
    childId,
    1,
    undefined,
    signal,
  );
  return Number(balancePoints);
}

function fetchMembers(familyId: string, signal?: AbortSignal) {
  return withTimeout(
    apiRequest<MemberDto[]>(`/families/${familyId}/members`, {
      signal,
      timeoutMs: 5_000,
    }),
    [] as MemberDto[],
  );
}

export async function fetchChildTransactionPage(
  familyId: string,
  childId: string,
  limit: number,
  before: string | undefined,
  signal: AbortSignal,
) {
  const page = await fetchEntries(familyId, childId, limit, before, signal);
  const members = page.entries.some((entry) => entry.approvedBy)
    ? await fetchMembers(familyId, signal)
    : [];
  return { ...mapChildWallet(page, members), next: page.next };
}

async function fetchAllEntries(familyId: string, childId: string) {
  const entries: ChildWalletDto['entries'] = [];
  let balancePoints = '0';
  let before: string | null | undefined;
  for (let page = 0; page < 20; page += 1) {
    const data = await fetchEntries(
      familyId,
      childId,
      100,
      before ?? undefined,
    );
    if (page === 0) balancePoints = data.balancePoints;
    entries.push(...data.entries);
    before = data.next;
    if (!before) break;
  }
  return { balancePoints, entries };
}

export async function fetchServerChildWallet(
  familyId: string,
  childId: string,
): Promise<ChildWallet> {
  const [wallet, members] = await Promise.all([
    fetchAllEntries(familyId, childId),
    fetchMembers(familyId),
  ]);
  return mapChildWallet(wallet, members);
}

function mapChildWallet(
  wallet: ChildWalletDto,
  members: MemberDto[],
): ChildWallet {
  const byId = new Map(members.map((member) => [member.userId, member]));
  const transactions: RewardTransaction[] = wallet.entries.map((entry) => ({
    id: entry.id,
    kind: 'reward' as const,
    amount: entry.points,
    at: entry.createdAt,
    task: entry.taskTitle,
    // Та же награда в истории (Rewards history) — с тем же id.
    operationId: entry.id,
    taskDoneAt: entry.submittedAt,
    words: entry.taskKind === 'words' ? (entry.words ?? null) : null,
    from: (() => {
      const member = entry.approvedBy ? byId.get(entry.approvedBy) : null;
      return {
        id: entry.approvedBy ?? '',
        name: member?.displayName ?? '',
        avatar: member?.avatarUrl ? authorizedImage(member.avatarUrl) : null,
      };
    })(),
  }));
  return { balance: Number(wallet.balancePoints), transactions };
}
