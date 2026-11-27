import { apiRequest, authorizedImage, isApiError } from '@shared/api';
import { withTimeout } from '@shared/lib';
import type { Operation } from '../model/operation';

// История наград детей с сервера: заработанные — начисления из кошельков
// детей (с названием, описанием, кто одобрил, когда сдано и комментарием),
// упущенные — назначения, не сданные к сроку или закрытые отказом без
// переделки (GET …/missed-tasks).

/** Кто смотрит историю. */
export type OperationsViewer = {
  familyId: string;
  /** id аккаунта вошедшего. */
  userId: string;
  /** Вошёл ребёнок: только его история (список детей ему закрыт). */
  child?: { id: string; name: string; avatarUrl: string | null };
};

type WalletDto = {
  entries: {
    id: string;
    assignmentId: string;
    points: number;
    balanceAfterPoints?: string;
    createdAt: string;
    /** Название и описание задания на момент запроса истории. */
    taskTitle: string;
    taskDescription: string | null;
    /** userId родителя, который одобрил (он же автор задания). */
    approvedBy: string | null;
    /** Когда сдан одобренный отчёт. */
    submittedAt: string | null;
    /** Комментарий ребёнка к одобренному отчёту; null — не писал. */
    submissionNote: string | null;
    /** Фото одобренного отчёта, у которых не истёк срок хранения. */
    attachmentIds?: string[];
  }[];
  next?: string | null;
};

type MissedItemDto = {
  assignmentId: string;
  taskTitle: string;
  taskDescription: string | null;
  rewardPoints: number;
  /** Срок задания; у закрытого отказом мог не быть. */
  deadlineAt: string | null;
  /** Когда истекло; null — закрыто отказом. */
  expiredAt: string | null;
  /** userId родителя, создавшего задание. */
  createdBy: string;
  /** Почему упущено: не успел к сроку или закрыто отказом без переделки. */
  reason: 'expired' | 'rejected';
  /** Когда упущено: expiredAt или время закрывающего отказа. */
  closedAt: string;
  /** Последний отказ: у rejected — закрывающий, у expired — прошлый, если был. */
  lastRejection: {
    reasonCode: 'not_done_properly' | 'not_finished' | 'other';
    comment: string | null;
    reviewedBy: string;
    reviewedAt: string;
  } | null;
};

/** Код причины отказа на сервере → ключ причины в приложении. */
const REJECT_REASONS = {
  not_done_properly: 'not-done-properly',
  not_finished: 'not-finished',
  other: 'other',
} as const;

type MissedDto = {
  items: MissedItemDto[];
  /** Курсор следующей страницы; null — больше нет. */
  next?: string | null;
};

/** Сколько страниц упущенных читаем за раз (по 100). */
const MISSED_MAX_PAGES = 10;

/** Все упущенные ребёнка, страницами по курсору; ошибка — пусто. */
async function fetchMissed(familyId: string, childId: string) {
  const items: MissedItemDto[] = [];
  let before: string | null | undefined;
  try {
    for (let page = 0; page < MISSED_MAX_PAGES; page += 1) {
      const query = before ? `?before=${encodeURIComponent(before)}` : '';
      const data = await apiRequest<MissedDto>(
        `/families/${familyId}/children/${childId}/missed-tasks${query}`,
      );
      items.push(...data.items);
      before = data.next;
      if (!before) break;
    }
  } catch {
    // Что успели прочитать — показываем.
  }
  return items;
}

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

export async function fetchServerOperations(
  viewer: OperationsViewer,
): Promise<Operation[]> {
  const { familyId } = viewer;
  const children: ChildDto[] = viewer.child
    ? [
        {
          id: viewer.child.id,
          displayName: viewer.child.name,
          avatarUrl: viewer.child.avatarUrl,
        },
      ]
    : await withTimeout(
        apiRequest<ChildDto[]>(`/families/${familyId}/children`),
        [] as ChildDto[],
      );
  // По каждому ребёнку — кошелёк и упущенные; не ответили — у ребёнка пусто.
  const histories = await Promise.all(
    children.map((child) =>
      Promise.all([
        apiRequest<WalletDto>(
          `/families/${familyId}/children/${child.id}/wallet`,
        ).catch(() => ({ entries: [] }) as WalletDto),
        fetchMissed(familyId, child.id),
      ]),
    ),
  );
  return children.flatMap((child, index) => {
    const [wallet, missed] = histories[index];
    const earned = wallet.entries.map((entry) =>
      toEarned(entry, child, familyId),
    );
    return [...earned, ...missed.map((item) => toMissed(item, child))];
  });
}

function toMissed(item: MissedItemDto, child: ChildDto): Operation {
  const rejected = item.lastRejection;
  return {
    id: item.assignmentId,
    kind: 'missed',
    title: item.taskTitle,
    description: item.taskDescription ?? '',
    amount: item.rewardPoints,
    child: toOperationChild(child),
    parentId: item.createdBy,
    at: item.closedAt,
    doneAt: null,
    photos: [],
    note: null,
    assignmentId: item.assignmentId,
    dueAt: item.deadlineAt,
    missedReason: item.reason,
    rejection: rejected
      ? {
          reason: REJECT_REASONS[rejected.reasonCode] ?? 'other',
          comment: rejected.comment?.trim() ?? '',
          by: rejected.reviewedBy,
        }
      : null,
  };
}

function toOperationChild(child: ChildDto) {
  return {
    id: child.id,
    name: child.displayName,
    avatar: child.avatarUrl ? authorizedImage(child.avatarUrl) : null,
  };
}

function toEarned(
  entry: WalletDto['entries'][number],
  child: ChildDto,
  familyId: string,
): Operation {
  return {
    id: entry.id,
    kind: 'earned',
    title: entry.taskTitle,
    description: entry.taskDescription ?? '',
    amount: entry.points,
    child: toOperationChild(child),
    parentId: entry.approvedBy ?? '',
    at: entry.createdAt,
    doneAt: entry.submittedAt,
    photos: (entry.attachmentIds ?? []).map((id) =>
      authorizedImage(`/families/${familyId}/task-attachments/${id}`),
    ),
    note: entry.submissionNote?.trim() || null,
    assignmentId: entry.assignmentId,
    balanceAfter:
      entry.balanceAfterPoints === undefined
        ? undefined
        : Number(entry.balanceAfterPoints),
  };
}

export type RewardPeriod = { from: string; to: string; timeZone: string };
type RewardDay = { day: string; points: string; approvedBy: string | null };

async function fetchRewardChildren(
  viewer: OperationsViewer,
  signal: AbortSignal,
): Promise<ChildDto[]> {
  if (viewer.child) {
    return [
      {
        id: viewer.child.id,
        displayName: viewer.child.name,
        avatarUrl: viewer.child.avatarUrl,
      },
    ];
  }
  return apiRequest<ChildDto[]>(`/families/${viewer.familyId}/children`, {
    signal,
  });
}

export async function fetchRewardPeriod(
  viewer: OperationsViewer,
  period: RewardPeriod,
  childFilter: string,
  signal: AbortSignal,
) {
  const { familyId, userId } = viewer;
  const children = (await fetchRewardChildren(viewer, signal)).filter(
    (child) => childFilter === 'all' || child.id === childFilter,
  );
  const bounds = { from: period.from, to: period.to };
  const aggregate = new URLSearchParams({
    ...bounds,
    timeZone: period.timeZone,
  });
  const histories = await Promise.all(
    children.map(async (child) => {
      const base = `/families/${familyId}/children/${child.id}`;
      const [days, earned, missed] = await Promise.all([
        apiRequest<RewardDay[]>(`${base}/wallet/reward-days?${aggregate}`, {
          signal,
        }),
        fetchPeriodPages(`${base}/wallet`, bounds, signal, (url) =>
          apiRequest<WalletDto>(url, { signal }).then(({ entries, next }) => ({
            items: entries,
            next,
          })),
        ),
        fetchPeriodPages(`${base}/missed-tasks`, bounds, signal, (url) =>
          apiRequest<MissedDto>(url, { signal }),
        ),
      ]);
      return {
        days: days.filter((day) => viewer.child || day.approvedBy === userId),
        operations: [
          ...earned.map((entry) => toEarned(entry, child, familyId)),
          ...missed.map((entry) => toMissed(entry, child)),
        ].filter((operation) => viewer.child || operation.parentId === userId),
      };
    }),
  );
  const earnedByDay = new Map<string, number>();
  for (const history of histories) {
    for (const { day, points } of history.days) {
      earnedByDay.set(day, (earnedByDay.get(day) ?? 0) + Number(points));
    }
  }
  return {
    earnedByDay,
    operations: histories.flatMap((history) => history.operations),
  };
}

async function fetchPeriodPages<T>(
  path: string,
  bounds: Pick<RewardPeriod, 'from' | 'to'>,
  signal: AbortSignal,
  fetchPage: (url: string) => Promise<{ items: T[]; next?: string | null }>,
) {
  const params = new URLSearchParams(bounds);
  const items: T[] = [];
  let next: string | null | undefined;
  do {
    if (signal.aborted) throw new Error('Reward history request cancelled');
    if (next) params.set('before', next);
    const page = await fetchPage(`${path}?${params}`);
    items.push(...page.items);
    next = page.next;
  } while (next);
  return items;
}

export async function fetchRewardById(
  viewer: OperationsViewer,
  id: string,
  signal: AbortSignal,
) {
  if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id)) return null;
  const { familyId, userId } = viewer;
  const children = await fetchRewardChildren(viewer, signal);
  const matches = await Promise.all(
    children.map(async (child) => {
      try {
        const entry = await apiRequest<WalletDto['entries'][number]>(
          `/families/${familyId}/children/${child.id}/wallet/rewards/${id}`,
          { signal },
        );
        return viewer.child || entry.approvedBy === userId
          ? toEarned(entry, child, familyId)
          : null;
      } catch (error) {
        if (isApiError(error) && error.status === 404) return null;
        throw error;
      }
    }),
  );
  return matches.find((match) => match !== null) ?? null;
}
