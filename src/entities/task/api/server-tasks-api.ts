import { apiRequest, authorizedImage } from '@shared/api';
import { appendPhoto, type PickedPhoto } from '@shared/lib';
import type { RejectReasonKey, Task, TaskState } from '../model/task';
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
  /** Шаги чеклиста по порядку; `[]` — без чеклиста. */
  checklist: { id: string; title: string }[];
};

type AssignmentDto = {
  id: string;
  childId: string;
  status: 'assigned' | 'submitted' | 'rejected' | 'approved';
  /** После отказа можно переделать; false — отказ закрыл назначение. */
  retryableRejection: boolean;
  /** Шаги чеклиста, которые ребёнок отметил. */
  checkedItemIds: string[];
  /** Отчёт, который ждёт проверки; null — не сдано, отозвано или проверено. */
  pendingSubmission?: PendingSubmissionDto | null;
  /** Последний отказ по назначению; null — отказов не было. */
  lastRejection?: LastRejectionDto | null;
};

type PendingSubmissionDto = {
  id: string;
  submittedAt: string;
  /** Комментарий ребёнка к сдаче; null — не писал. */
  note: string | null;
  /** Фото отчёта в порядке загрузки; `[]` — без фото. */
  attachments: AttachmentDto[];
};

type AttachmentDto = { id: string; contentType: string };

type LastRejectionDto = {
  reasonCode: 'not_done_properly' | 'not_finished' | 'other';
  comment: string | null;
  /** id аккаунта родителя, который отклонил. */
  reviewedBy: string;
  reviewedAt: string;
};

type RejectReasonCode = LastRejectionDto['reasonCode'];

/** Код причины отказа на сервере → ключ причины в приложении. */
const REJECT_REASONS: Record<RejectReasonCode, RejectReasonKey> = {
  not_done_properly: 'not-done-properly',
  not_finished: 'not-finished',
  other: 'other',
};

/** Ключ причины в приложении → код причины для сервера. */
export const REJECT_REASON_CODES: Record<RejectReasonKey, RejectReasonCode> = {
  'not-done-properly': 'not_done_properly',
  'not-finished': 'not_finished',
  other: 'other',
};

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

type MemberDto = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

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
  /** Ребёнок не видит список детей семьи (403): имя — его собственное. */
  childName?: string;
};

/** Фото отчёта для `<Image>`: читается с токеном. */
const attachmentImage = (familyId: string, id: string) =>
  authorizedImage(`/families/${familyId}/task-attachments/${id}`);

function toTask(
  task: TaskDto,
  assignment: AssignmentDto,
  children: readonly ChildDto[],
  members: readonly MemberDto[],
  viewer: TaskViewer,
): Task {
  const child = children.find((item) => item.id === assignment.childId);
  const author = members.find((member) => member.userId === task.createdBy);
  const pending = assignment.pendingSubmission ?? null;
  const attachments = pending?.attachments ?? [];
  const rejected = assignment.lastRejection ?? null;
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
      avatar: child?.avatarUrl ? authorizedImage(child.avatarUrl) : null,
    },
    createdBy: task.createdBy,
    authorName: author?.displayName,
    authorAvatar: author?.avatarUrl ? authorizedImage(author.avatarUrl) : null,
    createdAt: task.createdAt,
    expiresAt: task.deadlineAt,
    // Отчёт на проверке: когда сдано, фото и комментарий ребёнка.
    submissionId: pending?.id,
    doneAt: pending?.submittedAt ?? null,
    photos: attachments.map(({ id }) => attachmentImage(viewer.familyId, id)),
    note: pending?.note?.trim() || null,
    // Последний отказ остаётся и после новой сдачи: родитель видит, за что
    // возвращал.
    rejection: rejected
      ? {
          reason: REJECT_REASONS[rejected.reasonCode] ?? 'other',
          comment: rejected.comment ?? '',
          by: rejected.reviewedBy,
        }
      : null,
    checklist: task.checklist.map((item) => ({
      id: item.id,
      title: item.title,
      done: assignment.checkedItemIds.includes(item.id),
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
  // Ребёнку список детей закрыт (403) — не спрашиваем. Участников семьи
  // ребёнок видит (Идеи.md п. 8): из них имя родителя («Task from Sarah»).
  // Не ответили — автор «Родитель».
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
    apiRequest<MemberDto[]>(`/families/${familyId}/members`).catch(
      () => [] as MemberDto[],
    ),
  ]);
  const visible = items.filter(
    ({ task, assignment }) =>
      task.cancelledAt === null &&
      assignment.status !== 'approved' &&
      !(assignment.status === 'rejected' && !assignment.retryableRejection),
  );
  return visible.map(({ task, assignment }) =>
    toTask(task, assignment, children, members, viewer),
  );
}

const toBody = (payload: CreateTaskPayload) => ({
  title: payload.title,
  description: payload.description,
  deadlineAt: payload.expiresAt,
  rewardPoints: payload.reward,
});

/**
 * Чеклист для тела запроса — весь список по порядку. Шаг с `id` сервер
 * оставляет с отметкой ребёнка, без `id` — создаёт новый, пропавшие удаляет;
 * `[]` — без чеклиста (при правке убирает его).
 */
const checklistBody = (checklist: readonly ChecklistStepPayload[]) =>
  checklist.map(({ id, title }) => (id ? { id, title } : { title }));

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
      checklist: checklistBody(payload.checklist),
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
        checklist: checklistBody(payload.checklist),
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
 * ребёнка — в `note`, пустой не отправляем. С фото — multipart: `note` и
 * поле `photos` на каждый файл (до 3, по 2 МиБ). 409 — уже на проверке,
 * принято, срок истёк или `SUBMISSION_LIMIT_REACHED`; 413 — файл велик.
 */
export async function submitServerTask(
  familyId: string,
  assignmentId: string,
  note?: string,
  photos: readonly PickedPhoto[] = [],
) {
  const path = `/families/${familyId}/task-assignments/${assignmentId}/submissions`;
  if (photos.length === 0) {
    return apiRequest<unknown>(path, {
      method: 'POST',
      body: note ? { note } : {},
    });
  }
  const form = new FormData();
  if (note) form.append('note', note);
  for (const photo of photos) await appendPhoto(form, 'photos', photo);
  return apiRequest<unknown>(path, { method: 'POST', body: form });
}

/**
 * PUT /families/:id/task-assignments/:assignmentId/checklist/:itemId —
 * ребёнок отмечает шаг чеклиста (`done: true`) или снимает отметку;
 * повтор с тем же `done` — не ошибка. 409 — задание уже на проверке, принято или отменено.
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
  submission: { id: string; withdrawnAt: string | null };
  review: unknown | null;
};

/**
 * Redo: ребёнок забирает непроверенный отчёт — DELETE
 * /families/:id/task-submissions/:submissionId, назначение снова активно,
 * резерв не трогается. Ответ — отозванный отчёт с комментарием. 409 — уже
 * проверен (`SUBMISSION_ALREADY_REVIEWED`), срок прошёл
 * (`TASK_DEADLINE_PASSED`), задание отменено.
 */
export async function withdrawServerSubmission(
  familyId: string,
  assignment: PendingRef,
) {
  const submissionId = await pendingSubmissionId(familyId, assignment);
  return apiRequest<{ note: string | null }>(
    `/families/${familyId}/task-submissions/${submissionId}`,
    { method: 'DELETE' },
  );
}

/**
 * Решение родителя по отчёту, который ждёт проверки: POST
 * /families/:id/task-submissions/:submissionId/review. approved — резерв
 * уходит ребёнку. rejected — причина кодом и комментарий (у `other`
 * обязателен); `retry: true` — назначение остаётся открытым (на переделку,
 * резерв не трогается), `false` — закрывается, резерв возвращается автору.
 * 409 — отчёт отозван (`SUBMISSION_WITHDRAWN`), уже проверен или срок
 * прошёл, а просили переделку (`TASK_DEADLINE_PASSED`).
 */
export async function reviewServerSubmission(
  familyId: string,
  assignment: PendingRef,
  review:
    | { decision: 'approved' }
    | {
        decision: 'rejected';
        reasonCode: RejectReasonCode;
        comment?: string;
        retry: boolean;
      },
) {
  const submissionId = await pendingSubmissionId(familyId, assignment);
  await apiRequest<unknown>(
    `/families/${familyId}/task-submissions/${submissionId}/review`,
    { method: 'POST', body: review },
  );
}

/** Назначение и его отчёт на проверке, если он уже есть в списке заданий. */
export type PendingRef = { id: string; submissionId?: string };

/**
 * Отчёт, который ждёт проверки: обычно уже пришёл в списке заданий
 * (`pendingSubmission`). Если список ещё не перечитан после сдачи — ищем
 * в отчётах назначения (отозванные сервер скрывает).
 */
async function pendingSubmissionId(
  familyId: string,
  { id, submissionId }: PendingRef,
) {
  if (submissionId) return submissionId;
  const submissions = await apiRequest<SubmissionDto[]>(
    `/families/${familyId}/task-assignments/${id}/submissions`,
  );
  const pending = submissions.find(
    ({ submission, review }) => review === null && !submission.withdrawnAt,
  );
  if (!pending) throw new Error('No pending submission');
  return pending.submission.id;
}
