import { apiRequest } from '@shared/api';
import type { Task, TaskState } from '../model/task';
import type { CreateTaskPayload, UpdateTaskPayload } from '../model/types';

// Настоящие задания: детям семьи с сервера. Задание (task) на сервере
// назначается детям (assignment); в приложении одна задача — одно
// назначение, её id — id назначения, `serverTaskId` — id задания.

type TaskDto = {
  id: string;
  createdBy: string;
  title: string;
  description: string | null;
  deadlineAt: string | null;
  rewardPoints: number;
  createdAt: string;
  cancelledAt: string | null;
};

type AssignmentDto = {
  id: string;
  childId: string;
  status: 'assigned' | 'submitted' | 'rejected' | 'approved';
};

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

/** Статус назначения → статус задачи в приложении. */
const STATES: Record<AssignmentDto['status'], TaskState> = {
  assigned: 'active',
  rejected: 'active',
  submitted: 'review',
  approved: 'done',
};

/** Кто смотрит список: чтобы его задания считались «моими» на экранах. */
export type TaskViewer = {
  familyId: string;
  /** id аккаунта вошедшего (`user.id` в сессии). */
  userId: string;
  /**
   * Каким автором пометить задания вошедшего родителя: экраны считают
   * «моими» задания этого автора (пока это id моковой Sarah).
   */
  ownAuthor: string;
  /** Ребёнок не видит список детей семьи (403): имя — его собственное. */
  childName?: string;
};

function toTask(
  task: TaskDto,
  assignment: AssignmentDto,
  children: readonly ChildDto[],
  viewer: TaskViewer,
): Task {
  const child = children.find((item) => item.id === assignment.childId);
  return {
    id: assignment.id,
    serverTaskId: task.id,
    title: task.title,
    description: task.description ?? '',
    reward: task.rewardPoints,
    status: STATES[assignment.status],
    assignee: {
      id: assignment.childId,
      name: child?.displayName ?? viewer.childName ?? '—',
      avatar: child?.avatarUrl ? { uri: child.avatarUrl } : null,
    },
    createdBy:
      task.createdBy === viewer.userId ? viewer.ownAuthor : task.createdBy,
    createdAt: task.createdAt,
    expiresAt: task.deadlineAt,
    // Когда сдано, фото и отказ — в отчётах назначения (шаги 3–4).
    doneAt: null,
    photo: null,
    rejection: null,
  };
}

/**
 * GET /families/:id/tasks — назначения семьи (ребёнку — только свои), до 100
 * последних, и имена детей (GET /families/:id/children; ребёнку он закрыт).
 * Отменённые и подтверждённые в список не идут.
 */
export async function fetchServerTasks(viewer: TaskViewer): Promise<Task[]> {
  const { familyId } = viewer;
  const [items, children] = await Promise.all([
    apiRequest<{ task: TaskDto; assignment: AssignmentDto }[]>(
      `/families/${familyId}/tasks`,
    ),
    apiRequest<ChildDto[]>(`/families/${familyId}/children`).catch(
      () => [] as ChildDto[],
    ),
  ]);
  return items
    .filter(
      ({ task, assignment }) =>
        task.cancelledAt === null && assignment.status !== 'approved',
    )
    .map(({ task, assignment }) => toTask(task, assignment, children, viewer));
}

const toBody = (payload: CreateTaskPayload) => ({
  title: payload.title,
  description: payload.description,
  deadlineAt: payload.expiresAt,
  rewardPoints: payload.reward,
});

/**
 * POST /families/:id/tasks — задание ребёнку; награда резервируется в
 * кошельке автора. 409 — не хватает денег на резерв.
 */
export function createServerTask(familyId: string, payload: CreateTaskPayload) {
  const { description, deadlineAt, ...body } = toBody(payload);
  return apiRequest<unknown>(`/families/${familyId}/tasks`, {
    method: 'POST',
    body: {
      ...body,
      // Пустые необязательные поля не отправляем: сервер ждёт их отсутствия.
      ...(description ? { description } : {}),
      ...(deadlineAt ? { deadlineAt } : {}),
      childIds: [payload.assigneeId],
    },
  });
}

/**
 * PATCH /families/:id/tasks/:taskId — правка задания (только автор). Пустое
 * описание и срок отправляются как null — сервер их очищает. 409 —
 * `TASK_ON_REVIEW`, `TASK_CANCELLED` или `INSUFFICIENT_FUNDS` (не хватает на
 * новую награду, ничего не меняется).
 */
export function updateServerTask(familyId: string, payload: UpdateTaskPayload) {
  const body = toBody(payload);
  return apiRequest<unknown>(
    `/families/${familyId}/tasks/${payload.serverTaskId}`,
    {
      method: 'PATCH',
      body: { ...body, description: body.description || null },
    },
  );
}

/**
 * DELETE /families/:id/tasks/:taskId — автор отменяет задание; невыплаченный
 * резерв возвращается в его кошелёк.
 */
export function cancelServerTask(familyId: string, serverTaskId: string) {
  return apiRequest<null>(`/families/${familyId}/tasks/${serverTaskId}`, {
    method: 'DELETE',
  });
}
