import { apiRequest } from '@shared/api';
import type { Operation } from '../model/operation';

// История наград детей с сервера: заработанные — начисления из кошельков
// детей (с названием, описанием, кто одобрил, когда сдано и комментарием),
// упущенные — назначения, не сданные к сроку (GET …/missed-tasks).

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
    /** Название и описание задания на момент запроса истории. */
    taskTitle: string;
    taskDescription: string | null;
    /** userId родителя, который одобрил (он же автор задания). */
    approvedBy: string | null;
    /** Когда сдан одобренный отчёт. */
    submittedAt: string | null;
    /** Комментарий ребёнка к одобренному отчёту; null — не писал. */
    submissionNote: string | null;
  }[];
};

type MissedDto = {
  items: {
    assignmentId: string;
    taskTitle: string;
    taskDescription: string | null;
    rewardPoints: number;
    /** Срок, который прошёл. */
    deadlineAt: string;
    /** userId родителя, создавшего задание. */
    createdBy: string;
  }[];
};

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

export async function fetchServerOperations(
  viewer: OperationsViewer,
): Promise<Operation[]> {
  const { familyId } = viewer;
  const children: ChildDto[] = viewer.child
    ? [{ id: viewer.child.id, displayName: viewer.child.name, avatarUrl: null }]
    : await apiRequest<ChildDto[]>(`/families/${familyId}/children`);
  // По каждому ребёнку — кошелёк и упущенные; не ответили — у ребёнка пусто.
  const histories = await Promise.all(
    children.map((child) =>
      Promise.all([
        apiRequest<WalletDto>(
          `/families/${familyId}/children/${child.id}/wallet`,
        ).catch(() => ({ entries: [] }) as WalletDto),
        apiRequest<MissedDto>(
          `/families/${familyId}/children/${child.id}/missed-tasks`,
        ).catch(() => ({ items: [] }) as MissedDto),
      ]),
    ),
  );
  const author = (userId: string) =>
    userId === viewer.userId ? viewer.ownAuthor : userId;
  const toChild = (child: ChildDto) => ({
    id: child.id,
    name: child.displayName,
    avatar: child.avatarUrl ? { uri: child.avatarUrl } : null,
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
        parentId: entry.approvedBy ? author(entry.approvedBy) : '',
        at: entry.createdAt,
        doneAt: entry.submittedAt,
        photo: null,
        note: entry.submissionNote?.trim() || null,
        assignmentId: entry.assignmentId,
      }),
    );
    const lost = missed.items.map(
      (item): Operation => ({
        id: item.assignmentId,
        kind: 'missed',
        title: item.taskTitle,
        description: item.taskDescription ?? '',
        amount: item.rewardPoints,
        child: toChild(child),
        parentId: author(item.createdBy),
        at: item.deadlineAt,
        doneAt: null,
        photo: null,
        note: null,
      }),
    );
    return [...earned, ...lost];
  });
}
