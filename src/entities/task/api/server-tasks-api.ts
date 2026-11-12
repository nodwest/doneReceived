import { apiRequest } from '@shared/api';
import type { Task, TaskState } from '../model/task';
import type {
  ChecklistStepPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '../model/types';

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
  /** Шаги чеклиста по порядку (Идеи.md п. 26); пока сервер их не отдаёт. */
  checklist?: { id: string; title: string }[];
};

type AssignmentDto = {
  id: string;
  childId: string;
  status: 'assigned' | 'submitted' | 'rejected' | 'approved';
  /** После отказа можно переделать; false — отказ закрыл назначение. */
  retryableRejection: boolean;
  /** Шаги чеклиста, которые ребёнок отметил (Идеи.md п. 26). */
  checkedItemIds?: string[];
};

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

type MemberDto = { userId: string; displayName: string };

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
  members: readonly MemberDto[],
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
    authorName: members.find((member) => member.userId === task.createdBy)
      ?.displayName,
    createdAt: task.createdAt,
    expiresAt: task.deadlineAt,
    // Когда сдано, фото и отказ — в отчётах назначения (шаги 3–4).
    doneAt: null,
    photo: null,
    note: null,
    rejection: null,
    checklist: (task.checklist ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      done: assignment.checkedItemIds?.includes(item.id) ?? false,
    })),
  };
}

/**
 * GET /families/:id/tasks — назначения семьи (ребёнку — только свои), до 100
 * последних, и имена детей (GET /families/:id/children). Ребёнку список
 * детей закрыт (403), его не спрашиваем: имя — из сессии. Отменённые,
 * подтверждённые и закрытые отказом (`rejected` без `retryableRejection`)
 * в список не идут.
 */
export async function fetchServerTasks(viewer: TaskViewer): Promise<Task[]> {
  const { familyId } = viewer;
  // Ребёнку списки детей и участников закрыты (403) — не спрашиваем.
  const parent = viewer.childName === undefined;
  const [items, children, members] = await Promise.all([
    apiRequest<{ task: TaskDto; assignment: AssignmentDto }[]>(
      `/families/${familyId}/tasks`,
    ),
    parent
      ? apiRequest<ChildDto[]>(`/families/${familyId}/children`).catch(
          () => [] as ChildDto[],
        )
      : ([] as ChildDto[]),
    parent
      ? apiRequest<MemberDto[]>(`/families/${familyId}/members`).catch(
          () => [] as MemberDto[],
        )
      : ([] as MemberDto[]),
  ]);
  const tasks = items
    .filter(
      ({ task, assignment }) =>
        task.cancelledAt === null &&
        assignment.status !== 'approved' &&
        !(assignment.status === 'rejected' && !assignment.retryableRejection),
    )
    .map(({ task, assignment }) => ({
      task: toTask(task, assignment, children, members, viewer),
      assignment,
    }));
  return Promise.all(
    tasks.map(({ task, assignment }) =>
      withSubmissions(task, assignment, viewer),
    ),
  );
}

/**
 * Из отчётов назначения: у сданного — когда ребёнок нажал «I did it!»
 * (`doneAt`) и его комментарий (`note`), у возвращённого на переделку (`rejected` с
 * `retryableRejection`, Идеи.md п. 15) — причина последнего отказа. Отчёты
 * спрашиваем только у таких назначений; не ответили — задание без них.
 */
async function withSubmissions(
  task: Task,
  assignment: AssignmentDto,
  viewer: TaskViewer,
): Promise<Task> {
  const sentBack =
    assignment.status === 'rejected' && assignment.retryableRejection;
  if (assignment.status !== 'submitted' && !sentBack) return task;
  const submissions = await apiRequest<SubmissionDto[]>(
    `/families/${viewer.familyId}/task-assignments/${assignment.id}/submissions`,
  ).catch(() => [] as SubmissionDto[]);
  const latest = (list: SubmissionDto[]) =>
    [...list].sort((a, b) =>
      b.submission.submittedAt.localeCompare(a.submission.submittedAt),
    )[0];
  const pending = latest(
    submissions.filter(
      ({ submission, review }) => review === null && !submission.withdrawnAt,
    ),
  );
  const rejected = latest(
    submissions.filter(({ review }) => review?.decision === 'rejected'),
  );
  return {
    ...task,
    doneAt: pending?.submission.submittedAt ?? task.doneAt,
    note: pending?.submission.note?.trim() || null,
    // Причина приходит словами («Не доделано. Кровать не заправлена»): она
    // целиком — комментарий.
    rejection:
      sentBack && rejected?.review
        ? {
            reason: 'other',
            comment: rejected.review.reason ?? '',
            by:
              rejected.review.reviewedBy === viewer.userId
                ? viewer.ownAuthor
                : rejected.review.reviewedBy,
          }
        : task.rejection,
  };
}

const toBody = (payload: CreateTaskPayload) => ({
  title: payload.title,
  description: payload.description,
  deadlineAt: payload.expiresAt,
  rewardPoints: payload.reward,
});

/**
 * Чеклист для тела запроса. Пока сервер его не принимает (Идеи.md п. 26),
 * пустой не отправляем, чтобы задания без чеклиста создавались и правились
 * как раньше. Когда сервер научится, при правке отправлять всегда: `[]`
 * убирает чеклист.
 */
const checklistBody = (checklist: readonly ChecklistStepPayload[]) =>
  checklist.length > 0
    ? {
        checklist: checklist.map(({ id, title }) =>
          id ? { id, title } : { title },
        ),
      }
    : {};

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
      ...checklistBody(payload.checklist),
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
      body: {
        ...body,
        description: body.description || null,
        ...checklistBody(payload.checklist),
      },
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

/**
 * POST /families/:id/task-assignments/:assignmentId/submissions — ребёнок
 * отправляет отчёт («I did it!»), назначение уходит на проверку. Комментарий
 * ребёнка — в `note`, пустой не отправляем; фото пока нет. 409 — уже на
 * проверке, принято или срок истёк.
 */
export function submitServerTask(
  familyId: string,
  assignmentId: string,
  note?: string,
) {
  return apiRequest<unknown>(
    `/families/${familyId}/task-assignments/${assignmentId}/submissions`,
    { method: 'POST', body: note ? { note } : {} },
  );
}

/**
 * PUT /families/:id/task-assignments/:assignmentId/checklist/:itemId —
 * ребёнок отмечает шаг чеклиста (`done: true`) или снимает отметку
 * (Идеи.md п. 26). 409 — задание уже на проверке, принято или отменено.
 */
export function tickServerChecklist(
  familyId: string,
  assignmentId: string,
  itemId: string,
  done: boolean,
) {
  return apiRequest<unknown>(
    `/families/${familyId}/task-assignments/${assignmentId}/checklist/${itemId}`,
    { method: 'PUT', body: { done } },
  );
}

type SubmissionDto = {
  submission: {
    id: string;
    submittedAt: string;
    withdrawnAt?: string | null;
    /** Комментарий ребёнка к сдаче. */
    note?: string | null;
  };
  review: {
    decision: 'approved' | 'rejected';
    reason: string | null;
    reviewedBy: string;
    reviewedAt: string;
  } | null;
};

/**
 * Redo: ребёнок забирает непроверенный отчёт — назначение снова активно,
 * резерв не трогается. Сначала находим отчёт, который ждёт проверки (GET
 * …/submissions, отозванные сервер скрывает), потом DELETE
 * /families/:id/task-submissions/:submissionId. 409 — уже проверен
 * (`SUBMISSION_ALREADY_REVIEWED`), срок прошёл (`TASK_DEADLINE_PASSED`),
 * задание отменено.
 */
export async function withdrawServerSubmission(
  familyId: string,
  assignmentId: string,
) {
  const submissionId = await findPendingSubmission(familyId, assignmentId);
  await apiRequest<null>(
    `/families/${familyId}/task-submissions/${submissionId}`,
    { method: 'DELETE' },
  );
}

/**
 * Решение родителя по отчёту, который ждёт проверки: POST
 * /families/:id/task-submissions/:submissionId/review. approved — резерв
 * уходит ребёнку; rejected (с причиной) — пока назначение закрывается и
 * резерв возвращается автору (на переделку сервер ещё не умеет, Идеи.md
 * п. 15). 409 — отчёт отозван (`SUBMISSION_WITHDRAWN`) или уже проверен.
 */
export async function reviewServerSubmission(
  familyId: string,
  assignmentId: string,
  review: { decision: 'approved' } | { decision: 'rejected'; reason: string },
) {
  const submissionId = await findPendingSubmission(familyId, assignmentId);
  await apiRequest<unknown>(
    `/families/${familyId}/task-submissions/${submissionId}/review`,
    { method: 'POST', body: review },
  );
}

/** Отчёт по назначению, который ждёт проверки (отозванные сервер скрывает). */
async function findPendingSubmission(familyId: string, assignmentId: string) {
  const submissions = await apiRequest<SubmissionDto[]>(
    `/families/${familyId}/task-assignments/${assignmentId}/submissions`,
  );
  const pending = submissions.find(
    ({ submission, review }) => review === null && !submission.withdrawnAt,
  );
  if (!pending) throw new Error('No pending submission');
  return pending.submission.id;
}
