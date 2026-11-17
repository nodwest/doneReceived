import { apiRequest, authorizedImage } from '@shared/api';
import type { Operation } from '../model/operation';

// История наград детей с сервера: заработанные — начисления из кошельков
// детей (с названием, описанием, кто одобрил, когда сдано и комментарием),
// упущенные — назначения, не сданные к сроку (GET …/missed-tasks).

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
};

type MissedItemDto = {
  assignmentId: string;
  taskTitle: string;
  taskDescription: string | null;
  rewardPoints: number;
  /** Срок задания; у закрытого отказом мог не быть (п. 33). */
  deadlineAt: string | null;
  /** Когда истекло (п. 32). */
  expiredAt?: string | null;
  /** userId родителя, создавшего задание. */
  createdBy: string;
  /** Почему упущено и когда (п. 33); нет — истекло, время — expiredAt. */
  reason?: 'expired' | 'rejected';
  closedAt?: string | null;
};

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
    : await apiRequest<ChildDto[]>(`/families/${familyId}/children`);
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
  const toChild = (child: ChildDto) => ({
    id: child.id,
    name: child.displayName,
    avatar: child.avatarUrl ? authorizedImage(child.avatarUrl) : null,
  });

  return children.flatMap((child, index) => {
    const [wallet, missed] = histories[index];
    const earned = wallet.entries.map(
      (entry): Operation => ({
        id: entry.id,
        kind: 'earned',
        title: entry.taskTitle,
        description: entry.taskDescription ?? '',
        amount: entry.points,
        child: toChild(child),
        parentId: entry.approvedBy ?? '',
        at: entry.createdAt,
        doneAt: entry.submittedAt,
        photos: (entry.attachmentIds ?? []).map((id) =>
          authorizedImage(`/families/${familyId}/task-attachments/${id}`),
        ),
        note: entry.submissionNote?.trim() || null,
        assignmentId: entry.assignmentId,
      }),
    );
    const lost = missed.flatMap((item): Operation[] => {
      const at = item.closedAt ?? item.expiredAt ?? item.deadlineAt;
      if (!at) return [];
      return [
        {
          id: item.assignmentId,
          kind: 'missed',
          title: item.taskTitle,
          description: item.taskDescription ?? '',
          amount: item.rewardPoints,
          child: toChild(child),
          parentId: item.createdBy,
          at,
          doneAt: null,
          photos: [],
          note: null,
          assignmentId: item.assignmentId,
          dueAt: item.deadlineAt,
          missedReason: item.reason ?? 'expired',
        },
      ];
    });
    return [...earned, ...lost];
  });
}
