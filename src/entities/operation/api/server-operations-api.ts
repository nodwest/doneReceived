import { apiRequest } from '@shared/api';
import type { Operation } from '../model/operation';

// История наград детей с сервера. Отдельной ручки истории нет: собираем из
// кошельков детей (начисление — заработанная награда, за какое назначение)
// и списка заданий (название, описание, автор, срок). Упущенная награда —
// назначение, не сданное к сроку.

/** Кто смотрит историю. */
export type OperationsViewer = {
  familyId: string;
  /** id аккаунта вошедшего. */
  userId: string;
  /** Каким id пометить вошедшего родителя (экраны считают его «собой»). */
  ownAuthor: string;
  /** Вошёл ребёнок: только его история (список детей ему закрыт). */
  child?: { id: string; name: string };
};

type WalletDto = {
  entries: {
    id: string;
    assignmentId: string;
    points: number;
    createdAt: string;
    /** Когда сдан одобренный отчёт (Идеи.md п. 19, 27); пока не приходит. */
    submittedAt?: string | null;
    /** Комментарий ребёнка к одобренному отчёту (Идеи.md п. 27). */
    submissionNote?: string | null;
  }[];
};

type TaskItemDto = {
  task: {
    createdBy: string;
    title: string;
    description: string | null;
    deadlineAt: string | null;
    rewardPoints: number;
    cancelledAt: string | null;
  };
  assignment: { id: string; childId: string; status: string };
};

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

export async function fetchServerOperations(
  viewer: OperationsViewer,
): Promise<Operation[]> {
  const { familyId } = viewer;
  const [children, tasks] = await Promise.all([
    viewer.child
      ? [
          {
            id: viewer.child.id,
            displayName: viewer.child.name,
            avatarUrl: null,
          },
        ]
      : apiRequest<ChildDto[]>(`/families/${familyId}/children`),
    apiRequest<TaskItemDto[]>(`/families/${familyId}/tasks`),
  ]);
  const wallets = await Promise.all(
    children.map((child) =>
      apiRequest<WalletDto>(
        `/families/${familyId}/children/${child.id}/wallet`,
      ).catch(() => ({ entries: [] }) as WalletDto),
    ),
  );
  const byAssignment = new Map(tasks.map((item) => [item.assignment.id, item]));
  const author = (createdBy: string) =>
    createdBy === viewer.userId ? viewer.ownAuthor : createdBy;
  const toChild = (child: ChildDto) => ({
    id: child.id,
    name: child.displayName,
    avatar: child.avatarUrl ? { uri: child.avatarUrl } : null,
  });

  const earned = children.flatMap((child, index) =>
    wallets[index].entries.map((entry): Operation => {
      const item = byAssignment.get(entry.assignmentId);
      return {
        id: entry.id,
        kind: 'earned',
        title: item?.task.title ?? '—',
        description: item?.task.description ?? '',
        amount: entry.points,
        child: toChild(child),
        parentId: item ? author(item.task.createdBy) : '',
        at: entry.createdAt,
        doneAt: entry.submittedAt ?? null,
        photo: null,
        note: entry.submissionNote?.trim() || null,
      };
    }),
  );

  // Срок прошёл, а задание так и не сдано и не отменено — награда упущена.
  const now = Date.now();
  const missed = tasks.flatMap(({ task, assignment }): Operation[] => {
    const child = children.find((item) => item.id === assignment.childId);
    const overdue =
      task.deadlineAt !== null && new Date(task.deadlineAt).getTime() < now;
    if (
      !child ||
      !overdue ||
      task.cancelledAt !== null ||
      (assignment.status !== 'assigned' && assignment.status !== 'rejected')
    ) {
      return [];
    }
    return [
      {
        id: assignment.id,
        kind: 'missed',
        title: task.title,
        description: task.description ?? '',
        amount: task.rewardPoints,
        child: toChild(child),
        parentId: author(task.createdBy),
        at: task.deadlineAt as string,
        doneAt: null,
        photo: null,
        note: null,
      },
    ];
  });

  return [...earned, ...missed];
}
